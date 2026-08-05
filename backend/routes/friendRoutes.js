import express from "express";

import {
  sendFriendRequest,
  respondToRequest,
  blockUser,
  unblockUser,
  removeFriend,
  cancelRequest,
  getPendingRequests,
  getSentRequests,
  getBlockedUsers,
} from "../controllers/friendController.js";

import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

// Friend Requests
router.post("/request", protectRoute, sendFriendRequest);
router.get("/pending", protectRoute, getPendingRequests);
router.get("/sent-req", protectRoute, getSentRequests);
router.post("/respond", protectRoute, respondToRequest);
router.post("/cancel", protectRoute, cancelRequest);

// Friend Management
router.post("/remove", protectRoute, removeFriend);

// Block Management
router.post("/block", protectRoute, blockUser);
router.post("/unblock", protectRoute, unblockUser);
router.get("/blocked", protectRoute, getBlockedUsers);

export default router;