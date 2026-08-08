import express from "express";
import { protectRoute } from "../../middleware/auth.js";
import { getCommunityMembers, } from "../controllers/communityMemberController.js";
import { communityPermission, } from "../middleware/communityPermission.js";
import { leaveCommunity, } from "../controllers/communityMemberController.js";
import { removeMember, } from "../controllers/communityMemberController.js";
import { transferOwnership, } from "../controllers/communityMemberController.js";
import { updateMemberRole, } from "../controllers/communityMemberController.js";
import { searchCommunityMembers, } from "../controllers/communityMemberController.js";

const router = express.Router();

router.delete(
  "/:id/leave",
  protectRoute,
  leaveCommunity
);


router.get(
  "/:id/members",
  protectRoute,
  communityPermission([
    "member:kick",
  ]),
  getCommunityMembers
);

router.patch(
"/member/:memberId/role",
protectRoute,
communityPermission([
"member:promoteModerator"
]),
updateMemberRole
);


router.delete(

  "/member/:memberId",

  protectRoute,

  communityPermission([
    "member:kick",
  ]),

  removeMember

);


router.patch(

  "/:id/transfer-owner",

  protectRoute,

  communityPermission([
    "community:transferOwnership",
  ]),

  transferOwnership

);

router.get(
  "/:id/members/search",
  protectRoute,
  communityPermission([
    "member:kick",
  ]),
  searchCommunityMembers
);




export default router;