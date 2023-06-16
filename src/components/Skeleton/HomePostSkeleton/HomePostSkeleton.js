import React from "react";
import './HomePostSkeleton.scss'

const HomePostSkeleton = () => {
  return (
    <div className="for-you-item-skeleton">
      <div className="for-you-item-content">
        <div className="img-skeleton skeleton"></div>
        <div className="for-you-post-info">
          <div className="title skeleton"></div>
          <div className="title-last skeleton"></div>
          <div className="interact">
            <div className="interact-item">
              <div className="left skeleton"></div>
              <div className="right skeleton"></div>
            </div>
            <div className="interact-item">
              <div className="left skeleton"></div>
              <div className="right skeleton"></div>
            </div>
            <div className="interact-item">
              <div className="left skeleton"></div>
              <div className="right skeleton"></div>
            </div>
          </div>
          <div className="author">
            <div className="avt skeleton"></div>
            <div className="name skeleton"></div>
          </div>
          <div className="summary">
            <div className="text skeleton"></div>
            <div className="text skeleton"></div>
            <div className="text skeleton"></div>
            <div className="text skeleton"></div>
          </div>
          <div className="tags">
            <div className="item-tag skeleton"></div>
            <div className="item-tag skeleton"></div>
            <div className="item-tag skeleton"></div>
          </div>
          <div className="read-more-btn">
            <div className="btn-skeleton skeleton"></div>
            <div className="btn-right">
              <div className="btn-right-skeleton skeleton"></div>
              <div className="btn-right-skeleton skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePostSkeleton;
