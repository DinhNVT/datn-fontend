import { createSlice } from "@reduxjs/toolkit";

const authNotSaveSlice = createSlice({
  name: "auth_not_save",
  initialState: {
    register: {
      isLoading: false,
      error: false,
      message: null,
      success: false,
    },
    forgot: {
      isLoading: false,
      error: false,
      message: null,
      success: false,
    },
  },
  reducers: {
    registerIsLoading: (state) => {
      state.register.isLoading = true;
    },
    registerSuccess: (state, action) => {
      state.register.isLoading = false;
      state.register.error = false;
      state.register.success = true;
      state.register.message = action.payload;
    },
    registerFailed: (state, action) => {
      state.register.error = true;
      state.register.isLoading = false;
      state.register.success = false;
      state.register.message = action.payload;
    },
    registerReset: (state) => {
      state.register.error = false;
      state.register.isLoading = false;
      state.register.success = false;
      state.register.message = null;
    },
    forgotIsLoading: (state) => {
      state.forgot.isLoading = true;
    },
    forgotSuccess: (state, action) => {
      state.forgot.isLoading = false;
      state.forgot.error = false;
      state.forgot.success = true;
      state.forgot.message = action.payload;
    },
    forgotFailed: (state, action) => {
      state.forgot.error = true;
      state.forgot.isLoading = false;
      state.forgot.success = false;
      state.forgot.message = action.payload;
    },
    forgetReset: (state) => {
      state.forgot.error = false;
      state.forgot.isLoading = false;
      state.forgot.success = false;
      state.forgot.message = null;
    },
  },
});

export const {
  registerIsLoading,
  registerSuccess,
  registerFailed,
  registerReset,
  forgotIsLoading,
  forgotSuccess,
  forgotFailed,
  forgetReset,
} = authNotSaveSlice.actions;

export default authNotSaveSlice.reducer;
