import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { emitToUser } from "../server.js";


// get all users except logged user
export const getUserForSidebar = async (req, res) => { 
  try {
    const myId = req.user._id;
    const user = await User.findById(myId)
      .populate("friends", "fullName username bio profilePic zingleeId status");

    const unseenCounts = await Message.aggregate([
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

    const unseenMessages = unseenCounts.reduce((counts, item) => {
      counts[item._id.toString()] = item.count;
      return counts;
    }, {});

    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: myId },
            { receiverId: myId },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          chatUserId: {
            $cond: [
              { $eq: ["$senderId", myId] },
              "$receiverId",
              "$senderId",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$chatUserId",
          lastMessageAt: { $first: "$createdAt" },
          lastText: { $first: "$text" },
          lastImage: { $first: "$image" },
          lastAudio: { $first: "$audio" },
        },
      },
    ]);

    const lastMessageMap = lastMessages.reduce((messages, item) => {
      messages[item._id.toString()] = {
        lastMessageAt: item.lastMessageAt,
        lastText: item.lastText,
        lastImage: item.lastImage,
        lastAudio: item.lastAudio,
      };
    
      return messages;
    }, {});

    const usersWithChatActivity = user.friends.map((friend) => {
      const friendObject = friend.toObject();
    
      const chatData =
        lastMessageMap[friend._id.toString()] || {};
    
      friendObject.lastMessageAt = chatData.lastMessageAt || null;
    
      if (chatData.lastAudio) {
        friendObject.lastMessagePreview = "🎤 Voice Message";
      } else if (chatData.lastImage) {
        friendObject.lastMessagePreview = "📷 Photo";
      } else {
        friendObject.lastMessagePreview =
          chatData.lastText || "";
      }
    
      return friendObject;
    });

    usersWithChatActivity.sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
    
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });

    res.json({
      success: true,
      users: usersWithChatActivity,
      unseenMessages
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



// get all messages for selected users
export const getMessages = async(req, res)=>{
    try{
        const  {id:selectedUserId} = req.params;
        const myId = req.user._id;


        const messages = await Message.find({
            $or:[
                 {senderId :myId , receiverId:selectedUserId},
                 {senderId:selectedUserId,receiverId:myId}
            ]
        }).sort({ createdAt: 1 })

        // await Message.updateMany({senderId:selectedUserId , receiverId:myId},{seen:true});

        const unseenMessages = await Message.find({
          senderId: selectedUserId,
          receiverId: myId,
          seen: false
        });
        
        const messageIds = unseenMessages.map(msg => msg._id);
        
        await Message.updateMany(
          {
            senderId: selectedUserId,
            receiverId: myId,
            seen: false
          },
          {
            seen: true
          }
        );
        
        emitToUser(
          selectedUserId,
          "messagesSeen",
          {
            messageIds
          }
        );

        res.json({success:true , messages})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false , message:error.message})
    }
}

// api to mark msg as seen using msg id


export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!message) {
      return res.json({
        success: false,
        message: "Message not found"
      });
    }

    emitToUser(
      message.senderId.toString(),
      "messageSeen",
      {
        messageId: message._id
      }
    );

    res.json({ success: true });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// send msg to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image, audio } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    //  CHECK: Only friends can message
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

    const receiver = await User.findById(receiverId);

if (receiver.blockedUsers.includes(senderId)) {
  return res.status(403).json({
    success: false,
    message: "You are blocked by this user"
  });
}

if (sender.blockedUsers.includes(receiverId)) {
  return res.status(403).json({
    success: false,
    message: "You blocked this user"
  });
}


    // 📷 handle image upload
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // audio upload
    let audioUrl;
    if (audio) {
   const uploadResponse = await cloudinary.uploader.upload(audio, {
    resource_type: "video" 
    });
    
  audioUrl = uploadResponse.secure_url;
}

if (!text && !imageUrl && !audioUrl) {
  return res.status(400).json({
    success: false,
    message: "Empty message"
  });
}

    // 💬 create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      audio: audioUrl,
    });

    // emit real-time message to receiver
    emitToUser(receiverId, "newMessage", newMessage.toObject());

    res.json({
      success: true,
      newMessage,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
