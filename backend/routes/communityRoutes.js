import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  createCommunity,
  joinCommunity,
  getMyCommunities
} from "../controllers/communityController.js";

const router = express.Router();

router.post("/create", protectRoute, createCommunity);
router.post("/join", protectRoute, joinCommunity);
router.get("/my", protectRoute, getMyCommunities);

export default router;