import React, { useEffect, useState } from "react";
import "./ProfileLayout.scss";
import Header from "../../components/Header/Header";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import avtDefault from "../../assets/images/avatar_default.png";
import { apiGetUserByUsername } from "../../apis/user";
import NotFoundPage from "../../pages/404/NotFoundPage";
import Footer from "../../components/Footer/Footer";
import { useSelector } from "react-redux";
import ROUTES from "../../constants/routes";

const ProfileLayout = (props) => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [getUser, setGetUser] = useState(null);
  const { user } = useSelector((state) => state?.auth?.login);

  const getUserByUsername = async (params) => {
    try {
      const res = await apiGetUserByUsername(params.username);
      if (res.data.user) {
        setGetUser(res.data.user);
      } else {
        setGetUser("none");
      }
    } catch (error) {
      console.log(error?.res?.data?.message);
    }
  };

  useEffect(() => {
    getUserByUsername(params);
  }, [params]);
  return (
    <div className="profile-layout">
      <Header />
      {getUser ? (
        <div className="profile-children">
          <div className="profile-container">
            <div className="profile-menu">
              <div className="profile-info">
                <div className="avt">
                  <img
                    src={getUser?.avatar ? getUser?.avatar : avtDefault}
                    alt={getUser?.name}
                  />
                </div>
                <div className="name">
                  <h1>{getUser?.name}</h1>
                  <h3>{getUser?.email}</h3>
                  {user?.username !== getUser?.username ? (
                    <button>Theo dõi</button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate(ROUTES.EDIT_PROFILE_PAGE.path);
                      }}
                    >
                      Sửa thông tin
                    </button>
                  )}
                </div>
              </div>
              <div className="profile-navbar">
                <ul>
                  <li>
                    <Link
                      className={
                        location.pathname.includes("/profile/") &&
                        !!params.username &&
                        ["/favorites", "/following", "follower"].every(
                          (path) => !location.pathname.includes(path)
                        )
                          ? "active"
                          : ""
                      }
                      to={`/profile/${getUser?.username}`}
                    >
                      Bài viết
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname.includes("/profile/") &&
                        location.pathname.includes("/favorites")
                          ? "active"
                          : ""
                      }
                      to={`/profile/${getUser?.username}/favorites`}
                    >
                      Yêu thích
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname.includes("/profile/") &&
                        location.pathname.includes("/following")
                          ? "active"
                          : ""
                      }
                      to={`/profile/${getUser?.username}/following`}
                    >
                      Đang theo dõi
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        location.pathname.includes("/profile/") &&
                        location.pathname.includes("/follower")
                          ? "active"
                          : ""
                      }
                      to={`/profile/${getUser?.username}/follower`}
                    >
                      Người theo dõi
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {React.cloneElement(props.children, { data: getUser })}
          </div>
        </div>
      ) : getUser === "none" ? (
        <div>
          <NotFoundPage />
          <Footer />
        </div>
      ) : undefined}
    </div>
  );
};

export default ProfileLayout;
