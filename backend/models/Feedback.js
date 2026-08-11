import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    // The actual feedback submitted by the user
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5000,
    },

    // Email used only for confirmation
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Whether the user wants the feedback to be anonymous
    anonymous: {
      type: Boolean,
      default: false,
    },

    // If the user is logged into Zingleee,
    // we can associate the feedback with their account.
    // Anonymous visitors will have this as null.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Internal feedback status
    status: {
      type: String,
      enum: ["received", "reviewed", "resolved"],
      default: "received",
    },

    // Status of confirmation email sent to the user
    confirmationEmailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    // Resend email ID for the user's confirmation
    confirmationEmailId: {
      type: String,
      default: null,
    },

    // Status of notification email sent to Zingleee
    adminEmailStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    // Resend email ID for the admin notification
    adminEmailId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;