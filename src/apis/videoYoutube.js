import { instance } from "../utils/api";

export const apiGetAllVideosYoutube = (query) =>
  instance.get(`/video-youtube/?${query}`);
