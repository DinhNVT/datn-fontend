import React from "react";
import "./AuthorPostHorizontalSkeleton.scss";

const AuthorPostHorizontalSkeleton = () => {
  return (
    <div className="author-skeleton">
      <div className="title skeleton"></div>
      <div className="title-border skeleton"></div>
      <div className="author-content">
        <div className="author-content-info">
          <div className="left skeleton"></div>
          <div className="right">
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
        <div className="post-author">
          <div className="item-blog-container">
            <div className="item-blog">
              <div className="img-blog skeleton"></div>
              <div className="title-blog">
                <div className="title skeleton"></div>
                <div className="time-text skeleton"></div>
              </div>
            </div>
            <div className="item-blog">
              <div className="img-blog skeleton"></div>
              <div className="title-blog">
                <div className="title skeleton"></div>
                <div className="time-text skeleton"></div>
              </div>
            </div>
            <div className="item-blog">
              <div className="img-blog skeleton"></div>
              <div className="title-blog">
                <div className="title skeleton"></div>
                <div className="time-text skeleton"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPostHorizontalSkeleton;
