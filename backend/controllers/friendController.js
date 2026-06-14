import mongoose from "mongoose";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import { emitToUser } from "../server.js";

const populateRequest = (id) =>
  FriendRequest.findById(id).populate("sender", "username profilePic zingleeId fullName")
    .populate("receiver", "username profilePic zingleeId fullName");


// send req
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    //  cannot send to yourself
    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send request to yourself",
      });
    }

    //  check receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //  already friends
    const sender = await User.findById(senderId);
    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Already friends",
      });
    }

    //  existing request (same direction)
let existingRequest = await FriendRequest.findOne({
  sender: senderId,
  receiver: receiverId
});

if (existingRequest) {
  existingRequest.status = "pending";
  await existingRequest.save();

  const populated = await populateRequest(existingRequest._id);
  emitToUser(receiverId, "newFriendRequest", populated?.toObject());

  return res.json({
    success: true,
    request: existingRequest
  });
}

    //  reverse request exists (auto-handle later maybe)
  const reverseRequest = await FriendRequest.findOne({
  sender: receiverId,
  receiver: senderId,
  status: "pending"
});

    if (reverseRequest) {
      return res.status(400).json({
        success: false,
        message: "User already sent you a request",
      });
    }

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    const populated = await populateRequest(request._id);
    emitToUser(receiverId, "newFriendRequest", populated?.toObject());

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

      console.log("BLOCKING");
console.log({
  blocker: userId.toString(),
  target: targetUserId
});

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

    // remove pending requests also
await FriendRequest.deleteMany({
  $or: [
    { sender: userId, receiver: targetUserId },
    { sender: targetUserId, receiver: userId }
  ]
});

    emitToUser(
  targetUserId,
  "userBlocked",
  {
    userId: userId.toString()
  }
);

emitToUser(
  userId,
  "userBlocked",
  {
    userId: targetUserId.toString()
  }
);

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

export const getBlockedUsers = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    ).populate(
      "blockedUsers",
      "fullName username profilePic zingleeId"
    );

    res.json({
      success: true,
      users: user.blockedUsers
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// unblock user
export const unblockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    await User.findByIdAndUpdate(userId, {
      $pull: { blockedUsers: targetUserId }
    });

    emitToUser(
  userId,
  "userUnblocked",
  {
    userId: targetUserId
  }
);

    res.json({
      success: true,
      message: "User unblocked"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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

    emitToUser(
  targetUserId,
  "friendRemoved",
  {
    userId: userId.toString()
  }
);

emitToUser(
  userId,
  "friendRemoved",
  {
    userId: targetUserId.toString()
  }
);  
    // 🔥 ADD THIS (IMPORTANT)
    await FriendRequest.deleteMany({
      $or: [
        { sender: userId, receiver: targetUserId },
        { sender: targetUserId, receiver: userId }
      ]
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

    emitToUser(request.receiver, "friendRequestCancelled", { requestId: request._id });

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

    if (action === "accept") {

  const senderUser =
    await User.findById(
      request.sender
    ).select(
      "fullName username profilePic zingleeId"
    );

  const receiverUser =
    await User.findById(
      request.receiver
    ).select(
      "fullName username profilePic zingleeId"
    );

  emitToUser(
    request.sender,
    "friendRequestAccepted",
    {
      requestId: request._id,
      friend: receiverUser
    }
  );

  emitToUser(
    request.receiver,
    "friendAdded",
    {
      friend: senderUser
    }
  );
}
    else {
      emitToUser(request.sender, "friendRequestRejected", { requestId: request._id });
    }

    res.json({
      success: true,
      message: `Request ${action}ed`,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//who i send req
export const getSentRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      sender: userId,
      status: "pending"
    }).populate("receiver", "username profilePic zingleeId");

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