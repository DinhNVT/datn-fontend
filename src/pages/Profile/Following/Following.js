import React, { useEffect, useState } from "react";
import "./Following.scss";
import avtDefault from "../../../assets/images/avatar_default.png";
import { apiGetFollowingUser } from "../../../apis/user";

const Following = (props) => {
  const [followings, setFollowings] = useState([]);
  const getFollowersUser = async (id) => {
    try {
      const res = await apiGetFollowingUser(id);
      console.log(res);
      if (res.data.data) {
        setFollowings(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFollowersUser(props.data._id);
  }, [props]);
  return (
    <div className="following-container">
      <div className="following-content">
        {followings.length > 0 &&
          followings.map((following, index) => (
            <div className="following-item">
              <div className="right">
                <img
                  src={
                    following?.following?.avatar
                      ? following?.following?.avatar
                      : avtDefault
                  }
                  alt=""
                />
                <div className="info">
                  <h3 className="name">{following.following.name}</h3>
                  <p className="email">{following.following.email}</p>
                </div>
              </div>
              <button className="btn-following">Theo dõi</button>
            </div>
          ))}
        {followings.length <= 0 && <p>Không có người theo dõi</p>}
      </div>
    </div>
  );
};

export default Following;
