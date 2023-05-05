import HomePage from "../pages/Home/HomePage";
import NotFoundPage from "../pages/404/NotFoundPage";
import ContactPage from "../pages/Contact/ContactPage";
import WritePost from "../pages/WritePost/WritePost";

import MainLayout from "../layouts/MainLayout/MainLayout";
import NoHeaderLayout from "../layouts/NoHeaderLayout/NoHeaderLayout";
import Profile from "../pages/Profile/Profile";
import ProfileLayout from "../layouts/ProfileLayout/ProfileLayout";

const ROUTES = {
  HOME_PAGE: {
    path: "/",
    component: HomePage,
    layout: MainLayout,
    isPrivate: false,
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
    isPrivate: true,
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
  { name: "Blog", link: "/" },
  { name: "Contact", link: "/contact" },
  { name: "Category", link: "/category" },
];
