const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const chatSchema = new mongoose.Schema(
  {
    messages: [
      {
        content: String,
        user: { type: ObjectId, ref: "user" },
        createdDate: { type: Date, default: Date.now() },
      },
    ],
    to: {
      type: ObjectId,
      ref: "User",
    },
    from: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Chats", chatSchema);
