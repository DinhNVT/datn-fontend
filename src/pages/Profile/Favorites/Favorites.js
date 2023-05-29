import React, { useEffect, useState } from "react";
import "./Favorites.scss";
import { useSelector } from "react-redux";
import { apiGetFavoriteUser } from "../../../apis/user";
import { Link } from "react-router-dom";
import { createSummary, truncateTitle } from "../../../utils/truncateString";
import { getCreatedAtString } from "../../../utils/convertTime";
import { FaRegComment } from "react-icons/fa";
import { BsCheckAll, BsArrowRight } from "react-icons/bs";
import {
  AiOutlineEye,
  AiOutlineShareAlt,
  AiOutlineHeart,
} from "react-icons/ai";
import { RxCountdownTimer } from "react-icons/rx";

const Favorites = (props) => {
  const { user } = useSelector((state) => state?.auth?.login);
  const [posts, setPosts] = useState([]);

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

  const getFavoriteUser = async (id) => {
    try {
      const res = await apiGetFavoriteUser(id);
      if (res.data.posts) {
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.log(error?.res?.data?.message);
    }
  };

  useEffect(() => {
    getFavoriteUser(props.data._id);
  }, [props]);
  return (
    <div>
      {user?.username !== props.data.username ? (
        "Tài khoản này là riêng tư"
      ) : (
        <div className="favorite-container">
          <div className="favorite-content">
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
                              <AiOutlineShareAlt
                                size={24}
                                className={"arrow"}
                              />
                            </p>
                          )}
                        </Link>
                        <Link
                          to={`/me/post/edit/${post._id}`}
                          className=" btn-edit"
                        >
                          Yêu thích
                          <AiOutlineHeart size={24} className={"arrow"} />
                        </Link>
                        <Link target="_blank" to={`/post/${post.slug}`}>
                          Đọc thêm
                          <BsArrowRight size={24} className={"arrow"} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {posts.length <= 0 && <p>Không có bài viết yêu thích nào</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
