import Community from "../models/Community.js";
import CommunityMember from "../models/CommunityMember.js";
import CommunityMessage from "../models/CommunityMessage.js";
import { COMMUNITY_PERMISSIONS, } from "../config/permissions.js";

/**
 * Check whether a user is an active member
 * of a community.
 */
const getActiveMember = async (communityId, userId) => {
  return await CommunityMember.findOne({
    communityId,
    userId,
    status: "active",
  });
};

/**
 * Convert Community messageTTL into milliseconds.
 */
const getTTLInMilliseconds = (messageTTL) => {
  const ttlMap = {
    "30m": 30 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "6h": 6 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  };

  return ttlMap[messageTTL] || ttlMap["1h"];
};

/**
 * Calculate message expiration time
 * using the community's messageTTL setting.
 */
const calculateExpiresAt = (messageTTL) => {
  const ttl = getTTLInMilliseconds(messageTTL);

  return new Date(Date.now() + ttl);
};

/**
 * Send a community message.
 */
export const sendCommunityMessage = async ({
  communityId,
  userId,
  content,
  messageType = "text",
  mediaUrl = "",
  replyTo = null,
}) => {
  // Community must exist
  const community = await Community.findById(communityId);

  if (!community) {
    throw new Error("Community not found.");
  }

  // Community must be active
  if (community.status !== "active") {
    throw new Error(
      "This community is not currently active."
    );
  }

  // Sender must be an active member
  const member = await getActiveMember(
    communityId,
    userId
  );

  if (!member) {
    throw new Error(
      "You are not an active member of this community."
    );
  }

  // Text message must contain content
  if (
    messageType === "text" &&
    (!content || !content.trim())
  ) {
    throw new Error(
      "Message content is required."
    );
  }

  // Validate reply target if supplied
  if (replyTo) {
    const replyMessage =
      await CommunityMessage.findOne({
        _id: replyTo,
        communityId,
      });

    if (!replyMessage) {
      throw new Error(
        "Reply message not found in this community."
      );
    }
  }

  // Create message
  const message =
    await CommunityMessage.create({
      communityId,
      senderId: userId,
      content: content || "",
      messageType,
      mediaUrl,
      replyTo,
      expiresAt:
        calculateExpiresAt(
          community.messageTTL
        ),
    });

  // Return populated sender information
  return await CommunityMessage.findById(
    message._id
  ).populate(
    "senderId",
    "fullName username profilePic"
  );
};

/**
 * Get community messages.
 */
export const getCommunityMessages = async ({
  communityId,
  userId,
  limit = 30,
}) => {
  // Community must exist
  const community = await Community.findById(
    communityId
  );

  if (!community) {
    throw new Error("Community not found.");
  }

  // User must be an active member
  const member = await getActiveMember(
    communityId,
    userId
  );

  if (!member) {
    throw new Error(
      "You are not an active member of this community."
    );
  }

  const messages =
    await CommunityMessage.find({
      communityId,
      isDeleted: false,
    })
      .populate(
        "senderId",
        "fullName username profilePic"
      )
      .populate(
        "replyTo",
        "senderId content messageType"
      )
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit));

  return messages.reverse();
};

/**
 * Get one community message.
 */
export const getCommunityMessage = async ({
  communityId,
  userId,
  messageId,
}) => {
  // User must be an active member
  const member = await getActiveMember(
    communityId,
    userId
  );

  if (!member) {
    throw new Error(
      "You are not an active member of this community."
    );
  }

  const message =
    await CommunityMessage.findOne({
      _id: messageId,
      communityId,
      isDeleted: false,
    })
      .populate(
        "senderId",
        "fullName username profilePic"
      )
      .populate(
        "replyTo",
        "senderId content messageType"
      );

  if (!message) {
    throw new Error(
      "Community message not found."
    );
  }

  return message;
};

/**
 * Delete a community message.
 *
 * Currently only the sender can delete
 * their own message.
 */
export const deleteCommunityMessage = async ({
  communityId,
  userId,
  messageId,
}) => {
  const message = await CommunityMessage.findOne({
    _id: messageId,
    communityId,
  });

  if (!message) {
    throw new Error(
      "Community message not found."
    );
  }

  const member = await getActiveMember(
    communityId,
    userId
  );

  if (!member) {
    throw new Error(
      "You are not an active member of this community."
    );
  }

  const isSender =
    message.senderId.toString() ===
    userId.toString();

  if (!isSender) {
    const rolePermissions =
      COMMUNITY_PERMISSIONS[member.role] || [];

    const canModerate =
      rolePermissions.includes(
        "message:moderate"
      );

    if (!canModerate) {
      throw new Error(
        "You do not have permission to delete this message."
      );
    }
  }

  message.isDeleted = true;
  message.content = "";
  message.mediaUrl = "";

  await message.save();

  return message;
};