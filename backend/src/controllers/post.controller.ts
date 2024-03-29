import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import PostModel from "../models/post.model";
import UserModel from "../models/user.model";

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

export const GetUserPosts: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (!mongoose.isValidObjectId(userId))
      throw createHttpError(400, "Invalid User Id");

    const Posts = await PostModel.find({ uploaderId: userId });
    res.status(200).json(Posts);
  } catch (error) {
    next(error);
  }
};
export const GetTargetUserPosts: RequestHandler = async (req, res, next) => {
  const userId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(userId))
      throw createHttpError(400, "Invalid User Id");

    const Posts = await PostModel.find({ uploaderId: userId });
    res.status(200).json(Posts);
  } catch (error) {
    next(error);
  }
};
export const GetTargetPost: RequestHandler = async (req, res, next) => {
  const postId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid User Id");

    const Posts = await PostModel.findById(postId).select("+reacts").exec();
    if (!Posts) throw createHttpError(404, "Post doesn't exist.");
    res.status(200).json(Posts);
  } catch (error) {
    next(error);
  }
};

export const GetPublicPosts: RequestHandler = async (req, res, next) => {
  const limit = parseInt(req.query.limit as string, 10) || 15;
  const startIndex = parseInt(req.query.startIndex as string, 10) || 0;
  try {
    if (!req.session.userId)
      throw createHttpError(401, "Please Sign In first.");
    const posts = await PostModel.find()
      .sort({ createdAt: "desc" })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const UpdatePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid Post Id");

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          description: req.body.description || undefined,
          caption: req.body.caption || undefined,
          allowComment: req.body.allowComment,
          topic: req.body.topic || undefined,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) throw createHttpError(404, "Post doesn't exist.");

    res.status(201).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
export const DeletePost: RequestHandler = async (req, res, next) => {
  const postId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(postId))
      throw createHttpError(400, "Invalid Post Id");
    const post = await PostModel.findById(postId);
    if (!post) throw createHttpError(404, "Post doesn't exist.");
    await PostModel.findByIdAndDelete(postId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

interface Removed {
  postId: string;
}

interface Saved {
  saved: PostType;
}

export const SavedPost: RequestHandler<unknown, unknown, Saved> = async (
  req,
  res,
  next
) => {
  const userId = req.session.userId;
  const addedSavedPost = req.body.saved;

  try {
    if (!mongoose.isValidObjectId(userId))
      throw createHttpError(400, "Invalid user Id");

    const user = await UserModel.findById(userId).select("+saved").exec();
    if (!user) throw createHttpError(404, "User doesn't exist.");

    user.saved = [...user.saved, addedSavedPost];
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const RemoveSavedPost: RequestHandler<
  unknown,
  unknown,
  Removed
> = async (req, res, next) => {
  const userId = req.session.userId;
  const removeSavedPost = req.body.postId;

  try {
    if (!mongoose.isValidObjectId(userId))
      throw createHttpError(400, "Invalid user Id");

    const user = await UserModel.findById(userId).select("+saved");
    if (!user) throw createHttpError(404, "User doesn't exist.");

    user.saved = user.saved.filter((post) => post._id !== removeSavedPost);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const FindPosts: RequestHandler = async (req, res, next) => {
  const keyword = req.query.keyword as string;
  try {
    if (keyword === "") return;

    const regex = new RegExp(keyword, "i");

    const postsByTopic = await PostModel.find({
      topic: { $elemMatch: { $regex: regex } },
    });

    const postsByCaption = await PostModel.find({
      caption: { $regex: regex },
    });

    const postsByDescription = await PostModel.find({
      description: { $regex: regex },
    });

    const allPosts = [
      ...postsByTopic,
      ...postsByCaption,
      ...postsByDescription,
    ];

    const returnPosts = allPosts.filter(
      (post, index, self) => index === self.findIndex((p) => p._id === post._id)
    );

    res.status(200).json(returnPosts);
  } catch (error) {
    next(error);
  }
};
