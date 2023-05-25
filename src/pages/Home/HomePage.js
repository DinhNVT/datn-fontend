import { Link } from "react-router-dom";
import "./HomePage.scss";
import React, { useEffect, useState } from "react";
import avtDefault from "../../assets/images/avatar_default.png";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import ROUTES from "../../constants/routes";
import { apiGetAllPosts } from "../../apis/post";
import { createSummary, truncateTitle } from "../../utils/truncateString";
import { getCreatedAtString } from "../../utils/convertTime";
import Loader from "../../components/Loader/Loader";
import { MdKeyboardArrowDown } from "react-icons/md";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoadingSeeMore, setIsLoadingSeeMore] = useState(false);

  const getAllPostMe = async (page) => {
    const query = `limit=${10}&page=${page}`;
    try {
      const res = await apiGetAllPosts(query);
      if (res.data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      }
      if (res?.data?.pagination.next) {
        setPage(res?.data?.pagination.next.page);
      } else {
        setPage(0);
      }
      setIsLoadingSeeMore(false);
    } catch (error) {
      console.log(error.message);
      setIsLoadingSeeMore(false);
    }
  };

  const handleClickSeeMore = () => {
    setIsLoadingSeeMore(true);
    getAllPostMe(page);
  };

  useEffect(() => {
    getAllPostMe(1);
  }, []);

  return (
    <div className="for-you-container">
      {posts.length > 0 &&
        posts.map((post, index) => (
          <div key={post._id} className="for-you-item">
            <div className="for-you-item-content">
              <Link
                to={ROUTES.POST_DETAIL_PAGE.path.replace(":slug", post.slug)}
              >
                <img src={post.thumbnail_url} alt={post?.title} />
              </Link>
              <div className="for-you-post-info">
                <Link
                  to={ROUTES.POST_DETAIL_PAGE.path.replace(":slug", post.slug)}
                  className="title"
                >
                  <h2>{truncateTitle(post.title, 65)}</h2>
                </Link>
                <div className="interact">
                  <div className="interact-item">
                    <RxCountdownTimer className={"icon"} size={22} />{" "}
                    <p>{getCreatedAtString(post.createdAt)}</p>
                  </div>
                  <div className="interact-item">
                    <FaRegComment className={"icon"} size={22} />{" "}
                    <p>{post.comment_count} bình luận</p>
                  </div>
                  <div className="interact-item">
                    <AiOutlineEye className={"icon"} size={24} />{" "}
                    <p>{post.view_count} lượt xem</p>
                  </div>
                </div>
                <div className="info-post">
                  <div className="author">
                    <Link>
                      <img
                        src={
                          !!post.userId.avatar ? post.userId.avatar : avtDefault
                        }
                        alt={post.userId.name}
                        className="avt"
                      />
                      <h4>{post.userId.name}</h4>
                    </Link>
                  </div>
                </div>
                {createSummary(post.content, 300)}
                <div className="tags">
                  {post.tags.length > 0 &&
                    post.tags.map((tag, index) => (
                      <Link
                        key={tag._id}
                        className={`item-tag tag-${index + 1}`}
                      >
                        <span># </span>
                        {tag.name}
                      </Link>
                    ))}
                </div>
                <div className="read-more-btn">
                  <Link>
                    Đọc thêm
                    <BsArrowRight size={24} className={"arrow"} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

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
  );
};

export default HomePage;
