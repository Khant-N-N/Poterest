import { RequestHandler } from "express";
import createHttpError from "http-errors";
import PostModel from "../models/post.model";

interface PostType {
  imgUrl?: string;
  caption?: string;
  uploaderId?: string;
  comments?: Array<string>;
  reacts?: Array<string>;
}
export const CreatePost: RequestHandler<unknown, unknown, PostType> = async (
  req,
  res,
  next
) => {
  const imgUrl = req.body.imgUrl;
  const uploaderId = req.body.uploaderId;
  try {
    if (!imgUrl) throw createHttpError(400, "imgUrl is required");
    if (!uploaderId) throw createHttpError(400, "uploaderId is required");

    const post = new PostModel({
      imgUrl: imgUrl,
      uploaderId: uploaderId,
      caption: req.body.caption,
      comments: req.body.comments,
      reacts: req.body.reacts,
    });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};
