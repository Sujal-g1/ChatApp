import { createFeedback } from "../services/feedbackService.js";

/**
 * Create new feedback
 */
export const submitFeedback = async (req, res) => {
  try {
    const {
      message,
      email,
      anonymous = false,
    } = req.body;

    /*
     * If your authentication middleware attaches
     * the logged-in user to req.user, we can use it.
     *
     * For visitors, this will simply be null.
     */
    const userId = req.user?.id || null;

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