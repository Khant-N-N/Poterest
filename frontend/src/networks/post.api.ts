import axios from "axios";
import { Post } from "../models/post.model";

export interface IntialCreateFormProp {
  imgUrl: string;
  caption: string;
  description: string;
  topic: string[];
  allowComment: boolean;
}

export const CreateAPost = async (
  formData: IntialCreateFormProp
): Promise<Post> => {
  const response = await axios.post("/api/posts/upload", formData);
  return response.data;
};
