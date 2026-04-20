import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  zingleeId: {
    type: String,
    unique: true
  },

  fullName:{
    type:String,
    required:true,
    trim:true
  },

  password:{
    type:String,
    minlength:6
  },

  profilePic:{
    type:String,
    default:""
  },

  bio:{
    type:String,
    maxlength:150
  },

  googleId: {
    type: String 
  },

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  lastSeen: { 
    type: Date 
  },

  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline"
  },

  allowFriendRequests: {
    type: Boolean,
    default: true
  },
  friends: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

}, {timestamps:true})

// Indexes (IMPORTANT)
userSchema.index({ username: 1 })
userSchema.index({ zingleeId: 1 })

const User = mongoose.model("User" , userSchema)

export default User