import { RequestHandler } from "express";
import createHttpError from "http-errors";
import PostModel from "../models/post.model";

interface PostType {
  imgUrl?: string;
  caption?: string;
  description?: string;
  topic?: Array<string>;
  uploaderId?: string;
  allowComment?: boolean;
  comments?: Array<object>;
  reacts?: Array<{ reactorId: string; react: string }>;
}
export const CreatePost: RequestHandler<unknown, unknown, PostType> = async (
  req,
  res,
  next
) => {
  const imgUrl = req.body.imgUrl;
  const uploaderId = req.session.userId;
  try {
    if (!imgUrl) throw createHttpError(400, "imgUrl is required");
    if (!uploaderId) throw createHttpError(400, "uploaderId is required");

    const post = new PostModel({
      imgUrl: imgUrl,
      uploaderId: uploaderId,
      caption: req.body.caption,
      description: req.body.description,
      topic: req.body.topic,
      allowComment: req.body.allowComment,
      comments: req.body.comments,
      reacts: req.body.reacts,
    });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};
