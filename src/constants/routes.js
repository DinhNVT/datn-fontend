import HomePage from "../pages/Home/HomePage"
import NotFoundPage from "../pages/404/NotFoundPage"

import MainLayout from "../layouts/MainLayout/MainLayout"
import NoHeaderLayout from "../layouts/NoHeaderLayout/NoHeaderLayout"


const ROUTES = {
  HOME_PAGE: {
    path: '/',
    component: HomePage,
    layout: MainLayout,
    isPrivate: false,
  },
  NOT_FOUND_PAGE: {
    path: '*',
    component: NotFoundPage,
    layout: NoHeaderLayout,
    isPrivate: false,
  },
}

export default ROUTES
