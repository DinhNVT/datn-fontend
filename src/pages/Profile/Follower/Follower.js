import React, { useEffect, useState } from "react";
import "./Follower.scss";
import avtDefault from "../../../assets/images/avatar_default.png";
import { apiGetFollowerUser } from "../../../apis/user";

const Follower = (props) => {
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
  return (
    <div className="follower-container">
      <div className="follower-content">
        {followers.length > 0 &&
          followers.map((follower, index) => (
            <div className="follower-item">
              <div className="right">
                <img
                  src={
                    follower?.follower?.avatar
                      ? follower?.follower?.avatar
                      : avtDefault
                  }
                  alt=""
                />
                <div className="info">
                  <h3 className="name">{follower.follower.name}</h3>
                  <p className="email">{follower.follower.email}</p>
                </div>
              </div>
              <button className="btn-follower">Theo dõi</button>
            </div>
          ))}
        {followers.length <= 0 && <p>Không có người theo dõi</p>}
      </div>
    </div>
  );
};

export default Follower;
