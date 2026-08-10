import express from "express";

import { protectRoute } from "../../middleware/auth.js";

import {
  sendCommunityMessage,
  getCommunityMessages,
  getCommunityMessage,
  deleteCommunityMessage,
} from "../controllers/communityMessageController.js";

const router = express.Router();

/**
 * Send Community Message
 */
router.post(
  "/:id/messages",
  protectRoute,
  sendCommunityMessage
);

/**
 * Get Community Messages
 */
router.get(
  "/:id/messages",
  protectRoute,
  getCommunityMessages
);

/**
 * Get One Community Message
 */
router.get(
  "/:id/messages/:messageId",
  protectRoute,
  getCommunityMessage
);

/**
 * Delete Community Message
 */
router.delete(
  "/:id/messages/:messageId",
  protectRoute,
  deleteCommunityMessage
);

export default router;