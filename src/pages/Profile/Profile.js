import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { BsCheckAll, BsArrowRight } from "react-icons/bs";
import {
  AiOutlineEye,
  AiOutlineShareAlt,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { RxCountdownTimer } from "react-icons/rx";
import { MdKeyboardArrowDown } from "react-icons/md";
import { apiGetPostsOption } from "../../apis/post";
import { createSummary, truncateTitle } from "../../utils/truncateString";
import { getCreatedAtString } from "../../utils/convertTime";
import Loader from "../../components/Loader/Loader";
import ROUTES from "../../constants/routes";
import { errorAlert } from "../../utils/customAlert";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavoritesSlice,
  removeFromFavoritesSlice,
} from "../../stores/postSlice";
import { apiAddToFavorites, apiDeleteFavoritePost } from "../../apis/user";

const Profile = (props) => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
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

  const getAllPost = async (page, userName) => {
    const query = `limit=${10}&userAllPost=${userName}&page=${page}`;
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
      console.log(error);
      setIsLoadingSeeMore(false);
    }
  };

  const handleClickSeeMore = () => {
    setIsLoadingSeeMore(true);
    getAllPost(page, props.data.username);
  };

  useEffect(() => {
    setPosts([]);
    getAllPost(1, props.data.username);
  }, [props.data.username]);

  const { user } = useSelector((state) => state?.auth?.login);
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
    <div className="profile-container">
      <div className="profile-content">
        {posts.length > 0 &&
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
                    {createSummary(post.content, 400)}
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
                          <AiFillHeart size={32} className={"arrow liked"} />
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
                            <AiOutlineShareAlt size={32} className={"arrow"} />
                          </p>
                        )}
                      </button>
                    </div>
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

export default Profile;
