import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import Userroad from "../models/userModel.js";
import Chat from "../models/chatModel.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, pic } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    pic: pic
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await Userroad.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
export const deleteMessage = asyncHandler(async (req, res) => {  //ця функція не завершена
  // const { massageId } = req.body;
  const { massageId } = req;
  console.log("message id, massageId = ", massageId );


  // const removed = await Message.findByIdAndUpdate(
  const removed = await Message.deleteOne(
      { _id: massageId}, function(err, res) {
        console.log("error = ", err);
      }
  ).then(  console.log("await Message.deleteOne = "));
      // .populate("users", "-password")
      // .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Message was not deleted");
  } else {
    res.send({status: "Ok", Data: "deleted"});
  }
  // try {
  //   var message = await Message.create(newMessage);
  //
  //   message = await message.populate("sender", "name pic");
  //   message = await message.populate("chat");
  //   message = await Userroad.populate(message, {
  //     path: "chat.users",
  //     select: "name pic email",
  //   });
  //   await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  //
  //   res.json(message);
  // } catch (error) {
  //   res.status(400);
  //   throw new Error(error.message);
  // }
});

