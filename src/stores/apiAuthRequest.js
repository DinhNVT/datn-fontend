import {
  login,
  registerUser,
  refreshToken,
  logoutUser,
  forgotPasswordUser,
} from "../apis/auth";
import {
  registerFailed,
  registerIsLoading,
  registerSuccess,
  forgotFailed,
  forgotIsLoading,
  forgotSuccess,
} from "./authNotSaveSlice";
import { isLoading, loginSuccess, loginFailed, clearUser } from "./authSlice";

// Create an async thunk for logging in
export const loginFetch = async (user, dispatch, closeModal) => {
  dispatch(isLoading());
  try {
    const response = await login(user);
    dispatch(loginSuccess(response.data));
    localStorage.setItem("accessToken", response?.data?.accessToken);
    closeModal();
  } catch (error) {
    dispatch(loginFailed(error.response.data));
  }
};

// Create an async thunk for logging in
export const registerFetch = async (user, dispatch) => {
  dispatch(registerIsLoading());
  try {
    const response = await registerUser(user);
    dispatch(registerSuccess(response.data));
  } catch (error) {
    dispatch(registerFailed(error.response.data));
  }
};

// Create an async thunk for logging in
export const checkRefreshTokenFetch = async (dispatch) => {
  try {
    const response = await refreshToken();
    localStorage.setItem("accessToken", response.data.accessToken);
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      localStorage.removeItem("accessToken");
      dispatch(clearUser());
    }
    console.log(error);
  }
};

export const logoutUserFetch = async (dispatch, closeDropdown, navigate) => {
  try {
    await logoutUser();
    closeDropdown();
    dispatch(clearUser());
    localStorage.removeItem("accessToken");
    localStorage.clear();
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const forgotFetch = async (user, dispatch) => {
  dispatch(forgotIsLoading());
  try {
    const response = await forgotPasswordUser(user);
    dispatch(forgotSuccess(response.data));
  } catch (error) {
    dispatch(forgotFailed(error.response.data));
  }
};
