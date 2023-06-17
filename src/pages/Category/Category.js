import React, { useEffect, useState } from "react";
import "./Category.scss";
import { Link, useParams } from "react-router-dom";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import {
  AiOutlineEye,
  AiOutlineShareAlt,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { BsCheckAll } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";
import avtDefault from "../../assets/images/avatar_default.png";
import { apiGetPostsOption } from "../../apis/post";
import Loader from "../../components/Loader/Loader";
import { MdKeyboardArrowDown } from "react-icons/md";
import { createSummary, truncateTitle } from "../../utils/truncateString";
import { getCreatedAtString } from "../../utils/convertTime";
import ROUTES from "../../constants/routes";
import { apiGetCategoryDetail } from "../../apis/category";
import { errorAlert } from "../../utils/customAlert";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFavoritesSlice,
  removeFromFavoritesSlice,
} from "../../stores/postSlice";
import { apiAddToFavorites, apiDeleteFavoritePost } from "../../apis/user";
import HomePostSkeleton from "../../components/Skeleton/HomePostSkeleton/HomePostSkeleton";
import { capitalizeFirstLetter } from "../../utils/convertString";

const Category = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isFetchPosts, setIsFetchPosts] = useState(true);

  const [page, setPage] = useState(0);
  const [isLoadingSeeMore, setIsLoadingSeeMore] = useState(false);
  const [category, setCategory] = useState(null);

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

  const getAllPostByCategory = async (page, slug) => {
    setPostsLoading(true);
    const query = `limit=${10}&page=${page}&category=${slug}`;
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
    } finally {
      setIsFetchPosts(false);
      setPostsLoading(false);
      setIsLoadingSeeMore(false);
    }
  };

  const handleClickSeeMore = () => {
    setIsLoadingSeeMore(true);
    getAllPostByCategory(page, params.slug);
  };

  const getCategoryDetail = async (slug) => {
    try {
      const res = await apiGetCategoryDetail(slug);
      if (res.data.category) {
        setCategory(res.data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setPosts([]);
    window.scrollTo(0, 0);
    setIsFetchPosts(true);
    if (!!params.slug) {
      getCategoryDetail(params.slug);
      getAllPostByCategory(1, params.slug);
    }
  }, [params.slug]);

  return (
    <div className="category-container">
      <div className="category-content">
        <div className="category-header">
          <h1 className="title">
            Danh mục:{" "}
            <span className="title-hight">
              {!!category ? category.name : "..."}
            </span>
          </h1>
        </div>
        <div className="category-body">
          {isFetchPosts && postsLoading && (
            <>
              <HomePostSkeleton />
              <HomePostSkeleton />
            </>
          )}
          {posts.length > 0 &&
            !isFetchPosts &&
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
                    <div>
                      <Link
                        to={ROUTES.POST_DETAIL_PAGE.path.replace(
                          ":slug",
                          post.slug
                        )}
                        className="title"
                      >
                        <h2>
                          {truncateTitle(capitalizeFirstLetter(post.title), 75)}
                        </h2>
                      </Link>
                      <div className="interact">
                        <div className="interact-item">
                          <RxCountdownTimer className={"icon"} size={22} />{" "}
                          <p>{getCreatedAtString(post.createdAt)}</p>
                        </div>
                        <div className="interact-item">
                          <FaRegComment size={22} className={"icon"} />
                          <p>
                            {window.innerWidth < 1023
                              ? post.comment_count
                              : `${post.comment_count} bình luận`}
                          </p>
                        </div>
                        <div className="interact-item">
                          <AiOutlineEye size={24} className={"icon"} />
                          <p>
                            {window.innerWidth < 1023
                              ? post.view_count
                              : `${post.view_count} lượt xem`}
                          </p>
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
                      {createSummary(
                        post.content,
                        window.innerWidth < 1023 ? 200 : 300
                      )}
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
          {posts.length === 0 && !isFetchPosts && (
            <p className="text-not-found">Không có bài viết nào </p>
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
    </div>
  );
};

export default Category;
