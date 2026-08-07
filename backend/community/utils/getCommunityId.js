import CommunityJoinRequest from "../models/CommunityJoinRequest.js";
import CommunityMember from "../models/CommunityMember.js";

export const getCommunityId = async (req) => {

  // Community routes
  if (req.params.id) {
    return req.params.id;
  }

  // Join Request routes
  if (req.params.requestId) {

    const request = await CommunityJoinRequest.findById(
      req.params.requestId
    );

    if (!request) {
      return null;
    }

    return request.communityId;
  }

  // Member routes
  if (req.params.memberId) {

    const member = await CommunityMember.findById(
      req.params.memberId
    );

    if (!member) {
      return null;
    }

    return member.communityId;
  }

  return null;
};