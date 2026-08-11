import rateLimit from "express-rate-limit";

const feedbackRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "You have submitted too many feedback requests. Please try again later.",
  },
});

export default feedbackRateLimiter;