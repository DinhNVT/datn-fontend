import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      user: null,
      isLoading: false,
      error: false,
      errorMessage: null,
    },
  },
  reducers: {
    isLoading: (state) => {
      state.login.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.login.isLoading = false;
      state.login.user = action.payload;
      state.login.error = false;
      state.login.errorMessage = null;
    },
    loginFailed: (state, action) => {
      state.login.error = true;
      state.login.errorMessage = action.payload;
      state.login.isLoading = false;
    },
    clearUser: (state) => {
      state.login.user = null;
      state.login.isLoading = false;
      state.login.error = false;
      state.login.errorMessage = null;
    },
    clearErrorLogin: (state) => {
      state.login.error = false;
      state.login.errorMessage = null;
      state.login.isLoading = false;
    },
  },
});

export const {
  isLoading,
  loginSuccess,
  loginFailed,
  clearUser,
  clearErrorLogin,
} = authSlice.actions;

export default authSlice.reducer;
