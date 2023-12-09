import { Post } from "./post.model";

export interface User {
  _id: string;
  avatar: string;
  username: string;
  email: string;
  saved: [Post];
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}
