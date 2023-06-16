import React, { useEffect, useState } from "react";
import "./ProfileLayout.scss";
import Header from "../../components/Header/Header";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import avtDefault from "../../assets/images/avatar_default.png";
import {
  apiFollowUser,
  apiGetUserByUsername,
  apiUnFollowUser,
} from "../../apis/user";
import NotFoundPage from "../../pages/404/NotFoundPage";
import Footer from "../../components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import ROUTES from "../../constants/routes";
import facebookIcon from "../../assets/images/facebook.png";
import youtubeIcon from "../../assets/images/youtube.png";
import instagramIcon from "../../assets/images/instagram.png";
import tiktokIcon from "../../assets/images/tiktok.png";
import { followUserSlice, unFollowUserSlice } from "../../stores/userSlice";
import { errorAlert } from "../../utils/customAlert";

const ProfileLayout = (props) => {
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
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
      console.log(error);
    }
  };

  useEffect(() => {
    getUserByUsername(params);
  }, [params]);

  const { followingIds } = useSelector((state) => state?.user);

  const followUserOnClick = async (userId) => {
    try {
      dispatch(followUserSlice(userId));
      await apiFollowUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const unFollowUserOnClick = async (userId) => {
    try {
      dispatch(unFollowUserSlice(userId));
      await apiUnFollowUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const isFollowed = (userId) => {
    return followingIds.some((followingId) => followingId.following === userId);
  };

  return (
    <div className="profile-layout">
      <Header />
      {getUser ? (
        <div className="profile-children">
          <div className="profile-container">
            <div className="profile-menu">
              <div className="profile-info">
                <div className="left">
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
                      <button
                        className={`btn-following ${
                          isFollowed(getUser?._id) ? "follow" : ""
                        }`}
                        onClick={() => {
                          if (!user) {
                            errorAlert(
                              "Bạn chưa đăng nhập",
                              "Bạn cần phải đăng nhập theo dõi"
                            );
                          } else {
                            isFollowed(getUser?._id)
                              ? unFollowUserOnClick(getUser?._id)
                              : followUserOnClick(getUser?._id);
                          }
                        }}
                      >
                        {isFollowed(getUser?._id) && !!user
                          ? "Đang theo dõi"
                          : "Theo dõi"}
                      </button>
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
                {!!getUser?.social && (
                  <div className="social">
                    {!!getUser?.social?.facebook && (
                      <Link to={getUser?.social?.facebook} target="_blank">
                        <img src={facebookIcon} alt="" />
                      </Link>
                    )}
                    {!!getUser?.social?.instagram && (
                      <Link to={getUser?.social?.instagram} target="_blank">
                        <img src={instagramIcon} alt="" />
                      </Link>
                    )}
                    {!!getUser?.social?.youtube && (
                      <Link to={getUser?.social?.youtube} target="_blank">
                        <img src={youtubeIcon} alt="" />
                      </Link>
                    )}
                    {!!getUser?.social?.tiktok && (
                      <Link to={getUser?.social?.tiktok} target="_blank">
                        <img src={tiktokIcon} alt="" />
                      </Link>
                    )}
                  </div>
                )}
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
