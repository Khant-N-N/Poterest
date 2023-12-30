import { RequestHandler } from "express";
import ChatModel from "../models/chat.model";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { io } from "../app";

interface Message {
  sender: string;
  message: string;
  sendAt?: Date;
}
interface ChatBox {
  user1: string;
  user2: string;
  message: Message;
}

export const CreateChat: RequestHandler<unknown, unknown, ChatBox> = async (
  req,
  res,
  next
) => {
  const user1 = req.body.user1;
  const user2 = req.body.user2;
  const startMessage = { ...req.body.message, sendAt: new Date() };
  try {
    if (!user1 || !user2) throw createHttpError(400, "Select the valid users");
    if (!mongoose.isValidObjectId(user1) || !mongoose.isValidObjectId(user2))
      throw createHttpError(400, "Invalid user Id");
    if (startMessage.sender !== user1 && startMessage.sender !== user2)
      throw createHttpError(401, "Invalid Sender Id");

    const findChat = await ChatModel.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    }).exec();

    if (!findChat) {
      const chat = await ChatModel.create({
        user1,
        user2,
        messages: [startMessage],
      });

      io.of("/chat").emit("chatUpdate", chat);

      const chatBox = await ChatModel.findById(chat._id)
        .populate("user1 user2")
        .exec();
      return res.status(201).json(chatBox);
    }
    findChat.messages.push(startMessage);

    await findChat.save();
    io.of("/chat").emit("chatUpdate", findChat);
    return res.status(201).json(findChat);
  } catch (error) {
    next(error);
  }
};
