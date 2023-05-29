import { instanceJWT, instance } from "../utils/api";

export const apiGetUserByUsername = (username) =>
  instance.get(`/users/public/username/${username}`);
export const apiGetFavoriteUser = (id) =>
  instanceJWT.get(`/users/favorite/${id}`);
export const apiGetFollowerUser = (id) => instance.get(`/users/follower/${id}`);
export const apiGetFollowingUser = (id) =>
  instance.get(`/users/following/${id}`);
