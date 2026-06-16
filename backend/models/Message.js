
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({

    senderId:{ type:mongoose.Schema.Types.ObjectId,
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

image:{
    type:String
},

seen:{
    type:Boolean,
    default:false
},

expiresAt: {
  type: Date,
  required: true,
},

deleteMode: {
  type: String,
  enum: [
    "10s",
    "1m",
    "1h",
    "24h",
    "7d"
  ],
  default: "24h"
},

    cipherText: {
      type: String,
      default: null,
    },

    nonce: {
      type: String,
      default: null,
    },

audio: {
  type: String
},

}, {timestamps:true});

messageSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

messageSchema.index({
  senderId: 1,
  receiverId: 1,
  createdAt: -1
});


const Message = mongoose.model("Message" , messageSchema);

export default Message;