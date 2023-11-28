import axios from "axios";
import { User } from "../models/user.model";

export const GetAuthenticatedUser = async (): Promise<User> => {
  const response = await axios.get("/api/user");
  return response.data;
};

interface LogInInfo {
  email: string;
  password: string;
}
export const LogInUser = async (info: LogInInfo): Promise<User> => {
  const response = await axios.post("/api/user/signin", info);
  return response.data;
};

interface SignUpInfo {
  email: string;
  username: string;
  password: string;
}
export const SignUpUser = async (info: SignUpInfo): Promise<User> => {
  const response = await axios.post("/api/user/signup", info);
  return response.data;
};
