import React from "react";
import "./AuthorPostVerticalSkeleton.scss";

const AuthorPostVerticalSkeleton = () => {
  return (
    <div className="author-post-vertical-skeleton">
      <div className="title skeleton"></div>
      <div className="border skeleton"></div>
      <div className="author-content-info">
        <div className="avt skeleton"></div>
        <div className="name skeleton"></div>
        <div className="bio skeleton"></div>
        <div className="social">
          <div className="icon skeleton"></div>
          <div className="icon skeleton"></div>
          <div className="icon skeleton"></div>
          <div className="icon skeleton"></div>
        </div>
        <div className="btn skeleton"></div>
      </div>
    </div>
  );
};

export default AuthorPostVerticalSkeleton;
