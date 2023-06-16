import React from "react";
import './WritePostSkeleton.scss'

const WritePostSkeleton = () => {
  return (
    <div className="write-post-content-skeleton grid-container">
      <div className="btn-post-group">
        <div className="btn-item-post skeleton"></div>
        <div className="btn-item-post skeleton"></div>
      </div>
      <div className="input-container">
        <div className="label-skeleton skeleton"></div>
        <div className="input-skeleton skeleton"></div>
      </div>
      <div className="input-container">
        <div className="label-skeleton skeleton"></div>
        <div className="input-skeleton skeleton"></div>
      </div>
      <div className="input-container">
        <div className="label-skeleton skeleton"></div>
        <div className="input-skeleton skeleton"></div>
      </div>
      <div className="input-image-container skeleton"></div>
      <div className="ckeditor-skeleton skeleton"></div>
    </div>
  );
};

export default WritePostSkeleton;
