import React from "react";
import "./PostCommentSkeleton.scss";

const PostCommentSkeleton = () => {
  return (
    <div className="post-comment-skeleton">
      <div className="title skeleton"></div>
      <div className="title-border skeleton"></div>
      <div className="label-comment skeleton"></div>
      <div className="input-comment skeleton"></div>
      <div className="button-comment skeleton"></div>
      <div className="base-comment">
        <div className="left skeleton"></div>
        <div className="right">
          <div className="name-time">
            <div className="name skeleton"></div>
            <div className="time skeleton"></div>
          </div>
          <div className="comment-content skeleton"></div>
          <div className="comment-content skeleton"></div>
          <div className="comment-content skeleton"></div>
          <div className="button-base-comment skeleton"></div>
        </div>
        <div></div>
      </div>
      <div className="base-comment">
        <div className="left skeleton"></div>
        <div className="right">
          <div className="name-time">
            <div className="name skeleton"></div>
            <div className="time skeleton"></div>
          </div>
          <div className="comment-content skeleton"></div>
          <div className="comment-content skeleton"></div>
          <div className="comment-content skeleton"></div>
          <div className="button-base-comment skeleton"></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default PostCommentSkeleton;
