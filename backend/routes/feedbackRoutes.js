import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";
import {protectRoute} from "../middleware/auth.js";
import feedbackRateLimiter from "../middleware/feedbackRateLimiter.js";

const router = express.Router();

router.post(
  "/",
  feedbackRateLimiter,
  protectRoute,
  submitFeedback
);

export default router;