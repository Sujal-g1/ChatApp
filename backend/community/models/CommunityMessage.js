import mongoose from "mongoose";

const communityMessageSchema = new mongoose.Schema(
  {
    // Community this message belongs to
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
      index: true,
    },

    // User who sent the message
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Message text
    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    // Type of message
    messageType: {
      type: String,
      enum: [
        "text",
        "image",
        "audio",
        "file",
        "system",
      ],
      default: "text",
    },

    // Optional media/file URL
    mediaUrl: {
      type: String,
      default: "",
    },

    // Message this message is replying to
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityMessage",
      default: null,
    },

    // Soft deletion
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Automatic expiration time
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Efficient message history queries
communityMessageSchema.index({
  communityId: 1,
  createdAt: -1,
});

// MongoDB TTL index
communityMessageSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      expiresAt: {
        $type: "date",
      },
    },
  }
);

const CommunityMessage =
  mongoose.models.CommunityMessage ||
  mongoose.model(
    "CommunityMessage",
    communityMessageSchema
  );

export default CommunityMessage;