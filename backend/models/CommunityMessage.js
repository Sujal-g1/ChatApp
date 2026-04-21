import mongoose from "mongoose";

const communityMessageSchema = new mongoose.Schema({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  text: String,

  image: String

}, { timestamps: true });

const CommunityMessage = mongoose.model("CommunityMessage", communityMessageSchema);

export default CommunityMessage;