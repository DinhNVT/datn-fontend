import React, { useEffect, useState } from "react";
import "./Favorites.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  apiAddToFavorites,
  apiDeleteFavoritePost,
  apiGetFavoriteUser,
} from "../../../apis/user";
import { Link } from "react-router-dom";
import { createSummary, truncateTitle } from "../../../utils/truncateString";
import { getCreatedAtString } from "../../../utils/convertTime";
import { FaRegComment } from "react-icons/fa";
import { BsCheckAll, BsArrowRight } from "react-icons/bs";
import {
  AiOutlineEye,
  AiOutlineShareAlt,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { RxCountdownTimer } from "react-icons/rx";
import {
  addToFavoritesSlice,
  removeFromFavoritesSlice,
} from "../../../stores/postSlice";
import ROUTES from "../../../constants/routes";
import { errorAlert } from "../../../utils/customAlert";
import avtDefault from "../../../assets/images/avatar_default.png";
import ProfilePostSkeleton from "../../../components/Skeleton/ProfilePostSkeleton/ProfilePostSkeleton";

const Favorites = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth?.login);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isFetchPosts, setIsFetchPosts] = useState(true);

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
    setPostsLoading(true);
    try {
      const res = await apiGetFavoriteUser(id);
      if (res.data.posts) {
        setPosts(res.data.posts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchPosts(false);
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    getFavoriteUser(props.data._id);
  }, [props]);

  const { favoritePosts } = useSelector((state) => state?.post);

  const addToFavorites = async (postId) => {
    try {
      dispatch(addToFavoritesSlice(postId));
      await apiAddToFavorites({ postId: postId });
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromFavorites = async (postId) => {
    try {
      dispatch(removeFromFavoritesSlice(postId));
      await apiDeleteFavoritePost(postId);
    } catch (error) {
      console.log(error);
    }
  };

  const isPostLiked = (postId) => {
    return favoritePosts.some((favoritePost) => favoritePost.postId === postId);
  };
  return (
    <div>
      {user?.username !== props.data.username ? (
        "Tài khoản này là riêng tư"
      ) : (
        <div className="favorite-container">
          <div className="favorite-content">
            {isFetchPosts && postsLoading && (
              <>
                <ProfilePostSkeleton />
                <ProfilePostSkeleton />
              </>
            )}
            {posts.length === 0 && !isFetchPosts && (
              <p className="text-not-found">Không có bài viết yêu thích nào</p>
            )}
            {posts.length > 0 &&
              !isFetchPosts &&
              posts.map((post, index) => (
                <div key={post._id} className="blog-item">
                  <div className="blog-item-content">
                    <Link target="_blank" to={`/post/${post.slug}`}>
                      <img src={post?.thumbnail_url} alt={post?.title} />
                    </Link>
                    <div className="blog-post-info">
                      <div>
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
                        <div className="info-post">
                          <div className="author">
                            <Link
                              to={ROUTES.PROFILE_PAGE.path.replace(
                                ":username",
                                post?.userId?.username
                              )}
                            >
                              <img
                                src={
                                  !!post?.userId?.avatar
                                    ? post?.userId?.avatar
                                    : avtDefault
                                }
                                alt={post?.userId?.name}
                                className="avt"
                              />
                              <h4>{post?.userId?.name}</h4>
                            </Link>
                          </div>
                        </div>
                        {createSummary(post.content, 300)}
                        <div className="tags">
                          {post.tags.length > 0 &&
                            post.tags.map((tag, index) => (
                              <Link
                                to={`${ROUTES.POST_SEARCH_PAGE.path}?s=${tag.name}`}
                                key={tag._id}
                                className={`item-tag tag-${index + 1}`}
                              >
                                <span># </span>
                                {tag.name}
                              </Link>
                            ))}
                        </div>
                      </div>
                      <div className="read-more-btn">
                        <Link
                          to={ROUTES.POST_DETAIL_PAGE.path.replace(
                            ":slug",
                            post.slug
                          )}
                        >
                          Đọc thêm
                          <BsArrowRight size={24} className={"arrow"} />
                        </Link>
                        <div>
                          <button
                            onClick={() => {
                              if (!user) {
                                errorAlert(
                                  "Bạn chưa đăng nhập",
                                  "Bạn cần phải đăng nhập để thêm bài viết vào yêu thích"
                                );
                              } else {
                                isPostLiked(post._id)
                                  ? removeFromFavorites(post._id)
                                  : addToFavorites(post._id);
                              }
                            }}
                          >
                            {isPostLiked(post._id) && !!user ? (
                              <AiFillHeart
                                size={32}
                                className={"arrow liked"}
                              />
                            ) : (
                              <AiOutlineHeart size={32} className={"arrow"} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              handleCopyClick(post.slug);
                            }}
                            type="button"
                          >
                            {copied && copySlug === post.slug ? (
                              <p>
                                <BsCheckAll
                                  size={32}
                                  className={"arrow check-all"}
                                />
                              </p>
                            ) : (
                              <p>
                                <AiOutlineShareAlt
                                  size={32}
                                  className={"arrow"}
                                />
                              </p>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
