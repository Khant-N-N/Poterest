import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Comment, Post, Reply } from "../models/post.model";
import { User } from "../models/user.model";

export interface PostSlice {
  createdPosts: Post[] | null;
  isPostDetailShow: boolean;
  postId: string | null;
  addedComments: Comment[];
  savedUsers: User[];
}

const initialState: PostSlice = {
  createdPosts: null,
  isPostDetailShow: false,
  postId: null,
  addedComments: [],
  savedUsers: [],
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
    deleteReply: (
      state,
      action: PayloadAction<{ id: string; replyId: string }>
    ) => {
      const findCommentIndex = state.addedComments.findIndex(
        (com) => com._id === action.payload.id
      );

      if (findCommentIndex !== -1) {
        const updatedComments = [
          ...state.addedComments.slice(0, findCommentIndex),
          {
            ...state.addedComments[findCommentIndex],
            replies: state.addedComments[findCommentIndex].replies.filter(
              (reply) => reply._id !== action.payload.replyId
            ),
          },
          ...state.addedComments.slice(findCommentIndex + 1),
        ];

        state.addedComments = updatedComments;
      }
    },
    savedUserData: (state, action: PayloadAction<User>) => {
      state.savedUsers = state.savedUsers.find(
        (user) => user._id === action.payload._id
      )
        ? [...state.savedUsers]
        : [...state.savedUsers, action.payload];
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
  deleteReply,
  savedUserData,
} = postSlice.actions;
export default postSlice.reducer;
