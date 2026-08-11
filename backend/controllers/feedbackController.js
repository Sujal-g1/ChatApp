import { createFeedback } from "../services/feedbackService.js";

/**
 * Create new feedback
 */
export const submitFeedback = async (req, res) => {
  try {
    /*
     * protectRoute has already verified the JWT
     * and attached the actual User document to req.user.
     *
     * We NEVER accept userId from req.body.
     */
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      message,
      email,
      anonymous = false,
    } = req.body;

    const feedback = await createFeedback({
      message,
      email,
      anonymous,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Your feedback has been received.",
      feedback,
    });

  } catch (error) {
    console.error(
      "Submit feedback error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to submit feedback.",
    });
  }
};