import React, { useEffect, useState } from "react";
import "./Drafts.scss";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RxCountdownTimer } from "react-icons/rx";
import { createSummary, truncateTitle } from "../../../utils/truncateString";
import { getCreatedAtString } from "../../../utils/convertTime";
import { apiDeletePost, apiGetPostsMe } from "../../../apis/post";
import Loader from "../../../components/Loader/Loader";
import { deleteAlert } from "../../../utils/customAlert";

const Drafts = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPost] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoadingSeeMore, setIsLoadingSeeMore] = useState(false);

  const getAllPostMe = async (page) => {
    const query = `limit=${10}&status=draft&page=${page}`;
    try {
      const res = await apiGetPostsMe(query);
      if (res.data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      }
      if (res?.data?.pagination.next) {
        setPage(res?.data?.pagination.next.page);
      } else {
        setPage(0);
      }
      setTotalPost(res.data.total);
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

  const handleDelete = (id) => {
    const confirmDelete = () => {
      return apiDeletePost(id);
    };

    const deletePostInState = () => {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      setTotalPost((pre) => pre - 1);
    };

    deleteAlert(
      "Xóa bài viết",
      "Sau khi bạn xóa thì không thể hoàn tác",
      confirmDelete,
      deletePostInState
    );
  };
  return (
    <div className="me-drafts-container">
      <div className="me-drafts-content">
        {totalPosts > 0 ? (
          <p className="total-post">{`Có ${totalPosts} bản nháp`}</p>
        ) : (
          "Không có bản nháp nào"
        )}
        {posts.length > 0 &&
          posts.map((post, index) => (
            <div key={post._id} className="blog-item">
              <div className="blog-item-content">
                <img src={post?.thumbnail_url} alt={post?.title} />
                <div className="blog-post-info">
                  <h2>{truncateTitle(post.title, 85)}</h2>
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
                    <Link
                      to={`/me/post/edit/${post._id}`}
                      className=" btn-edit"
                    >
                      Chỉnh sửa
                      <FiEdit size={24} className={"arrow"} />
                    </Link>
                    <Link
                      onClick={() => {
                        handleDelete(post._id);
                      }}
                      className="btn-delete"
                    >
                      Xóa
                      <AiOutlineDelete size={24} className={"arrow"} />
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
    </div>
  );
};

export default Drafts;
