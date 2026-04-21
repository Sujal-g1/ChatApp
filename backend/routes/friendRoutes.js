import express from "express";
import { sendFriendRequest , respondToRequest , blockUser ,removeFriend, cancelRequest, getPendingRequests  } from "../controllers/friendController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/request", protectRoute, sendFriendRequest);
router.post("/respond", protectRoute, respondToRequest);
router.post("/block", protectRoute, blockUser);
router.post("/remove", protectRoute, removeFriend);
router.post("/cancel", protectRoute, cancelRequest);
router.get("/pending", protectRoute, getPendingRequests);

export default router;