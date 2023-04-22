import { instance } from "../utils/api";

export const login = (user) =>
  instance.post("/auth/login", user, {
    withCredentials: true,
  });

export const registerUser = (user) => instance.post("/auth/register", user);

export const forgotPasswordUser = (email) =>
  instance.post("/auth/forget-password", email);

export const refreshToken = () =>
  instance.post(
    "/auth/refresh-token",
    {},
    {
      withCredentials: true,
    }
  );
  
export const logoutUser = () =>
  instance.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
