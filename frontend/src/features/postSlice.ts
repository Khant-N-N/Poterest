import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Comment, Post } from "../models/post.model";

export interface PostSlice {
  createdPosts: Post[] | null;
  isPostDetailShow: boolean;
  postId: string | null;
  addedComments: Comment[];
}

const initialState: PostSlice = {
  createdPosts: null,
  isPostDetailShow: false,
  postId: null,
  addedComments: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addCreatedPosts: (state, action: PayloadAction<Post[]>) => {
      state.createdPosts = action.payload;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.createdPosts =
        state.createdPosts &&
        state.createdPosts.filter((pos) => pos._id !== action.payload);
    },
    showPostDetail: (state, action: PayloadAction<boolean>) => {
      state.isPostDetailShow = action.payload;
    },
    setPostId: (state, action: PayloadAction<string>) => {
      state.postId = action.payload;
    },
    setAddComments: (state, action: PayloadAction<Comment[]>) => {
      state.addedComments = action.payload;
    },
    updateReplyComment: (state, action: PayloadAction<Comment>) => {
      state.addedComments = state.addedComments.map((com) =>
        com._id === action.payload._id ? action.payload : com
      );
    },
    deleteComment: (state, action: PayloadAction<string>) => {
      state.addedComments = state.addedComments.filter(
        (com) => com._id !== action.payload
      );
    },
  },
});

export const {
  addCreatedPosts,
  deletePost,
  showPostDetail,
  setPostId,
  setAddComments,
  updateReplyComment,
  deleteComment,
} = postSlice.actions;
export default postSlice.reducer;
