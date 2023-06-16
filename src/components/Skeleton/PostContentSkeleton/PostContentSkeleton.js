import React from "react";
import "./PostContentSkeleton.scss";

const PostContentSkeleton = () => {
  return (
    <div className="post-content-skeleton">
      <div className="post-content-header">
        <div className="thumbnail-skeleton skeleton"></div>
        <div className="title-skeleton skeleton"></div>
        <div className="title-skeleton small skeleton"></div>
        <div className="interact">
          <div className="interact-item">
            <div className="interact-item-left skeleton"></div>
            <div className="interact-item-right skeleton"></div>
          </div>
          <div className="interact-item">
            <div className="interact-item-left skeleton"></div>
            <div className="interact-item-right skeleton"></div>
          </div>
          <div className="interact-item">
            <div className="interact-item-left skeleton"></div>
            <div className="interact-item-right skeleton"></div>
          </div>
        </div>
      </div>
      <div className="content-skeleton">
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
        <div className="content-text skeleton"></div>
      </div>
      <div className="title-tag skeleton"></div>
      <div className="item-tag">
        <div className="tag skeleton"></div>
        <div className="tag skeleton"></div>
        <div className="tag skeleton"></div>
        <div className="tag skeleton"></div>
      </div>
      <div className="border-skeleton skeleton"></div>
      <div className="title-share skeleton"></div>
      <div className="input-share skeleton"></div>
    </div>
  );
};

export default PostContentSkeleton;
