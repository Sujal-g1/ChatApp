import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

    audio: {
      type: String,
      default: null,
    },

    seen: {
      type: Boolean,
      default: false,
    },

    // End-to-End Encryption
    cipherText: {
      type: String,
      default: null,
    },

    nonce: {
      type: String,
      default: null,
    },

    // Self-destruct messages
    deleteMode: {
      type: String,
      enum: ["10s", "1m", "1h", "24h", "7d"],
      default: "24h",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index for auto-deleting expired messages
messageSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Chat query optimization
messageSchema.index({
  senderId: 1,
  receiverId: 1,
  createdAt: -1,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;