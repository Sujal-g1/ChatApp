import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  joinCode: {
    type: String,
    unique: true,
  }

}, { timestamps: true });

const Community = mongoose.model("Community", communitySchema);

export default Community;