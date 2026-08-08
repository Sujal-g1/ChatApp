import * as joinRequestService from "../services/joinRequestService.js";
import CommunityJoinRequest from "../models/communityJoinRequest.js";

/**
 * Request to Join Community
 */
export const requestToJoin = async (req, res) => {

  try {

    const request =
      await joinRequestService.requestToJoin({

        communityId: req.params.id,

        userId: req.user._id,

        message: req.body.message,

      });

    return res.status(201).json({

      success: true,

      message: "Join request sent successfully.",

      request,

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};

/**
 * Cancel Join Request
 */
export const cancelJoinRequest = async (req, res) => {

  try {

    await joinRequestService.cancelJoinRequest(

      req.params.id,

      req.user._id

    );

    return res.json({

      success: true,

      message: "Join request cancelled.",

    });

  } catch (error) {

    return res.status(400).json({

      success: false,

      message: error.message,

    });

  }

};

/**
 * Get My Join Request
 */
export const getMyJoinRequest = async (req, res) => {

  try {

    const request =
      await joinRequestService.getMyRequest(

        req.params.id,

        req.user._id

      );

    return res.json({

      success: true,

      request,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// get pending requests for a community
export const getPendingRequests = async (
  req,
  res
) => {

  try {

    const requests =
      await joinRequestService.getPendingRequests(
        req.params.id
      );

    return res.json({
      success: true,
      requests,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const approveJoinRequest = async (req, res) => {

  try {

    const request =
      await joinRequestService.approveJoinRequest(
        req.params.requestId
      );

    return res.json({
      success: true,
      message: "User approved successfully.",
      request,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};

export const rejectJoinRequest = async (req, res) => {

  try {

    const request =
      await joinRequestService.rejectJoinRequest(
        req.params.requestId
      );

    return res.json({
      success: true,
      message: "Join request rejected successfully.",
      request,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }

};