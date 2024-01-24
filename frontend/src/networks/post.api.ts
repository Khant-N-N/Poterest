import axios from "axios";
import { Post, Comment } from "../models/post.model";

const url = "https://poterest-api.onrender.com";
// const url = "http://localhost:5000";

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
  const response = await axios.post(`${url}/api/posts/upload`, formData, {
    withCredentials: true,
  });
  return response.data;
};

export const GetUserPosts = async (): Promise<Post[]> => {
  const response = await axios.get(`${url}/api/posts/get-user-posts`, {
    withCredentials: true,
  });
  return response.data;
};
export const GetTargetUserPosts = async (id: string): Promise<Post[]> => {
  const response = await axios.get(
    `${url}/api/posts/get-target-user-posts/${id}`,
    { withCredentials: true }
  );
  return response.data;
};
export const GetTargetPostDetails = async (id: string): Promise<Post> => {
  const response = await axios.get(`${url}/api/posts/get-post-details/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

interface EditFormProps {
  editForm: IntialCreateFormProp;
  id?: string;
}

export const EditMyPost = async ({ editForm, id }: EditFormProps) => {
  const response = await axios.post(
    `${url}/api/posts/update-post/${id}`,
    editForm,
    { withCredentials: true }
  );
  return response.data;
};

export const GetPublicAllPosts = async (): Promise<Post[]> => {
  const response = await axios.get(`${url}/api/posts/get-public-posts`, {
    withCredentials: true,
  });
  return response.data;
};

export const AddSavedPost = async (post: Post) => {
  const response = await axios.post(
    `${url}/api/posts/saved-post`,
    {
      saved: post,
    },
    { withCredentials: true }
  );
  return response.data;
};
export const RemoveSavedPost = async (postId: string) => {
  const response = await axios.post(
    `${url}/api/posts/removed-post`,
    {
      postId: postId,
    },
    { withCredentials: true }
  );
  return response.data;
};

export const DeletePost = async (postId: string) => {
  await axios.delete(`${url}/api/posts/delete-post/${postId}`, {
    withCredentials: true,
  });
};

export const GetCommentsOfPost = async (postId: string): Promise<Comment[]> => {
  const response = await axios.get(`${url}/api/posts/${postId}/comment`, {
    withCredentials: true,
  });
  return response.data;
};

export const AddCommentsToPost = async (
  postId: string,
  newComment: { commenterId: string | undefined; comment: string }
) => {
  const response = await axios.post(
    `${url}/api/posts/${postId}/comment`,
    newComment,
    { withCredentials: true }
  );
  return response.data;
};

export const DeleteComment = async (postId: string, commentId: string) => {
  const response = await axios.delete(
    `${url}/api/posts/${postId}/comment/${commentId}`,
    { withCredentials: true }
  );
  return response.data;
};
export const DeleteReply = async (
  postId: string,
  commentId: string,
  replyId: string
) => {
  const response = await axios.delete(
    `${url}/api/posts/${postId}/comment/${commentId}/${replyId}`,
    { withCredentials: true }
  );
  return response.data;
};

export const ReplyToComment = async (
  postId: string,
  commentId: string,
  reply: { replierId: string; reply: string }
): Promise<Comment> => {
  const response = await axios.post(
    `${url}/api/posts/${postId}/reply/${commentId}`,
    reply,
    { withCredentials: true }
  );
  return response.data;
};

export const GetReactsOfPost = async (postId: string) => {
  const response = await axios.get(`/api/posts/${postId}/react`, {
    withCredentials: true,
  });
  return response.data;
};

export const AddRemoveReactionToPost = async (
  postId: string,
  react: string
) => {
  const response = await axios.post(
    `${url}/api/posts/${postId}/react`,
    {
      react: react,
    },
    { withCredentials: true }
  );
  return response.data;
};
