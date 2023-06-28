import React, { useEffect, useState } from "react";
import "./Video.scss";
import { Link } from "react-router-dom";
import { apiGetAllVideosYoutube } from "../../apis/videoYoutube";
import Loader from "../../components/Loader/Loader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { truncateTitle } from "../../utils/truncateString";
import VideoYoutubeItemSkeleton from "../../components/Skeleton/VideoYoutubeItemSkeleton/VideoYoutubeItemSkeleton";
import { FiSearch } from "react-icons/fi";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [isFetchVideos, setIsFetchVideos] = useState(true);

  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(0);
  const [isLoadingSeeMore, setIsLoadingSeeMore] = useState(false);

  const getAllVideosYoutube = async (page, keyword) => {
    setVideosLoading(true);
    const query = `limit=${12}&page=${page}&keyword=${keyword}`;
    try {
      const res = await apiGetAllVideosYoutube(query);
      if (res.data.videos.length > 0) {
        setVideos((prevPosts) => [...prevPosts, ...res.data.videos]);
      }
      if (res?.data?.pagination.next) {
        setPage(res?.data?.pagination.next.page);
      } else {
        setPage(0);
      }
      setIsLoadingSeeMore(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchVideos(false);
      setVideosLoading(false);
      setIsLoadingSeeMore(false);
    }
  };

  const handleClickSeeMore = () => {
    setIsLoadingSeeMore(true);
    getAllVideosYoutube(page, keyword);
  };

  useEffect(() => {
    setVideos([]);
    window.scrollTo(0, 0);
    getAllVideosYoutube(1, keyword);
    setIsFetchVideos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeywordChange = (e) => {
    const text = e.target.value;
    setKeyword(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInputConfirm();
    }
  };

  const handleInputConfirm = () => {
    window.scrollTo(0, 0);
    setVideos([]);
    setIsFetchVideos(true);
    getAllVideosYoutube(1, keyword);
  };

  return (
    <div className="video-container">
      <div className="video-content grid-container">
        {isFetchVideos && videosLoading && (
          <div className="list-skeleton">
            <VideoYoutubeItemSkeleton />
            <VideoYoutubeItemSkeleton />
            <VideoYoutubeItemSkeleton />
            <VideoYoutubeItemSkeleton />
            <VideoYoutubeItemSkeleton />
            <VideoYoutubeItemSkeleton />
            <VideoYoutubeItemSkeleton />
          </div>
        )}
        {!isFetchVideos && (
          <div className="input-bar">
            <input
              size="40"
              className="input"
              aria-required="true"
              aria-invalid="true"
              value={keyword}
              onChange={handleKeywordChange}
              onKeyDown={handleKeyDown}
              type="text"
              name="keyword"
              placeholder="Nhập từ khóa"
              required
            />
            <FiSearch onClick={handleInputConfirm} className="icon-search" />
          </div>
        )}
        {videos.length === 0 && !isFetchVideos && (
          <p className="text-not-found">Không có bài video nào </p>
        )}
        {videos.length > 0 && !isFetchVideos && (
          <div className="video-list">
            {videos.map((video, index) => (
              <div key={video._id} className="video-item">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?start=1`}
                  title={video.title}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  className="youtube-video"
                ></iframe>
                <Link
                  target="_blank"
                  to={`https://www.youtube.com/watch?v=${video.videoId}`}
                >
                  <h3 className="title">{truncateTitle(video.title, 100)}</h3>
                </Link>
              </div>
            ))}
          </div>
        )}
        {page > 0 && (
          <div className="see-more">
            <button onClick={handleClickSeeMore} className="btn-see-more">
              {isLoadingSeeMore ? (
                <Loader />
              ) : (
                <div>
                  Xem thêm
                  <MdKeyboardArrowDown size={24} className={"arrow"} />
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
