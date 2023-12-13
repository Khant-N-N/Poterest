import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import postModel from "../models/post.model";

interface AddACommentType {
  postId: string;
  newComment: {
    _id: string;
    commenterId: string;
    comment: string;
    createdAt: Date;
    likes: string[];
    replies: {
      reply?: string | null | undefined;
      replierId?: string | null | undefined;
      replyAt?: Date | null | undefined;
    }[];
  };
}

export const AddAComment: RequestHandler<
  unknown,
  unknown,
  AddACommentType
> = async (req, res, next) => {
  const postId = req.body.postId;
  const newComment = req.body.newComment;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");

    const post = await postModel.findById(postId).exec();

    if (!post) throw createHttpError(404, "Post doesn't exist.");
    post.comments = [...post.comments, newComment];
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const ReplyComment: RequestHandler = async (req, res, next) => {
  const postId: string = req.body.postId;
  const commentId: string = req.body.commentId;
  const reply: string = req.body.reply;
  const replierId: string = req.body.replierId;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");
    if (!mongoose.isValidObjectId(commentId))
      throw createHttpError(400, "Invalid comment Id");

    const result = await postModel.updateOne(
      { _id: postId, "comments._id": commentId },
      {
        $push: {
          "comments.$.replies": {
            replierId,
            reply,
            replyAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: "Reply added successfully" });
    } else {
      res.status(404).json({ message: "Post or Comment not found" });
    }
  } catch (error) {
    next(error);
  }
};
