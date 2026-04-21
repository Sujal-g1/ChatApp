import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";


// send req
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    // ❌ cannot send to yourself
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send request to yourself",
      });
    }

    // ✅ check receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ❌ already friends
    const sender = await User.findById(senderId);
    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Already friends",
      });
    }

    // ❌ existing request (same direction)
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already sent",
      });
    }

    // ❌ reverse request exists (auto-handle later maybe)
    const reverseRequest = await FriendRequest.findOne({
      sender: receiverId,
      receiver: senderId,
    });

    if (reverseRequest) {
      return res.status(400).json({
        success: false,
        message: "User already sent you a request",
      });
    }

    // ✅ create request
    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({
      success: true,
      request,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// block user
export const blockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    if (userId.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself",
      });
    }

    // remove from friends (both sides)
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { friends: userId }
    });

    // add to blocked list
    await User.findByIdAndUpdate(userId, {
      $addToSet: { blockedUsers: targetUserId }
    });

    res.json({
      success: true,
      message: "User blocked successfully",
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// remove friend
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    if (userId.toString() === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    // remove from both users
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { friends: userId }
    });

    res.json({
      success: true,
      message: "Friend removed successfully",
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//cancel request
export const cancelRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.body;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // only sender can cancel
    if (request.sender.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already handled",
      });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Request cancelled",
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// cancel pending request
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending"
    }).populate("sender", "username profilePic zingleeId");

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// req response
export const respondToRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId, action } = req.body;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request already handled" });
    }

    if (action === "accept") {
      request.status = "accepted";

      const senderId = new mongoose.Types.ObjectId(request.sender);
      const receiverId = new mongoose.Types.ObjectId(request.receiver);

      await User.findByIdAndUpdate(senderId, {
        $addToSet: { friends: receiverId },
      });

      await User.findByIdAndUpdate(receiverId, {
        $addToSet: { friends: senderId },
      });
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    await request.save();

    res.json({
      success: true,
      message: `Request ${action}ed`,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};