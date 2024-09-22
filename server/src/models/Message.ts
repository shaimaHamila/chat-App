import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imagesUrl: {
      type: [String],
      default: [],
    },
    videosUrl: { type: [String], default: [] },
    seen: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", MessageSchema);
