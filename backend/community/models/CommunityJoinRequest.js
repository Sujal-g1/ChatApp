import mongoose from "mongoose";

const communityJoinRequestSchema = new mongoose.Schema(
  {
    // Community
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
      index: true,
    },

    // User requesting access
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Current status
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },

    // Optional message from the user
    message: {
      type: String,
      default: "",
      maxlength: 300,
      trim: true,
    },

    requestSource: {
  type: String,
  enum: ["manual", "invite", "link"],
  default: "manual",
},

    // Which admin reviewed it
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Review time
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only have ONE active request per community -> dropped


// Faster admin queries
communityJoinRequestSchema.index({
  communityId: 1,
  status: 1,
});

const CommunityJoinRequest =
  mongoose.models.CommunityJoinRequest ||
  mongoose.model(
    "CommunityJoinRequest",
    communityJoinRequestSchema
  );

export default CommunityJoinRequest;