import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getCommunityMessages,
  sendCommunityMessage
} from "../controllers/communityMessageController.js";

const router = express.Router();

router.get("/:id", protectRoute, getCommunityMessages);
router.post("/send/:id", protectRoute, sendCommunityMessage);

export default router;