import { RequestHandler } from "express";
import ChatModel from "../models/chat.model";
import createHttpError from "http-errors";
import mongoose from "mongoose";

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

    const chat = await ChatModel.create({
      user1,
      user2,
      messages: [startMessage],
    });

    const chatBox = await ChatModel.findById(chat._id)
      .populate("user1 user2")
      .exec();
    res.status(201).json(chatBox);
  } catch (error) {
    next(error);
  }
};
