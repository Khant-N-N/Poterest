import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import PostModel from "../models/post.model";

interface Reply {
  likes: string[];
  reply?: string | null | undefined;
  replierId?: string | null | undefined;
  replyAt?: Date | null | undefined;
}

interface Comment {
  likes: string[];
  commenterId?: string | null | undefined;
  comment?: string | null | undefined;
  createdAt?: Date | null | undefined;
  replies: Reply[];
}

export const AddAComment: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  const newComment = req.body.newComment as Comment;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");

    const result = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: { ...newComment, createdAt: new Date() },
        },
      },
      { new: true, fields: { comments: 1 } }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      throw createHttpError(404, "Post or Comment not found");
    }
  } catch (error) {
    next(error);
  }
};

export const GetComments: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");

    const commentOfPost = await PostModel.findById(postId)
      .select(
        "-imgUrl -uploaderId -allowComment -caption -description -topic +comments -createdAt -updatedAt"
      )
      .exec();

    if (!commentOfPost) throw createHttpError(404, "Post doesn't exist.");
    res.status(200).json(commentOfPost.comments);
  } catch (error) {
    next(error);
  }
};

export const ReplyComment: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const newReply: Reply = req.body.newReply;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");
    if (!mongoose.isValidObjectId(commentId))
      throw createHttpError(400, "Invalid comment Id");

    const post = await PostModel.findById(postId).select("+comments");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const getComment = post.comments as [
      {
        _id: mongoose.Types.ObjectId; //*** */
        commenterId: string;
        comment: string;
        createdAt: Date;
        likes: string[];
        replies: Reply[];
      }
    ];

    const commentObjectId = new mongoose.Types.ObjectId(commentId); //*** */

    const comment = getComment.find((c) => c._id.equals(commentObjectId));

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.replies.push({ ...newReply, replyAt: new Date() });

    await post.save();

    res.status(201).json({ message: "Reply added successfully", post });
  } catch (error) {
    next(error);
  }
};

export const DeleteComment: RequestHandler = async (req, res, next) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const deleterId = req.session.userId;

  try {
    if (!mongoose.isValidObjectId(commentId))
      throw createHttpError(400, "Invalid comment Id");
    if (!mongoose.isValidObjectId(deleterId))
      throw createHttpError(400, "Invalid user Id");

    const postUpdate = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: {
          comments: { _id: commentId, commenterId: deleterId },
        },
      },
      { new: true, fields: { comments: 1 } }
    );

    if (!postUpdate) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedComments = postUpdate.comments;

    res.status(200).json(updatedComments);
  } catch (error) {
    next(error);
  }
};

////// reaction route

interface reaction {
  reactorId: string;
  react: string;
}

export const GetReactions: RequestHandler = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");

    const reactsOfPost = await PostModel.findById(postId)
      .select(
        "-imgUrl -uploaderId -allowComment -caption -description -topic +reacts -createdAt -updatedAt"
      )
      .exec();

    if (!reactsOfPost) throw createHttpError(404, "Post doesn't exist.");
    res.status(200).json(reactsOfPost.reacts);
  } catch (error) {
    next(error);
  }
};

enum ReactType {
  GoodIdea = "good_idea",
  Love = "love",
  Thanks = "thanks",
  Wow = "wow",
  Haha = "haha",
}

export const AddReaction: RequestHandler = async (req, res, next) => {
  const reactorId = req.session.userId;
  const react: ReactType = req.body.react;
  const postId = req.params.postId;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");

    if (!Object.values(ReactType).includes(react))
      throw createHttpError(400, "Invalid react value");

    const post = await PostModel.findById(postId)
      .select(
        "-imgUrl -uploaderId -allowComment -caption -description -topic +reacts -createdAt -updatedAt"
      )
      .exec();
    if (!post) throw createHttpError(404, "Post not found.");
    const getIndex = post.reacts.findIndex(
      (reaction) => reaction.reactorId?.toString() === reactorId?.toString()
    );
    const reactorIdStr = reactorId as unknown as string;
    if (getIndex !== -1) {
      post.reacts.splice(getIndex, 1);
    } else {
      post.reacts.push({ reactorId: reactorIdStr, react });
    }
    const updatedPost = await post.save();

    res.status(201).json(updatedPost.reacts);
  } catch (error) {
    next(error);
  }
};
