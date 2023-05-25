import React, { useEffect, useState } from "react";
import "./Search.scss";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import avtDefault from "../../assets/images/avatar_default.png";
import { apiGetPostsOption } from "../../apis/post";
import Loader from "../../components/Loader/Loader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { createSummary, truncateTitle } from "../../utils/truncateString";
import { getCreatedAtString } from "../../utils/convertTime";
import ROUTES from "../../constants/routes";
import { errorAlert } from "../../utils/customAlert";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoadingSeeMore, setIsLoadingSeeMore] = useState(false);

  const getAllPostMe = async (page, keyword) => {
    const query = `limit=${10}&page=${page}&search=${keyword}`;
    try {
      const res = await apiGetPostsOption(query);
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
    getAllPostMe(page, keyword);
  };

  const handleKeywordChange = (e) => {
    const fullName = e.target.value;
    setKeyword(fullName);
    if (fullName.length > 1000) {
      setErrorInput("Nhập từ khóa không hợp lệ");
    } else {
      setErrorInput("");
    }
  };

  const handleInputConfirm = () => {
    if (!keyword) {
      errorAlert(
        "Chưa nhập từ khóa",
        "Vui lòng nhập từ khóa để tiếp tục tìm kiếm"
      );
    } else {
      setPosts([]);
      navigate(`${ROUTES.POST_SEARCH_PAGE.path}?s=${keyword}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInputConfirm();
    }
  };

  useEffect(() => {
    setPosts([]);
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("s");
    if (!!keyword) {
      getAllPostMe(1, keyword);
      setKeyword(keyword);
    }
  }, [location]);

  return (
    <div className="search-container">
      <div className="search-content">
        <div className="search-header">
          <h1 className="title">
            Kết quả tìm kiếm:{" "}
            <span className="title-hight">
              {`"${
                !!new URLSearchParams(location.search).get("s")
                  ? new URLSearchParams(location.search).get("s")
                  : ""
              }"`}
            </span>
          </h1>
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

          {!!errorInput && (
            <span className="error-text" aria-hidden="true">
              {errorInput}
            </span>
          )}
        </div>
        <div className="search-body">
          {posts.length > 0 &&
            posts.map((post, index) => (
              <div key={post._id} className="for-you-item">
                <div className="for-you-item-content">
                  <Link
                    to={ROUTES.POST_DETAIL_PAGE.path.replace(
                      ":slug",
                      post.slug
                    )}
                  >
                    <img src={post.thumbnail_url} alt={post?.title} />
                  </Link>
                  <div className="for-you-post-info">
                    <Link className="title">
                      <h2>{truncateTitle(post.title, 75)}</h2>
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
                              !!post.userId.avatar
                                ? post.userId.avatar
                                : avtDefault
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
          {posts.length === 0 && <p>Không có bài viết nào </p>}
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
    </div>
  );
};

export default Search;
