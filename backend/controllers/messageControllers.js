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
      try {
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
      } catch (error) {
        console.error("Error updating chat latestMessage:", error);
      }
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId, chatId } = req.body;
  const userId = req.user._id; // Отримуємо ID користувача з middleware авторизації

  console.log("userId, messageId, chatId = ", userId, messageId, chatId);

  if (!messageId || !chatId) {
    return res.status(400).send({ message: "Please provide messageId and chatId" });
  }

  try {
    console.log("Attempting to find message with ID:", messageId);
    const messageToDelete = await Message.findById(messageId).populate("sender", "_id");
    console.log("Found message:", messageToDelete);
    if (!messageToDelete) {
      console.log("Error: Message not found");
      return res.status(404).send({ message: "Message not found" });
    }
    console.log("Sender of the message:", messageToDelete.sender._id.toString());
    console.log("Current user ID:", userId.toString());
    // Авторизація: перевіряємо, чи користувач є відправником повідомлення
    if (messageToDelete.sender._id.toString() !== userId.toString()) {
      console.log("Error: Not authorized to delete this message");
      return res.status(401).send({ message: "You are not authorized to delete this message" });
    }

    console.log("Attempting to delete message with ID:", messageId);
    const deletionResult = await Message.findByIdAndDelete(messageId);
    console.log("Deletion result:", deletionResult);

    // Оновлення latestMessage в чаті (потрібно оптимізувати для групових чатів)
    const chat = await Chat.findById(chatId);
    if (chat && chat.latestMessage && chat.latestMessage.toString() === messageId) {
      const latest = await Message.findOne({ chat: chatId }).sort({ createdAt: -1 });
      await Chat.findByIdAndUpdate(chatId, { latestMessage: latest ? latest._id : null });
    }

    // TODO: Реалізувати повідомлення в реальному часі про видалення повідомлення (через Socket.IO тощо)

    res.status(200).send({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).send({ message: "Failed to delete message", error: error.message });
  }
});
// export const deleteMessage = asyncHandler(async (req, res) => {  //ця функція не завершена
//   const { userId, messageId, chatId } = req.body;
//
//   console.log("userId, massageId, chatId = ", userId, messageId, chatId );
//

  // const removed = await Message.findByIdAndUpdate(
  // const removed = await Message.deleteOne(
  //     { _id: massageId}, function(err, res) {
  //       console.log("error = ", err);
  //     }
  // ).then(  console.log("await Message.deleteOne = "));
  //     // .populate("users", "-password")
  //     // .populate("groupAdmin", "-password");
  //
  // if (!removed) {
  //   res.status(404);
  //   throw new Error("Message was not deleted");
  // } else {
  //   res.send({status: "Ok", Data: "deleted"});
  // }
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
// });

