
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({

    senderId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
 receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
},
text:{
    type:String
},
cipherText:{
    type:String
},
nonce:{
    type:String
},
senderPublicKey:{
  type:String
},
messageType:{
  type:String,
  enum:["text","image","audio"],
  default:"text"
},
image:{
    type:String
},
seen:{
    type:Boolean,
    default:false
},
audio: {
  type: String
},
expiresAt:{
    type:Date,
    default: () =>
        new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
}, {timestamps:true})

messageSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
  );

const Message = mongoose.model("Message" , messageSchema);

export default Message;