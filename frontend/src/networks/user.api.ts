import axios from "axios";
import { User } from "../models/user.model";

export const GetAuthenticatedUser = async (): Promise<User> => {
  const response = await axios.get("/api/user");
  return response.data;
};
