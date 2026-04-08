import Message from "../models/Message.js";
import User from "../models/User.js";


// get all users except logged user
export const getUserForSidebar = async()=>{
     try{
    const userId = req.user._id;
    const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password")


    //count no. of unseen msgs
    const unseenMessages = {}
    const promises = filteredUsers.map(async(user)=>{
        const messages = await Message.find({senderId:user._id , receiverId:userId , seen:false})
        if(messages.length > 0){
            unseenMessages[user._id] = messages.length;
        }
    })
    await Promise.all(promises);  
    res.json({success:true})
     }
     catch(error){

     }
}