import React from "react";
import "./FollowListSkeleton.scss";

const FollowListSkeleton = () => {
  return (
    <div className="follow-item-skeleton">
      <div className="right">
        <div className="img-avt skeleton"></div>
        <div className="info">
          <div className="name skeleton"></div>
          <div className="email skeleton"></div>
        </div>
      </div>
      <div className="btn-follow skeleton"></div>
    </div>
  );
};

export default FollowListSkeleton;
