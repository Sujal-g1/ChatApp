import express from "express";
import { sendFriendRequest , respondToRequest } from "../controllers/friendController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/request", protectRoute, sendFriendRequest);
router.post("/respond", protectRoute, respondToRequest);

export default router;