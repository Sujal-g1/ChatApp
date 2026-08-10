import * as communityMessageService from "../services/communityMessageService.js";
import { io } from "../../server.js";

/**
 * Send Community Message
 *
 * POST /api/community/:id/messages
 */
export const sendCommunityMessage = async (req, res) => {
  try {
    const {
      content,
      messageType,
      mediaUrl,
      replyTo,
    } = req.body;

    const message =
      await communityMessageService.sendCommunityMessage({
        communityId: req.params.id,
        userId: req.user._id,
        content,
        messageType,
        mediaUrl,
        replyTo,
      });

     // Send message to all connected  members of this community  

    io.to( `community:${req.params.id}` ).emit(
    "community:newMessage", message );  

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Community Messages
 *
 * GET /api/community/:id/messages
 */
export const getCommunityMessages = async (req, res) => {
  try {
    const {
      limit = 30,
    } = req.query;

    const messages =
      await communityMessageService.getCommunityMessages({
        communityId: req.params.id,
        userId: req.user._id,
        limit,
      });

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get One Community Message
 *
 * GET /api/community/:id/messages/:messageId
 */
export const getCommunityMessage = async (req, res) => {
  try {
    const message =
      await communityMessageService.getCommunityMessage({
        communityId: req.params.id,
        userId: req.user._id,
        messageId: req.params.messageId,
      });

    return res.json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Community Message
 *
 * DELETE /api/community/:id/messages/:messageId
 */
export const deleteCommunityMessage = async (req, res) => {
  try {
    const message =
      await communityMessageService.deleteCommunityMessage({
        communityId: req.params.id,
        userId: req.user._id,
        messageId: req.params.messageId,
      });

    return res.json({
      success: true,
      message: "Community message deleted successfully.",
      deletedMessage: message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};