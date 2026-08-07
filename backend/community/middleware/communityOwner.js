
import Community from "../models/Community.js";

export const communityOwner = async ( req, res, next ) => {

  try {

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    if (
      community.ownerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not the community owner.",
      });
    }

    // Save community for next middleware/controller
    req.community = community;

    next();

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};