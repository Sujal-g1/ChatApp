import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    // Community Name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    // Unique URL Friendly Name
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // About Community
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    // Community Icon
    icon: {
      type: String,
      default: "",
    },

    // Community Banner
    banner: {
      type: String,
      default: "",
    },

    // Community Owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Who can join
    visibility: {
      type: String,
      enum: [
        "public",
        "approval",
        "private",
      ],
      default: "approval",
    },

    // Community Category
    category: {
      type: String,
      enum: [
        "Technology",
        "Programming",
        "AI",
        "Finance",
        "Gaming",
        "Education",
        "Health",
        "Movies",
        "Music",
        "Sports",
        "Business",
        "Travel",
        "Other",
      ],
      default: "Other",
    },

    // Search Tags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Preferred Language
    language: {
      type: String,
      default: "English",
    },

    // Country / Region
    country: {
      type: String,
      default: "Global",
    },

    // Cached Statistics
    memberCount: {
      type: Number,
      default: 1,
      min: 0,
    },

    onlineCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    activityScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Auto Delete Messages
    messageTTL: {
      type: String,
      enum: [
        "30m",
        "1h",
        "6h",
        "24h",
        "7d",
      ],
      default: "1h",
    },

    // Max Concurrent Online Members
    maxOnlineUsers: {
      type: Number,
      default: 500,
    },

    // Community Status
    status: {
      type: String,
      enum: [
        "active",
        "archived",
        "suspended",
      ],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
communitySchema.index({ slug: 1 });
communitySchema.index({ category: 1 });
communitySchema.index({ ownerId: 1 });

const Community = mongoose.model(
  "Community",
  communitySchema
);

export default Community;