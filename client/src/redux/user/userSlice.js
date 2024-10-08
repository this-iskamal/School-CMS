import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  errorMessage: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      (state.loading = true), (state.errorMessage = null);
    },

    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.errorMessage = null;
    },

    signInFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.errorMessage = null;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
