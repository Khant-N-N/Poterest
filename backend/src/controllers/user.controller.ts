import { RequestHandler } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";
import mongoose from "mongoose";

interface userBody {
  _id?: string;
  avatar?: string;
  username?: string;
  email?: string;
  password?: string;
}

export const GetAuthenicatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.session.userId).exec();
    if (!user) throw createHttpError(404, "user not found");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const SignUp: RequestHandler<
  unknown,
  unknown,
  userBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const passwordRaw = req.body.password;
  const email = req.body.email;

  try {
    if (!username || !passwordRaw || !email)
      throw createHttpError(400, "parameters are missing");

    const existEmail = await UserModel.findOne({ email: email });

    if (existEmail) throw createHttpError(409, "Email already exist");

    const hashedPassword = bcrypt.hashSync(passwordRaw, 10);

    const CreatedUser = await UserModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    req.session.userId = CreatedUser._id;
    res.status(201).json(CreatedUser);
  } catch (error) {
    next(error);
  }
};

export const SignIn: RequestHandler<
  unknown,
  unknown,
  userBody,
  unknown
> = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    if (!email || !password) throw createHttpError("parameters are missing");
    const findUser = await UserModel.findOne({ email: email })
      .select("+password")
      .exec();
    if (!findUser) throw createHttpError(401, "Invalid Credential");

    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (!passwordMatch) throw createHttpError(401, "Invalid Credential");

    req.session.userId = findUser._id;

    const userObject = findUser.toObject();

    const { password: pass, ...rest } = userObject;

    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const LogOut: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => (error ? next(error) : res.sendStatus(200)));
};

export const GetTargetUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(userId))
      throw createHttpError(400, "Invalid User ID");

    const user = await UserModel.findById(userId).exec();

    if (!user) throw createHttpError(404, "User does not exist.");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface UpdateParams {
  id: string;
}

export const UpdateUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(userId))
      throw createHttpError(400, "Invalid User ID");
    const user = await UserModel.findById(userId);
    if (!user) throw createHttpError(404, "User does not exist.");

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    res.status(201).json(updateUser);
  } catch (error) {
    next(error);
  }
};
