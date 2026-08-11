import Feedback from "../models/Feedback.js";
import {
  sendFeedbackConfirmation,
  sendFeedbackNotification,
} from "./emailService.js";

/**
 * Basic email validation.
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * Create and process new feedback.
 */
export const createFeedback = async ({
  message,
  email,
  anonymous = false,
  userId = null,
}) => {
  /*
   * ---------------------------------------------------------
   * 1. NORMALIZE INPUT
   * ---------------------------------------------------------
   */

  const cleanMessage =
    typeof message === "string"
      ? message.trim()
      : "";

  const cleanEmail =
    typeof email === "string"
      ? email.trim().toLowerCase()
      : "";


  /*
   * ---------------------------------------------------------
   * 2. VALIDATE MESSAGE
   * ---------------------------------------------------------
   */

  if (!cleanMessage) {
    throw new Error("Feedback message is required.");
  }

  if (cleanMessage.length < 5) {
    throw new Error(
      "Feedback message must be at least 5 characters long."
    );
  }

  if (cleanMessage.length > 5000) {
    throw new Error(
      "Feedback message cannot exceed 5000 characters."
    );
  }


  /*
   * ---------------------------------------------------------
   * 3. VALIDATE EMAIL
   * ---------------------------------------------------------
   */

  if (!cleanEmail) {
    throw new Error("Email address is required.");
  }

  if (!isValidEmail(cleanEmail)) {
    throw new Error("Please provide a valid email address.");
  }


  /*
   * ---------------------------------------------------------
   * 4. CREATE FEEDBACK IN DATABASE
   * ---------------------------------------------------------
   */

  const feedback = await Feedback.create({
    message: cleanMessage,
    email: cleanEmail,
    anonymous: Boolean(anonymous),
    userId: userId || null,

    status: "received",

    confirmationEmailStatus: "pending",
    confirmationEmailId: null,

    adminEmailStatus: "pending",
    adminEmailId: null,
  });


  /*
   * ---------------------------------------------------------
   * 5. SEND CONFIRMATION EMAIL TO USER
   * ---------------------------------------------------------
   */

  try {
    const confirmationEmail =
      await sendFeedbackConfirmation({
        email: cleanEmail,
        feedbackId: feedback._id.toString(),
      });

    feedback.confirmationEmailStatus = "sent";

    feedback.confirmationEmailId =
      confirmationEmail?.id || null;

  } catch (error) {
    console.error(
      "Feedback confirmation email failed:",
      error
    );

    feedback.confirmationEmailStatus = "failed";
  }


  /*
   * ---------------------------------------------------------
   * 6. SEND NOTIFICATION EMAIL TO ZINGLEEE
   * ---------------------------------------------------------
   */

  try {
    const adminEmail =
      await sendFeedbackNotification({
        feedbackId: feedback._id.toString(),
        message: cleanMessage,
        email: cleanEmail,
        anonymous: Boolean(anonymous),
        createdAt: feedback.createdAt,
      });

    feedback.adminEmailStatus = "sent";

    feedback.adminEmailId =
      adminEmail?.id || null;

  } catch (error) {
    console.error(
      "Feedback admin notification email failed:",
      error
    );

    feedback.adminEmailStatus = "failed";
  }


  /*
   * ---------------------------------------------------------
   * 7. SAVE EMAIL STATUSES
   * ---------------------------------------------------------
   */

  await feedback.save();


  /*
   * ---------------------------------------------------------
   * 8. RETURN SAFE RESPONSE DATA
   * ---------------------------------------------------------
   */

  return {
    id: feedback._id,
    status: feedback.status,
    confirmationEmailStatus:
      feedback.confirmationEmailStatus,
    adminEmailStatus:
      feedback.adminEmailStatus,
    createdAt: feedback.createdAt,
  };
};