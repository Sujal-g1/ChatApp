import express from "express";
import { protectRoute } from "../../middleware/auth.js";
import { getPendingRequests } from "../controllers/joinRequestController.js";
import { approveJoinRequest } from "../controllers/joinRequestController.js";
import { rejectJoinRequest, } from "../controllers/joinRequestController.js";
import { requestToJoin, cancelJoinRequest, getMyJoinRequest, } from "../controllers/joinRequestController.js";
import { communityPermission, } from "../middleware/communityPermission.js";

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

// get all pending requests for a community, used by owner/admin to approve/reject requests
joinRequestRouter.get(
  "/:id/requests",
  protectRoute,
  communityPermission(["member:approve"]),
  getPendingRequests
);

joinRequestRouter.patch(
  "/request/:requestId/approve",
  protectRoute,
  communityPermission(["member:approve"]),
  approveJoinRequest
);

joinRequestRouter.patch(
  "/request/:requestId/reject",
  protectRoute,
  communityPermission([
    "member:reject",
  ]),
  rejectJoinRequest
);

export default joinRequestRouter;