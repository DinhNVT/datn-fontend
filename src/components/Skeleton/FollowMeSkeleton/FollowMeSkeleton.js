import React from "react";
import "./FollowMeSkeleton.scss";

const FollowMeSkeleton = () => {
  return (
    <div className="follow-me-skeleton">
      <div className="title skeleton"></div>
      <div className="border skeleton"></div>
      <div className="follow-container">
        <div className="item-follow">
          <div className="img skeleton"></div>
          <div className="text skeleton"></div>
        </div>
        <div className="item-follow">
          <div className="img skeleton"></div>
          <div className="text skeleton"></div>
        </div>
        <div className="item-follow">
          <div className="img skeleton"></div>
          <div className="text skeleton"></div>
        </div>
        <div className="item-follow">
          <div className="img skeleton"></div>
          <div className="text skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default FollowMeSkeleton;
