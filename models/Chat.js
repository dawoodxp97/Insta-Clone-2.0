const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const chatSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    to: {
      type: ObjectId,
      ref: "User",
    },
    from: { type: ObjectId, ref: "User" },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chats", chatSchema);
