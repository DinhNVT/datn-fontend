import React, { useEffect, useState } from "react";
import "./Published.scss";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { BsCheckAll } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  AiOutlineEye,
  AiOutlineShareAlt,
  AiOutlineDelete,
} from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { RxCountdownTimer } from "react-icons/rx";
import { createSummary, truncateTitle } from "../../../utils/truncateString";
import { getCreatedAtString } from "../../../utils/convertTime";
import { apiDeletePost, apiGetPostsMe } from "../../../apis/post";
import Loader from "../../../components/Loader/Loader";
import { deleteAlert } from "../../../utils/customAlert";

const Published = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPost] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoadingSeeMore, setIsLoadingSeeMore] = useState(false);

  const [copied, setCopied] = useState(false);
  const [copySlug, setCopySlug] = useState("");
  const handleCopyClick = (slug) => {
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${slug}`)
      .then(() => {
        setCopied(true);
        setCopySlug(slug);
        setTimeout(() => {
          setCopied(false);
          setCopySlug("");
        }, 5000);
      });
  };

  const getAllPostMe = async (page) => {
    const query = `limit=${10}&status=published&page=${page}`;
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
    <div className="me-published-container">
      <div className="me-published-content">
        {totalPosts > 0 ? (
          <p className="total-post">{`Có ${totalPosts} bài viết công khai`}</p>
        ) : (
          "Không có bài viết nào"
        )}
        {posts.length > 0 &&
          posts.map((post, index) => (
            <div key={post._id} className="blog-item">
              <div className="blog-item-content">
                <Link target="_blank" to={`/post/${post.slug}`}>
                  <img src={post?.thumbnail_url} alt={post?.title} />
                </Link>
                <div className="blog-post-info">
                  <Link
                    target="_blank"
                    to={`/post/${post.slug}`}
                    className="title"
                  >
                    <h2>{truncateTitle(post.title, 85)}</h2>
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
                      onClick={() => {
                        handleCopyClick(post.slug);
                      }}
                      className="btn-share"
                    >
                      {copied && copySlug === post.slug ? (
                        <p>
                          Copied
                          <BsCheckAll size={24} className={"arrow"} />
                        </p>
                      ) : (
                        <p>
                          Chia sẻ
                          <AiOutlineShareAlt size={24} className={"arrow"} />
                        </p>
                      )}
                    </Link>
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

export default Published;
