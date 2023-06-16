import React, { useEffect, useState } from "react";
import "./Follower.scss";
import avtDefault from "../../../assets/images/avatar_default.png";
import {
  apiFollowUser,
  apiGetFollowerUser,
  apiUnFollowUser,
} from "../../../apis/user";
import { useDispatch, useSelector } from "react-redux";
import { followUserSlice, unFollowUserSlice } from "../../../stores/userSlice";
import { errorAlert } from "../../../utils/customAlert";
import { Link } from "react-router-dom";
import ROUTES from "../../../constants/routes";

const Follower = (props) => {
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const getFollowersUser = async (id) => {
    try {
      const res = await apiGetFollowerUser(id);
      if (res.data.data) {
        setFollowers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFollowersUser(props.data._id);
  }, [props]);

  const { followingIds } = useSelector((state) => state?.user);
  const { user } = useSelector((state) => state?.auth?.login);

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
    <div className="follower-container">
      <div className="follower-content">
        {followers.length > 0 &&
          followers.map((follower, index) => (
            <div className="follower-item">
              <div className="right">
                <Link
                  to={ROUTES.PROFILE_PAGE.path.replace(
                    ":username",
                    follower?.follower?.username
                  )}
                >
                  <img
                    src={
                      follower?.follower?.avatar
                        ? follower?.follower?.avatar
                        : avtDefault
                    }
                    alt=""
                  />
                </Link>
                <Link
                  to={ROUTES.PROFILE_PAGE.path.replace(
                    ":username",
                    follower?.follower?.username
                  )}
                  className="info"
                >
                  <h3 className="name">{follower.follower.name}</h3>
                  <p className="email">{follower.follower.email}</p>
                </Link>
              </div>
              {user && user?._id === follower.follower._id ? null : (
                <button
                  className={`btn-following ${
                    isFollowed(follower.follower._id) ? "follow" : ""
                  }`}
                  onClick={() => {
                    if (!user) {
                      errorAlert(
                        "Bạn chưa đăng nhập",
                        "Bạn cần phải đăng nhập theo dõi"
                      );
                    } else {
                      isFollowed(follower.follower._id)
                        ? unFollowUserOnClick(follower.follower._id)
                        : followUserOnClick(follower.follower._id);
                    }
                  }}
                >
                  {isFollowed(follower.follower._id) && !!user
                    ? "Đang theo dõi"
                    : "Theo dõi"}
                </button>
              )}
            </div>
          ))}
        {followers.length <= 0 && <p>Không có người theo dõi</p>}
      </div>
    </div>
  );
};

export default Follower;
