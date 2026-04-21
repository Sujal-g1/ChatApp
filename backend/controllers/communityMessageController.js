import CommunityMessage from "../models/CommunityMessage.js";
import Community from "../models/Community.js";
import { io } from "../server.js";

// GET MESSAGES
export const getCommunityMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const messages = await CommunityMessage.find({
      communityId: id
    }).populate("sender", "fullName profilePic");

    res.json({ success: true, messages });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// SEND MESSAGE
export const sendCommunityMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: communityId } = req.params;

    // check if user is member
    const community = await Community.findById(communityId);

    if (!community.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not a member"
      });
    }

    const newMessage = await CommunityMessage.create({
      communityId,
      sender: req.user._id,
      text
    });

    const populatedMessage = await newMessage.populate(
      "sender",
      "fullName profilePic"
    );

    // 🔥 emit to community room
    io.to(communityId).emit("newCommunityMessage", populatedMessage);

    res.json({ success: true, newMessage: populatedMessage });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};