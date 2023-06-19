import { instance } from "../utils/api";

export const login = (user) =>
  instance.post("/auth/login", user, {
    withCredentials: true,
  });

export const registerUser = (user) => instance.post("/auth/register", user);

export const forgotPasswordUser = (email) =>
  instance.post("/auth/forget-password", email);

export const refreshToken = (refreshToken) =>
  instance.post("/auth/refresh-token", refreshToken, {
    withCredentials: true,
  });

export const logoutUser = (refreshToken) =>
  instance.post("/auth/logout", refreshToken, {
    withCredentials: true,
  });
