import { instance } from "../utils/api";

export const getAllCategories = () => instance.get("/category-post/");
