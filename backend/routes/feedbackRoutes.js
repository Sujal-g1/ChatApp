import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

/**
 * Submit feedback
 *
 * POST /api/feedback
 */
router.post("/", submitFeedback);

export default router;