import CommunityMember from "../models/CommunityMember.js";
import { getCommunityId } from "../utils/getCommunityId.js";
import { COMMUNITY_PERMISSIONS } from "../config/permissions.js";

export const communityPermission =(requiredPermissions = []) => {

    return async (req, res, next) => {

      try {

        const communityId = await getCommunityId(req);

        if (!communityId) {
        return res.status(404).json({
            success: false,
            message: "Community not found.",
        });
        }

        const member =
          await CommunityMember.findOne({

            communityId,

            userId: req.user._id,

          });

        if (!member) {

          return res.status(403).json({

            success: false,

            message:
              "You are not a member of this community.",

          });

        }

        const rolePermissions =
          COMMUNITY_PERMISSIONS[
            member.role
          ] || [];

        const allowed =
          requiredPermissions.every(permission =>
            rolePermissions.includes(permission)
          );

        if (!allowed) {

          return res.status(403).json({

            success: false,

            message:
              "Insufficient permissions.",

          });

        }

        req.communityMember = member;

        next();

      } catch (error) {

        return res.status(500).json({

          success: false,

          message: error.message,

        });

      }

    };

};