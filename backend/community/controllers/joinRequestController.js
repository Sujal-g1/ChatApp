import * as joinRequestService from "../services/joinRequestService.js";

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