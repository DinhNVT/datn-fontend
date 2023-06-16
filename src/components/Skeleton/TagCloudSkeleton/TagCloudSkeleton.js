import React from "react";
import "./TagCloudSkeleton.scss";

const TagCloudSkeleton = () => {
  return (
    <div className="tag-cloud-skeleton">
      <div className="title skeleton"></div>
      <div className="border skeleton"></div>
      <div className="tag-container">
        <div className="item-tag skeleton"></div>
        <div className="item-tag skeleton"></div>
        <div className="item-tag skeleton"></div>
        <div className="item-tag skeleton"></div>
        <div className="item-tag skeleton"></div>
        <div className="item-tag skeleton"></div>
      </div>
    </div>
  );
};

export default TagCloudSkeleton;
