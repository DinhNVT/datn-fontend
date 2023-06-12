import { instanceJWT, instance } from "../utils/api";

export const apiGetUserByUsername = (username) =>
  instance.get(`/users/public/username/${username}`);

export const apiGetFavoriteUser = (id) =>
  instanceJWT.get(`/users/favorite/${id}`);
export const apiGetPostIdsFavoriteUser = () =>
  instanceJWT.get(`/users/favorite-post/id`);
export const apiAddToFavorites = (postId) =>
  instanceJWT.post(`/users/favorite`, postId);
export const apiDeleteFavoritePost = (postId) =>
  instanceJWT.delete(`/users/favorite/${postId}`);

//follow
export const apiGetFollowerUser = (id) => instance.get(`/users/follower/${id}`);
export const apiGetFollowingUser = (id) =>
  instance.get(`/users/following/${id}`);
export const apiGetFollowingIds = () =>
  instanceJWT.get(`/users/following-ids/get`);
export const apiFollowUser = (id) => instanceJWT.post(`/users/follow/${id}`);
export const apiUnFollowUser = (id) =>
  instanceJWT.delete(`/users/follow/${id}`);

//get
export const apiGetUserPrivateById = (id) => instanceJWT.get(`/users/${id}`);
export const apiGetUserPrivateByUserId = () =>
  instanceJWT.get(`/users/user/id`);
export const apiUpdateUserProfile = (id, status, data) =>
  instanceJWT.put(`/users/${id}?status=${status}`, data);
export const apiChangePasswordUser = (data) =>
  instanceJWT.put(`/users/change-password/user`, data);
export const apiChangeAvatarUser = (id, status, data) =>
  instanceJWT.put(`/users/avatar/${id}?status=${status}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
