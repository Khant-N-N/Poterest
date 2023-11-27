import { RequestHandler, json } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";

interface userBody {
  username?: string;
  email?: string;
  password?: string;
}

export const SignUp: RequestHandler<unknown, unknown, userBody> = async (
  req,
  res,
  next
) => {
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

    res.status(201).json(findUser);
  } catch (error) {
    next(error);
  }
};

export const LogOut: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => (error ? next(error) : res.sendStatus(200)));
};
