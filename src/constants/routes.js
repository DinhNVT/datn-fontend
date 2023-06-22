import HomePage from "../pages/Home/HomePage";
import NotFoundPage from "../pages/404/NotFoundPage";
import ContactPage from "../pages/Contact/ContactPage";
import WritePost from "../pages/WritePost/WritePost";

import MainLayout from "../layouts/MainLayout/MainLayout";
import NoHeaderLayout from "../layouts/NoHeaderLayout/NoHeaderLayout";
import Profile from "../pages/Profile/Profile";
import ProfileLayout from "../layouts/ProfileLayout/ProfileLayout";
import Favorites from "../pages/Profile/Favorites/Favorites";
import Follower from "../pages/Profile/Follower/Follower";
import Following from "../pages/Profile/Following/Following";
import PostLayout from "../layouts/PostLayout/PostLayout";
import Drafts from "../pages/MePost/Drafts/Drafts";
import Published from "../pages/MePost/Published/Published";
import Blocked from "../pages/MePost/Blocked/Blocked";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import PostDetail from "../pages/PostDetail/PostDetail";
import EditPost from "../pages/EditPost/EditPost";
import FollowingHome from "../pages/Home/Following/Following";
import Search from "../pages/Search/Search";
import Category from "../pages/Category/Category";
import EditProfile from "../pages/MePost/EditProfile/EditProfile";
import Video from "../pages/Video/Video";

const ROUTES = {
  HOME_PAGE: {
    path: "/",
    component: HomePage,
    layout: HomeLayout,
    isPrivate: false,
  },

  HOME_FOLLOWING_PAGE: {
    path: "/following",
    component: FollowingHome,
    layout: HomeLayout,
    isPrivate: true,
  },

  CONTACT_PAGE: {
    path: "/contact",
    component: ContactPage,
    layout: MainLayout,
    isPrivate: false,
  },

  WRITE_PAGE: {
    path: "/write",
    component: WritePost,
    layout: NoHeaderLayout,
    isPrivate: true,
  },

  PROFILE_PAGE: {
    path: "/profile/:username",
    component: Profile,
    layout: ProfileLayout,
    isPrivate: false,
  },

  FAVORITES_PAGE: {
    path: "/profile/:username/favorites",
    component: Favorites,
    layout: ProfileLayout,
    isPrivate: false,
  },

  FOLLOWER_PAGE: {
    path: "/profile/:username/follower",
    component: Follower,
    layout: ProfileLayout,
    isPrivate: false,
  },

  FOLLOWING_PAGE: {
    path: "/profile/:username/following",
    component: Following,
    layout: ProfileLayout,
    isPrivate: false,
  },

  DRAFTS_PAGE: {
    path: "/me/post/drafts",
    component: Drafts,
    layout: PostLayout,
    isPrivate: true,
  },

  EDIT_PROFILE_PAGE: {
    path: "/me/edit/profile",
    component: EditProfile,
    layout: NoHeaderLayout,
    isPrivate: true,
  },

  PUBLISHED_PAGE: {
    path: "/me/post/published",
    component: Published,
    layout: PostLayout,
    isPrivate: true,
  },

  BLOCKED_PAGE: {
    path: "/me/post/blocked",
    component: Blocked,
    layout: PostLayout,
    isPrivate: true,
  },

  EDIT_PAGE: {
    path: "/me/post/edit/:id",
    component: EditPost,
    layout: NoHeaderLayout,
    isPrivate: true,
  },

  POST_DETAIL_PAGE: {
    path: "/post/:slug",
    component: PostDetail,
    layout: MainLayout,
    isPrivate: false,
  },

  POST_SEARCH_PAGE: {
    path: "/post",
    component: Search,
    layout: MainLayout,
    isPrivate: false,
  },

  CATEGORY_PAGE: {
    path: "/category/:slug",
    component: Category,
    layout: MainLayout,
    isPrivate: false,
  },

  VIDEO_PAGE: {
    path: "/video",
    component: Video,
    layout: MainLayout,
    isPrivate: false,
  },

  NOT_FOUND_PAGE: {
    path: "*",
    component: NotFoundPage,
    layout: MainLayout,
    isPrivate: false,
  },
};

export default ROUTES;

export const MENU_ITEMS = [
  { name: "Bài viết", link: "/" },
  // { name: "Liên hệ", link: "/contact" },
  // { name: "Category", link: "/category" },
];
