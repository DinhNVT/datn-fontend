import { apiGetPostIdsFavoriteUser } from "../apis/user";
import {
  clearFavoritesPostIdsSlice,
  setInitFavoritesPostIdsSlice,
} from "./postSlice";

export const fetchFavoritePosts = async (dispatch) => {
  try {
    const res = await apiGetPostIdsFavoriteUser();
    if (res.data.status === "success") {
      const favoritePosts = res.data.postIds.map((favorite) => ({
        postId: favorite._id,
        slug: favorite.slug,
      }));
      dispatch(setInitFavoritesPostIdsSlice(favoritePosts));
    }
  } catch (error) {
    dispatch(clearFavoritesPostIdsSlice());
    console.log(error);
  }
};
