import React, { useEffect, useState } from "react";
import "./Following.scss";
import avtDefault from "../../../assets/images/avatar_default.png";
import {
  apiFollowUser,
  apiGetFollowingUser,
  apiUnFollowUser,
} from "../../../apis/user";
import { useDispatch, useSelector } from "react-redux";
import { followUserSlice, unFollowUserSlice } from "../../../stores/userSlice";
import { errorAlert } from "../../../utils/customAlert";
import { Link } from "react-router-dom";
import ROUTES from "../../../constants/routes";
import FollowListSkeleton from "../../../components/Skeleton/FollowListSkeleton/FollowListSkeleton";

const Following = (props) => {
  const dispatch = useDispatch();
  const [followings, setFollowings] = useState([]);
  const [followingsLoading, setFollowingsLoading] = useState(false);
  const [isFetchFollowings, setIsFetchFollowings] = useState(true);

  const getFollowersUser = async (id) => {
    setFollowingsLoading(true);
    try {
      const res = await apiGetFollowingUser(id);
      if (res.data.data) {
        setFollowings(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFollowingsLoading(false);
      setIsFetchFollowings(false);
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
    <div className="following-container">
      <div className="following-content">
        {isFetchFollowings && followingsLoading && (
          <>
            <FollowListSkeleton />
            <FollowListSkeleton />
          </>
        )}
        {followings.length <= 0 && !isFetchFollowings && (
          <p>Không có người theo dõi</p>
        )}
        {followings.length > 0 &&
          !isFetchFollowings &&
          followings.map((following, index) => (
            <div className="following-item">
              <div className="right">
                <Link
                  to={ROUTES.PROFILE_PAGE.path.replace(
                    ":username",
                    following?.following?.username
                  )}
                >
                  <img
                    src={
                      following?.following?.avatar
                        ? following?.following?.avatar
                        : avtDefault
                    }
                    alt=""
                  />
                </Link>
                <Link
                  to={ROUTES.PROFILE_PAGE.path.replace(
                    ":username",
                    following?.following?.username
                  )}
                  className="info"
                >
                  <h3 className="name">{following.following.name}</h3>
                  <p className="email">{following.following.email}</p>
                </Link>
              </div>
              {user && user?._id === following.following._id ? null : (
                <button
                  className={`btn-following ${
                    isFollowed(following.following._id) ? "follow" : ""
                  }`}
                  onClick={() => {
                    if (!user) {
                      errorAlert(
                        "Bạn chưa đăng nhập",
                        "Bạn cần phải đăng nhập theo dõi"
                      );
                    } else {
                      isFollowed(following.following._id)
                        ? unFollowUserOnClick(following.following._id)
                        : followUserOnClick(following.following._id);
                    }
                  }}
                >
                  {isFollowed(following.following._id) && !!user
                    ? "Đang theo dõi"
                    : "Theo dõi"}
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Following;
