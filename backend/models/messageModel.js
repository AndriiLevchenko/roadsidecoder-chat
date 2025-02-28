import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "Userroad" },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Userroad" }],
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);
export default  Message;
