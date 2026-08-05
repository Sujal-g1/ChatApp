import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    zingleeId: {
      type: String,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
  type: String,
  validate: {
    validator(value) {
      if (this.googleId) return true;
      return value && value.length >= 6;
    },
    message: "Password must be at least 6 characters.",
  },
},

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },

    googleId: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },

    allowFriendRequests: {
      type: Boolean,
      default: true,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // E2E Encryption
    publicKey: {
      type: String,
      default: "",
    },

    encryptedPrivateKey: {
    type: String,
    default: "",
},

encryptionIV: {
    type: String,
    default: "",
},

encryptionAuthTag: {
    type: String,
    default: "",
},

keyVersion: {
    type: Number,
    default: 1,
},
  },
  {
    timestamps: true,
  }
);

// Indexes
// userSchema.index({ username: 1 });
// userSchema.index({ zingleeId: 1 });

const User = mongoose.model("User", userSchema);

export default User;