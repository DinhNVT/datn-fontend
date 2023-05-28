import { instanceJWT, instance } from "../utils/api";

export const uploadImagePost = (image) =>
  instanceJWT.post("/posts/image", image, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updatePost = (post, id) =>
  instanceJWT.put(`/posts/${id}`, post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const createPost = (post) =>
  instanceJWT.post("/posts/", post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const apiDeletePost = (id) => instanceJWT.delete(`/posts/${id}`);
export const getLatestPost = () => instance.get("/posts/latest");
export const apiGetDetailPost = (slug) =>
  instance.get(`/posts/detail?slug=${slug}`);
export const apiGetDetailPostByRole = (id) =>
  instanceJWT.get(`/posts/detail/${id}`);

//comment
export const apiGetPostComments = (postId) =>
  instance.get(`/posts/comment?postId=${postId}`);
export const apiCreatePostComments = (status, comment) =>
  instanceJWT.post(`/posts/comment?status=${status}`, comment);
export const apiUpdatePostComments = (id, status, comment) =>
  instanceJWT.put(`/posts/comment/${id}?status=${status}`, comment);
export const apiDeletePostComments = (id, status) =>
  instanceJWT.delete(`/posts/comment/${id}?status=${status}`);
export const apiCreateReportPostComments = (report) =>
  instance.post(`/posts/comment/report`, report);

//get post option
export const apiGetPostsOption = (query) =>
  instance.get(`/posts/option?${query}`);
export const apiGetPostsMe = (query) => instanceJWT.get(`/posts/me?${query}`);
export const apiGetAllPosts = (query) =>
  instance.get(`/posts/get-all?${query}`);
export const apiGetAllTags = () => instanceJWT.get(`/posts/tags`);
