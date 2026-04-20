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


// req response
export const respondToRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId, action } = req.body; // action = "accept" or "reject"

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // ❌ Only receiver can respond
    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ❌ Already handled
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already handled",
      });
    }

    // ✅ ACCEPT
    if (action === "accept") {
      request.status = "accepted";

      await User.findByIdAndUpdate(request.sender, {
        $addToSet: { friends: request.receiver },
      });

      await User.findByIdAndUpdate(request.receiver, {
        $addToSet: { friends: request.sender },
      });
    }

    // ❌ REJECT
    else if (action === "reject") {
      request.status = "rejected";
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    await request.save();

    res.json({
      success: true,
      message: `Request ${action}ed`,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};