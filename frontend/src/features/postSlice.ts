import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Post } from "../models/post.model";

export interface PostSlice {
  createdPosts: Post[] | null;
  isPostDetailShow: boolean;
  postId: string | null;
}

const initialState: PostSlice = {
  createdPosts: null,
  isPostDetailShow: false,
  postId: null,
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
  },
});

export const { addCreatedPosts, deletePost, showPostDetail, setPostId } =
  postSlice.actions;
export default postSlice.reducer;
