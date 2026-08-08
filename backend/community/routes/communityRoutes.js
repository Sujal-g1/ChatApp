import express from "express";

import { protectRoute } from "../../middleware/auth.js";
import { communityPermission } from "../middleware/communityPermission.js";
import { validateCommunity } from "../validators/communityValidator.js";
import { getCommunityStats, } from "../controllers/communityController.js";
import {
  createCommunity,
  getCommunities,
  discoverCommunities,
  getCommunity,
  updateCommunity,
  deleteCommunity,
} from "../controllers/communityController.js";

const communityRouter = express.Router();

// validate community before creating
communityRouter.post(
"/",
protectRoute,
validateCommunity,
createCommunity
);


/**
 * Get All Communities
 */
communityRouter.get(
  "/",
  protectRoute,
  getCommunities
);

// discover communities
communityRouter.get(
    "/discover",
    protectRoute,
    discoverCommunities
);

/**
 * Get Single Community
 */
communityRouter.get(
  "/:slug",
  protectRoute,
  getCommunity
);

/**
 * Update Community
 */
communityRouter.patch(
  "/:id",
  protectRoute,
  communityPermission(["community:update"]),
  updateCommunity
);

/**
 * Delete Community
 */
communityRouter.delete(
  "/:id",
  protectRoute,
  communityPermission(["community:delete"]),
  deleteCommunity
);

communityRouter.get(
  "/:id/stats",
  protectRoute,
  communityPermission([
    "member:kick",
  ]),
  getCommunityStats
);

export default communityRouter;