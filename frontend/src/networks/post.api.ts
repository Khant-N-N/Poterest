import axios from "axios";
import { Post, Comment } from "../models/post.model";

export interface IntialCreateFormProp {
  imgUrl?: string;
  caption?: string;
  description?: string;
  topic?: string[];
  allowComment?: boolean;
}

export const CreateAPost = async (
  formData: IntialCreateFormProp
): Promise<Post> => {
  const response = await axios.post("/api/posts/upload", formData);
  return response.data;
};

export const GetUserPosts = async (): Promise<Post[]> => {
  const response = await axios.get("/api/posts/get-user-posts");
  return response.data;
};
export const GetTargetUserPosts = async (id: string): Promise<Post[]> => {
  const response = await axios.get(`/api/posts/get-target-user-posts/${id}`);
  return response.data;
};
export const GetTargetPostDetails = async (id: string): Promise<Post> => {
  const response = await axios.get(`/api/posts/get-post-details/${id}`);
  return response.data;
};

interface EditFormProps {
  editForm: IntialCreateFormProp;
  id?: string;
}

export const EditMyPost = async ({ editForm, id }: EditFormProps) => {
  const response = await axios.post(`/api/posts/update-post/${id}`, editForm);
  return response.data;
};

export const GetPublicAllPosts = async (): Promise<Post[]> => {
  const response = await axios.get("/api/posts/get-public-posts");
  return response.data;
};

export const AddSavedPost = async (post: Post) => {
  const response = await axios.post("/api/posts/saved-post", { saved: post });
  return response.data;
};
export const RemoveSavedPost = async (postId: string) => {
  const response = await axios.post("/api/posts/removed-post", {
    postId: postId,
  });
  return response.data;
};

export const DeletePost = async (postId: string) => {
  await axios.delete(`/api/posts/delete-post/${postId}`);
};

export const GetCommentsOfPost = async (postId: string): Promise<Comment[]> => {
  const response = await axios.get(`/api/posts/${postId}/comment`);
  return response.data;
};

export const AddCommentsToPost = async (
  postId: string,
  newComment: { commenterId: string | undefined; comment: string }
) => {
  const response = await axios.post(`/api/posts/${postId}/comment`, newComment);
  return response.data;
};

export const DeleteComment = async (postId: string, commentId: string) => {
  const response = await axios.delete(
    `/api/posts/${postId}/comment/${commentId}`
  );
  return response.data;
};
export const DeleteReply = async (
  postId: string,
  commentId: string,
  replyId: string
) => {
  const response = await axios.delete(
    `/api/posts/${postId}/comment/${commentId}/${replyId}`
  );
  return response.data;
};

export const ReplyToComment = async (
  postId: string,
  commentId: string,
  reply: { replierId: string; reply: string }
): Promise<Comment> => {
  const response = await axios.post(
    `/api/posts/${postId}/reply/${commentId}`,
    reply
  );
  return response.data;
};

export const GetReactsOfPost = async (postId: string) => {
  const response = await axios.get(`/api/posts/${postId}/react`);
  return response.data;
};

export const AddRemoveReactionToPost = async (
  postId: string,
  react: string
) => {
  const response = await axios.post(`/api/posts/${postId}/react`, {
    react: react,
  });
  return response.data;
};
