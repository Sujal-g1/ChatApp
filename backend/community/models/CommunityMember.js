import mongoose from "mongoose";

const communityMemberSchema = new mongoose.Schema(
  {
    // Community
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
      index: true,
    },

    // User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Community Role
    role: {
      type: String,
      enum: [
        "owner",
        "admin",
        "moderator",
        "verified",
        "member",
      ],
      default: "member",
    },

    // Anonymous Identity
    identityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityIdentity",
      default: null,
    },

    // Notifications
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    // Member Status
    status: {
      type: String,
      enum: [
        "active",
        "muted",
        "left",
        "removed",
        "banned",
      ],
      default: "active",
    },

    // Last Seen
    lastSeen: {
      type: Date,
      default: Date.now,
    },

    // Joined At
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate membership
communityMemberSchema.index(
  {
    communityId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

communityMemberSchema.index({
  communityId: 1,
  role: 1,
});

communityMemberSchema.index({
  userId: 1,
});

const CommunityMember = mongoose.model(
  "CommunityMember",
  communityMemberSchema
);

export default CommunityMember;