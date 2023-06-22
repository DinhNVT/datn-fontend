import React from "react";
import "./VideoYoutubeItemSkeleton.scss";

const VideoYoutubeItemSkeleton = () => {
  return (
    <div className="video-item-skeleton">
      <div className="video skeleton"></div>
      <div>
        <div className="title skeleton"></div>
        <div className="title skeleton"></div>
      </div>
    </div>
  );
};

export default VideoYoutubeItemSkeleton;
