import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Post } from "../models/post.model";

export interface PostSlice {
  createdPosts: Post[] | null;
}

const initialState: PostSlice = {
  createdPosts: null,
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
  },
});

export const { addCreatedPosts, deletePost } = postSlice.actions;
export default postSlice.reducer;
