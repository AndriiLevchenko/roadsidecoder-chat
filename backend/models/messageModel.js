import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "Userroad" },
        content: { type: String, trim: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Userroad" }],
        // pic:  { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
        pic:  { type: String },


    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);
export default  Message;
