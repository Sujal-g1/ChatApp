import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

import { emitToUser } from "../server.js";


// Get all friends for sidebar
export const getUserForSidebar = async (req, res) => {
  try {
    const myId = req.user._id;

    const user = await User.findById(myId).populate(
      "friends",
      "fullName username bio profilePic zingleeId status"
    );

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Unseen message counts
    const unseenMessages = {};

    const unseen = await Message.aggregate([
      {
        $match: {
          receiverId: myId,
          seen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    unseen.forEach((item) => {
      unseenMessages[item._id.toString()] = item.count;
    });

    // Attach last message metadata
    const usersWithMeta = await Promise.all(
      user.friends.map(async (friend) => {
        const lastMessage = await Message.findOne({
          $or: [
            {
              senderId: myId,
              receiverId: friend._id,
            },
            {
              senderId: friend._id,
              receiverId: myId,
            },
          ],
        }).sort({
          createdAt: -1,
        });

        return {
          ...friend.toObject(),

          lastMessageAt: lastMessage?.createdAt || null,

          lastMessagePreview:
            lastMessage?.text ||
            (lastMessage?.image
              ? "📷 Image"
              : lastMessage?.audio
              ? "🎤 Audio"
              : ""),
        };
      })
    );

    return res.json({
      success: true,
      users: usersWithMeta,
      unseenMessages,
    });
  } catch (error) {
    console.log(error.message);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
  $or: [
    {
      senderId: myId,
      receiverId: selectedUserId,
    },
    {
      senderId: selectedUserId,
      receiverId: myId,
    },
  ],
})
.sort({ createdAt: 1 })   // oldest → newest
.populate("senderId", "publicKey")
.populate("receiverId", "publicKey");

    // Get unseen messages
    const unseenMessages = await Message.find({
      senderId: selectedUserId,
      receiverId: myId,
      seen: false,
    });

    // Mark messages as seen
    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
        seen: false,
      },
      {
        seen: true,
      }
    );

    console.log(
      "EMITTING MESSAGE SEEN",
      selectedUserId,
      unseenMessages.length
    );

    // Notify sender that messages have been seen
    unseenMessages.forEach((msg) => {
      console.log("SEEN EVENT", msg._id.toString());

      emitToUser(selectedUserId, "messageSeen", {
        messageId: msg._id,
      });
    });

    return res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error.message);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to mark a message as seen using message ID
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, {
      seen: true,
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error.message);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { text, image, audio, cipherText, nonce, encryptionVersion, } = req.body;

    const receiverId = req.params.id;
    const senderId = req.user._id;

    // Self-destruct settings ---------------
    const expiryMap = {
      "10s": 1000 * 10,
      "1m": 1000 * 60,
      "1h": 1000 * 60 * 60,
      "24h": 1000 * 60 * 60 * 24,
      "7d": 1000 * 60 * 60 * 24 * 7,
    };

    const deleteMode = "24h";

    const expiresAt = new Date(
      Date.now() + expiryMap[deleteMode]
    );

    // Only friends can message
    const sender = await User.findById(senderId);

    const isFriend = sender.friends.some(
      (id) => id.toString() === receiverId
    );

    if (!isFriend) {
      return res.status(403).json({
        success: false,
        message: "You can only message friends",
      });
    }

    // Receiver
    const receiver = await User.findById(receiverId);

    // Check if receiver blocked sender
    if (receiver.blockedUsers.includes(senderId)) {
      return res.status(403).json({
        success: false,
        message: "You are blocked by this user",
      });
    }

    // Check if sender blocked receiver
    if (sender.blockedUsers.includes(receiverId)) {
      return res.status(403).json({
        success: false,
        message: "You blocked this user",
      });
    }

    // Upload image
    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);

      imageUrl = uploadResponse.secure_url;
    }

    // Upload audio
    let audioUrl;

    if (audio) {
      const uploadResponse = await cloudinary.uploader.upload(audio, {
        resource_type: "video",
      });

      audioUrl = uploadResponse.secure_url;
    }

    // Prevent empty messages
    if (!text && !cipherText && !imageUrl && !audioUrl) {
      return res.status(400).json({
        success: false,
        message: "Empty message",
      });
    }

    // Validate encrypted text payload
    if (cipherText && !nonce) {
  return res.status(400).json({
    success: false,
    message: "Invalid encrypted message",
  });
  }

    // Create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: cipherText ? null : text,
      cipherText,
      nonce,
      encryptionVersion: encryptionVersion || 1,
      image: imageUrl,
      audio: audioUrl,
      deleteMode,
      expiresAt,
    });

    // Populate sender public key
    const populatedMessage = await Message.findById(
      newMessage._id
    ).populate("senderId", "publicKey").populate("receiverId", "publicKey");

    // Emit real-time message
    emitToUser(
      receiverId,
      "newMessage",
      populatedMessage
    );
return res.status(200).json({
    success: true,
    newMessage: populatedMessage
});
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};