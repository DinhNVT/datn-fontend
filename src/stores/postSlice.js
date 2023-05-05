import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    createPost: {
      categoryId: "",
      title: "",
      thumbnail: null,
      image: "",
      content: "",
      tags: [],
    },
  },
  reducers: {
    setCategoryId: (state, action) => {
      state.createPost.categoryId = action.payload;
    },
    setTitle: (state, action) => {
      state.createPost.title = action.payload;
    },
    setThumbnail: (state, action) => {
      state.createPost.thumbnail = action.payload;
    },
    setImage: (state, action) => {
      state.createPost.image = action.payload;
    },
    setContent: (state, action) => {
      state.createPost.content = action.payload;
    },
    setTags: (state, action) => {
      state.createPost.tags = action.payload;
    },
    clearCreatePost: (state) => {
      state.createPost.categoryId = "";
      state.createPost.title = "";
      state.createPost.thumbnail = null;
      state.createPost.image = "";
      state.createPost.content = "";
      state.createPost.tags = [];
    },
  },
});

export const {
  setCategoryId,
  setTitle,
  setThumbnail,
  setImage,
  setContent,
  setTags,
  clearCreatePost,
} = postSlice.actions;

export default postSlice.reducer;
