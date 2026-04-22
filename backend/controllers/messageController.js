import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { io , userSocketMap } from "../server.js";


// get all users except logged user
export const getUserForSidebar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "fullName username bio profilePic zingleeId status");

    res.json({
      success: true,
      users: user.friends,
      unseenMessages: {}
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
        })

        await Message.updateMany({senderId:selectedUserId , receiverId:myId},{seen:true});

        res.json({success:true , messages})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false , message:error.message})
    }
}

// apu to mark msg as seen using msg id
export const  markMessageAsSeen = async(req, res)=>{
    try{
        const  {id} = req.params;
        await Message.findByIdAndUpdate(id , {seen:true})
        res.json({success:true})
    }
    catch(error){
          console.log(error.message)
        res.json({success:false , message:error.message})
    }
}

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
      audio: audioUrl
    });

    // ⚡ emit real-time message
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

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