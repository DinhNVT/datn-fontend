import { apiGetFollowingIds } from "../apis/user";
import { clearFollowingIdsSlice, setInitFollowingIdsSlice } from "./userSlice";

export const fetchFollowingsUser = async (dispatch) => {
  try {
    const res = await apiGetFollowingIds();
    if (res.data.status === "success") {
      dispatch(setInitFollowingIdsSlice(res.data.followingIds));
    }
  } catch (error) {
    dispatch(clearFollowingIdsSlice());
    console.log(error);
  }
};
