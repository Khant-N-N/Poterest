import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import PostModel from "../models/post.model";

interface Reply {
  likes?: string[];
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
  const commenterId = req.body.commenterId;
  const comment = req.body.comment;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid post Id");
    if (!commenterId) throw createHttpError(401, "Log In first.");

    const result = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: { commenterId, comment, createdAt: new Date() },
        },
      },
      { new: true, fields: { comments: 1 } }
    );

    if (result) {
      res.status(200).json(result.comments);
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
  const reply: string = req.body.reply;
  const replierId: string = req.body.replierId;

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
    comment.replies.push({ replierId, reply, replyAt: new Date() });

    await post.save();

    res.status(201).json(comment);
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

    if (!postUpdate) throw createHttpError(404, "comment not found.");

    res.status(204).json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};

interface DeletedReply {
  _id: mongoose.Types.ObjectId;
  likes?: string[];
  reply?: string | null | undefined;
  replierId?: string | null | undefined;
  replyAt?: Date | null | undefined;
}

interface DeletedComment {
  _id: mongoose.Types.ObjectId;
  likes: string[];
  commenterId?: string | null | undefined;
  comment?: string | null | undefined;
  createdAt?: Date | null | undefined;
  replies: DeletedReply[];
}

export const DeleteReply: RequestHandler = async (req, res, next) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const replyId = req.params.replyId;
  const deleterId = req.session.userId;
  try {
    if (
      !mongoose.isValidObjectId(postId) ||
      !mongoose.isValidObjectId(commentId) ||
      !mongoose.isValidObjectId(replyId) ||
      !mongoose.isValidObjectId(deleterId)
    ) {
      throw createHttpError(400, "Invalid IDs");
    }

    const post = await PostModel.findById(postId).select("+comments").exec();

    if (!post) {
      throw createHttpError(404, "Post not found.");
    }

    const comment = post.comments?.find((com) =>
      (com as DeletedComment)._id.equals(commentId)
    ) as DeletedComment;

    if (!comment) {
      throw createHttpError(404, "Comment not found.");
    }

    const replyIndex = comment.replies?.findIndex((rep) =>
      rep._id.equals(replyId)
    );

    if (replyIndex === -1) {
      throw createHttpError(404, "Reply not found.");
    }

    // Remove the reply from the array
    comment.replies.splice(replyIndex, 1);

    // Save the changes to the database
    await post.save();

    res.status(204).json({ message: "Reply deleted" });
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
  good_idea = "good_idea",
  love = "love",
  thanks = "thanks",
  wow = "wow",
  haha = "haha",
}

export const AddReaction: RequestHandler = async (req, res, next) => {
  const reactorId = req.session.userId;
  const react = req.body.react as ReactType;
  const postId = req.params.postId;

  try {
    if (!mongoose.isValidObjectId(reactorId))
      throw createHttpError(401, "Please Login first");

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
    const getReact = post.reacts.find(
      (reaction) => reaction.reactorId?.toString() === reactorId?.toString()
    );

    if (getIndex !== -1 && getReact?.react === react) {
      post.reacts.splice(getIndex, 1);
    } else if (getIndex !== -1 && getReact?.react !== react) {
      post.reacts.splice(getIndex, 1);
      post.reacts.push({ reactorId: reactorId?.toString(), react });
    } else {
      post.reacts.push({ reactorId: reactorId?.toString(), react });
    }
    const updatedPost = await post.save();

    res.status(201).json(updatedPost.reacts);
  } catch (error) {
    next(error);
  }
};
