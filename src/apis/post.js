import { instanceJWT } from "../utils/api";

export const uploadImagePost = (image) =>
  instanceJWT.post("/posts/image", image, {
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
