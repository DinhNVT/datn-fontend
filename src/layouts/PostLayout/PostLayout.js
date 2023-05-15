import React from "react";
import "./PostLayout.scss";
import Header from "../../components/Header/Header";
import { Link, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
import ROUTES from "../../constants/routes";

const PostLayout = (props) => {
  // const { user } = useSelector((state) => state?.auth?.login);
  const location = useLocation();
  return (
    <div className="me-post-layout">
      <Header />
      <div className="me-post-children">
        <div className="me-post-container">
          <div className="me-post-menu">
            <div className="me-post-title">
              <h1>Bài viết của bạn</h1>
              <Link to={ROUTES.WRITE_PAGE.path}>Viết bài</Link>
            </div>
            <div className="me-post-navbar">
              <ul>
                <li>
                  <Link
                    className={
                      location.pathname.includes(ROUTES.PUBLISHED_PAGE.path)
                        ? "active"
                        : ""
                    }
                    to={ROUTES.PUBLISHED_PAGE.path}
                  >
                    Công khai
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      location.pathname.includes(ROUTES.DRAFTS_PAGE.path)
                        ? "active"
                        : ""
                    }
                    to={ROUTES.DRAFTS_PAGE.path}
                  >
                    Bản nháp
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      location.pathname.includes(ROUTES.BLOCKED_PAGE.path)
                        ? "active"
                        : ""
                    }
                    to={ROUTES.BLOCKED_PAGE.path}
                  >
                    Bị chặn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="me-post-content">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default PostLayout;
