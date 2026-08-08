import mongoose from "mongoose";
import Community from "../models/Community.js";
import CommunityMember from "../models/CommunityMember.js";
import CommunityJoinRequest from "../models/CommunityJoinRequest.js";

/**
 * Request to join a community
 */
export const requestToJoin = async ({
  communityId,
  userId,
  message = "",
}) => {

  // Community exists?
  const community = await Community.findById(communityId);

  if (!community) {
    throw new Error("Community not found.");
  }

  // Already a member?
  const existingMember = await CommunityMember.findOne({
    communityId,
    userId,
  });

  if (existingMember) {
    throw new Error("You are already a member.");
  }

  // Already requested?
  const existingRequest =
    await CommunityJoinRequest.findOne({
      communityId,
      userId,
      status: "pending",
    });

  if (existingRequest) {
    throw new Error(
      "Join request already pending."
    );
  }

  const request =
    await CommunityJoinRequest.create({
      communityId,
      userId,
      message,
    });

  return request;
};

/**
 * Cancel Join Request
 */
export const cancelJoinRequest = async (
  communityId,
  userId
) => {

  const deleted =
    await CommunityJoinRequest.findOneAndDelete({

      communityId,

      userId,

      status: "pending",

    });

  if (!deleted) {
    throw new Error(
      "No pending request found."
    );
  }

  return true;
};

/**
 * Get My Join Request
 */
export const getMyRequest = async (
  communityId,
  userId
) => {

  return await CommunityJoinRequest.findOne({

    communityId,

    userId,

  });

};

// get all pending requests for a community, used by owner/admin to approve/reject requests
export const getPendingRequests = async (communityId) => {

  return await CommunityJoinRequest
    .find({
      communityId,
      status: "pending",
    })
    .populate(
      "userId",
      "fullName username profilePic"
    )
    .sort({
      createdAt: 1,
    });

};

// approve req
export const approveJoinRequest = async (requestId) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    const request = await CommunityJoinRequest.findById(requestId).session(session);

    if (!request) {
      throw new Error("Join request not found.");
    }

    if (request.status !== "pending") {
      throw new Error("Request already processed.");
    }

    // Check if already a member
    const existingMember = await CommunityMember.findOne({
      communityId: request.communityId,
      userId: request.userId,
    }).session(session);

    if (existingMember) {
      throw new Error("User is already a member.");
    }

    // Create member
    await CommunityMember.create(
      [{
        communityId: request.communityId,
        userId: request.userId,
        role: "member",
      }],
      { session }
    );

    // Update request
    request.status = "approved";
    await request.save({ session });

    // Increase member count
    await Community.findByIdAndUpdate(
      request.communityId,
      {
        $inc: {
          memberCount: 1,
        },
      },
      { session }
    );

    await session.commitTransaction();

    return request;

  } catch (error) {

    await session.abortTransaction();
    throw error;

  } finally {

    session.endSession();

  }

};


export const rejectJoinRequest = async (requestId) => {

  const request =
    await CommunityJoinRequest.findById(requestId);

  if (!request) {
    throw new Error("Join request not found.");
  }

  if (request.status !== "pending") {
    throw new Error("Request already processed.");
  }

  request.status = "rejected";

  await request.save();

  return request;
};