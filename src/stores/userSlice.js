import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    followingIds: [],
  },
  reducers: {
    setInitFollowingIdsSlice: (state, action) => {
      state.followingIds = action.payload;
    },
    followUserSlice: (state, action) => {
      state.followingIds.push({ following: action.payload });
    },
    unFollowUserSlice: (state, action) => {
      state.followingIds = state.followingIds.filter(
        (followingId) => followingId.following !== action.payload
      );
    },
    clearFollowingIdsSlice: (state) => {
      state.followingIds = [];
    },
  },
});

export const {
  setInitFollowingIdsSlice,
  followUserSlice,
  unFollowUserSlice,
  clearFollowingIdsSlice,
} = userSlice.actions;

export default userSlice.reducer;
