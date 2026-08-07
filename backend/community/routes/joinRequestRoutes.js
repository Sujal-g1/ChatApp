import express from "express";
import { protectRoute } from "../../middleware/auth.js";

import {
  requestToJoin,
  cancelJoinRequest,
  getMyJoinRequest,
} from "../controllers/joinRequestController.js";

const joinRequestRouter = express.Router();

/**
 * Request to Join Community
 */
joinRequestRouter.post(
  "/:id/request",
  protectRoute,
  requestToJoin
);

/**
 * Cancel Join Request
 */
joinRequestRouter.delete(
  "/:id/request",
  protectRoute,
  cancelJoinRequest
);

/**
 * Get My Join Request
 */
joinRequestRouter.get(
  "/:id/request",
  protectRoute,
  getMyJoinRequest
);

export default joinRequestRouter;