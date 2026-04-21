import Community from "../models/Community.js";

// generate random join code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

// CREATE COMMUNITY
export const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const community = await Community.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
      joinCode: generateCode(),
    });

    res.json({
      success: true,
      community
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// JOIN COMMUNITY
export const joinCommunity = async (req, res) => {
  try {
    const { code } = req.body;

    const community = await Community.findOne({ joinCode: code });

    if (!community) {
      return res.json({
        success: false,
        message: "Invalid code"
      });
    }

    await Community.findByIdAndUpdate(community._id, {
      $addToSet: { members: req.user._id }
    });

    res.json({
      success: true,
      message: "Joined community"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET USER COMMUNITIES
export const getMyCommunities = async (req, res) => {
  try {
    const communities = await Community.find({
      members: req.user._id
    });

    res.json({
      success: true,
      communities
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};