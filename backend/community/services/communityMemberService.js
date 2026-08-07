import mongoose from "mongoose";
import Community from "../models/Community.js";
import CommunityMember from "../models/CommunityMember.js";

export const leaveCommunity = async ( communityId, userId ) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    const member = await CommunityMember.findOne({
      communityId,
      userId,
    }).session(session);

    if (!member) {
      throw new Error("You are not a member.");
    }

    if (member.role === "owner") {
      throw new Error(
        "Transfer ownership before leaving the community."
      );
    }

    await CommunityMember.deleteOne(
      {
        _id: member._id,
      },
      { session }
    );

    await Community.findByIdAndUpdate(
      communityId,
      {
        $inc: {
          memberCount: -1,
        },
      },
      { session }
    );

    await session.commitTransaction();

    return true;

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }

};

export const getCommunityMembers = async ( communityId ) => {

  const members =
    await CommunityMember.find({
      communityId,
    }).populate(
      "userId",
      "fullName username profilePic"
    );

  const roleOrder = {
    owner: 1,
    admin: 2,
    moderator: 3,
    member: 4,
  };

  members.sort((a, b) => {

    return (
      roleOrder[a.role] -
      roleOrder[b.role]
    );

  });

  return members;

};

export const updateMemberRole = async (
  memberId,
  currentUserRole,
  newRole
) => {

  const member =
    await CommunityMember.findById(memberId);

  if (!member) {
    throw new Error("Member not found.");
  }

  if (member.role === "owner") {
    throw new Error(
      "Owner role cannot be changed."
    );
  }

  // Owner permissions
  if (currentUserRole === "owner") {

    member.role = newRole;

    await member.save();

    return member;

  }

  // Admin permissions
  if (currentUserRole === "admin") {

    if (
      member.role === "admin"
    ) {
      throw new Error(
        "Admins cannot modify another admin."
      );
    }

    if (
      newRole === "admin"
    ) {
      throw new Error(
        "Only owner can promote admins."
      );
    }

    member.role = newRole;

    await member.save();

    return member;

  }

  throw new Error(
    "Insufficient permissions."
  );

};

export const removeMember = async (
  memberId,
  currentUserRole,
  currentUserId
) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    const member =
      await CommunityMember.findById(memberId)
      .session(session);

    if (!member) {
      throw new Error("Member not found.");
    }

    // Cannot remove yourself
    if (member.userId.toString() === currentUserId.toString()) {
      throw new Error(
        "Use Leave Community to remove yourself."
      );
    }

    // Cannot remove owner
    if (member.role === "owner") {
      throw new Error(
        "Owner cannot be removed."
      );
    }

    const hierarchy = {
      owner: 4,
      admin: 3,
      moderator: 2,
      member: 1,
    };

    if (
      hierarchy[currentUserRole] <=
      hierarchy[member.role]
    ) {
      throw new Error(
        "You cannot remove this member."
      );
    }

    await CommunityMember.deleteOne(
      {
        _id: memberId,
      },
      { session }
    );

    await Community.findByIdAndUpdate(
      member.communityId,
      {
        $inc: {
          memberCount: -1,
        },
      },
      { session }
    );

    await session.commitTransaction();

    return true;

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }

};


// Only the Owner can transfer ownership.
// New owner must already be a community member.
// New owner cannot already be the owner.
// Old owner automatically becomes Admin.
// Everything happens inside one MongoDB transaction.
export const transferOwnership = async (
  communityId,
  memberId,
  currentUserId
) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    // Current Owner
    const currentOwner =
      await CommunityMember.findOne({
        communityId,
        userId: currentUserId,
        role: "owner",
      }).session(session);

    if (!currentOwner) {
      throw new Error("Only the owner can transfer ownership.");
    }

    // New Owner
    const newOwner =
      await CommunityMember.findById(memberId)
      .session(session);

    if (!newOwner) {
      throw new Error("Member not found.");
    }

    if (
      newOwner.communityId.toString() !==
      communityId.toString()
    ) {
      throw new Error("Invalid member.");
    }

    if (newOwner.role === "owner") {
      throw new Error("This member is already the owner.");
    }

    // Transfer roles
    currentOwner.role = "admin";

    newOwner.role = "owner";

    await currentOwner.save({ session });

    await newOwner.save({ session });

    // Update Community ownerId
    await Community.findByIdAndUpdate(

      communityId,

      {
        ownerId: newOwner.userId,
      },

      { session }

    );

    await session.commitTransaction();

    return {

      previousOwner: currentOwner,

      newOwner,

    };

  } catch (error) {

    await session.abortTransaction();

    throw error;

  } finally {

    session.endSession();

  }

};