import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/user.model";

export interface UserSlice {
  logInUser: User | null;
}

const initialState: UserSlice = {
  logInUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getAuthenticatedUser: (state, action: PayloadAction<User>) => {
      state.logInUser = action.payload;
    },
    logOut_delete: (state) => {
      state.logInUser = null;
    },
  },
});

export const { getAuthenticatedUser, logOut_delete } = userSlice.actions;
export default userSlice.reducer;
