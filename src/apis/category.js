import { instance } from "../utils/api";

export const getAllCategories = () => instance.get("/category-post/");
export const apiGetCategoryDetail = (slug) =>
  instance.get(`/category-post/${slug}`);
