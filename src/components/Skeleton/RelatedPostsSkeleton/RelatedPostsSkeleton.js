import React from "react";
import "./RelatedPostsSkeleton.scss";

const RelatedPostsSkeleton = () => {
  return (
    <div className="post-comment-skeleton">
      <div className="title skeleton"></div>
      <div className="title-border skeleton"></div>
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
        <div className="item-blog">
          <div className="img-blog skeleton"></div>
          <div className="title-blog">
            <div className="title skeleton"></div>
            <div className="time-text skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedPostsSkeleton;
