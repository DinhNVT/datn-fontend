import React, { useCallback, useEffect, useRef, useState } from "react";
import "./PostDetail.scss";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import {
  apiCreatePostComments,
  apiCreateReportPostComments,
  apiDeletePostComments,
  apiGetDetailPost,
  apiGetMostPopularTags,
  apiGetMostViewedPosts,
  apiGetPostComments,
  apiGetPostsOption,
  apiGetRelatedPosts,
  apiUpdatePostComments,
} from "../../apis/post";
import { getCreatedAtString } from "../../utils/convertTime";
import avtDefault from "../../assets/images/avatar_default.png";
import facebookIcon from "../../assets/images/facebook.png";
import youtubeIcon from "../../assets/images/youtube.png";
import instagramIcon from "../../assets/images/instagram.png";
import tiktokIcon from "../../assets/images/tiktok.png";
import { useDispatch, useSelector } from "react-redux";
import { confirmAlert, deleteAlert, errorAlert } from "../../utils/customAlert";
import Loader from "../../components/Loader/Loader";
import { truncateTitle } from "../../utils/truncateString";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import {
  addToFavoritesSlice,
  removeFromFavoritesSlice,
} from "../../stores/postSlice";
import {
  apiAddToFavorites,
  apiDeleteFavoritePost,
  apiFollowUser,
  apiUnFollowUser,
} from "../../apis/user";
import { capitalizeFirstLetter } from "../../utils/convertString";
import { followUserSlice, unFollowUserSlice } from "../../stores/userSlice";
import ROUTES from "../../constants/routes";
import PostContentSkeleton from "../../components/Skeleton/PostContentSkeleton/PostContentSkeleton";
import AuthorPostHorizontalSkeleton from "../../components/Skeleton/AuthorPostHorizontalSkeleton/AuthorPostHorizontalSkeleton";
import PostCommentSkeleton from "../../components/Skeleton/PostCommentSkeleton/PostCommentSkeleton";
import RelatedPostsSkeleton from "../../components/Skeleton/RelatedPostsSkeleton/RelatedPostsSkeleton";
import PostMostSkeleton from "../../components/Skeleton/PostMostSkeleton/PostMostSkeleton";
import TagCloudSkeleton from "../../components/Skeleton/TagCloudSkeleton/TagCloudSkeleton";
import FollowMeSkeleton from "../../components/Skeleton/FollowMeSkeleton/FollowMeSkeleton";
import AuthorPostVerticalSkeleton from "../../components/Skeleton/AuthorPostVerticalSkeleton/AuthorPostVerticalSkeleton";

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [isFetchPost, setIsFetchPost] = useState(true);

  const [postComments, setPostComments] = useState(null);
  const [postCommentsLoading, setPostCommentsLoading] = useState(false);
  const [isFetchPostComments, setIsFetchPostComments] = useState(true);

  const [postsUserNewest, setPostsUserNewest] = useState(null);
  const [replyInputVisible, setReplyInputVisible] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [subCommentId, setSubCommentId] = useState("");
  const [subCommentInput, setSubCommentInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [isLoadingEditBaseComment, setIsLoadingEditBaseComment] =
    useState(false);
  const [isLoadingSubComment, setIsLoadingSubComment] = useState(false);
  const inputRef = useRef(null);
  const { user } = useSelector((state) => state?.auth?.login);

  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {
    const text = document.getElementById("post-share-link").innerText;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    });
  };

  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownBaseId, setShowDropdownBaseId] = useState("");
  const [showDropdownSubId, setShowDropdownSubId] = useState("");
  const [isBaseEdit, setIsBaseEdit] = useState(false);
  const [isSubEdit, setIsSubEdit] = useState(false);

  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedPostsLoading, setRelatedPostsLoading] = useState(false);
  const [isFetchRelatedPosts, setIsFetchRelatedPosts] = useState(true);

  const [popularTags, setPopularTags] = useState([]);
  const [popularTagsLoading, setPopularTagsLoading] = useState(false);
  const [isFetchPopularTags, setIsFetchPopularTags] = useState(true);

  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [mostViewedPostsLoading, setMostViewedPostsLoading] = useState(false);
  const [isFetchMostViewedPosts, setIsFetchMostViewedPosts] = useState(true);

  const [visibleComments, setVisibleComments] = useState(5);
  const numberCommentVisible = 5;
  const handleViewMoreComments = () => {
    setVisibleComments(postComments.length);
  };

  const handleHideLessComments = () => {
    setVisibleComments(numberCommentVisible);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowDropdownBaseId("");
        setShowDropdownSubId("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getPostComment = async (postId) => {
    setPostCommentsLoading(true);
    try {
      const res = await apiGetPostComments(postId);
      if (res.data.result) {
        setPostComments(res.data.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPostCommentsLoading(false);
      setIsFetchPostComments(false);
    }
  };

  const getPostOption = (userId) => {
    const query = `limit=3&userNewest=${userId}`;
    apiGetPostsOption(query)
      .then((res) => {
        if (res.data.posts) {
          setPostsUserNewest(res.data.posts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRelatedPosts = async (postId) => {
    setRelatedPostsLoading(true);
    const query = `limit=4&postId=${postId}`;
    try {
      const res = await apiGetRelatedPosts(query);
      if (res.data.status === "success") {
        setRelatedPosts(res.data.posts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchRelatedPosts(false);
      setRelatedPostsLoading(false);
    }
  };

  const getMostPopularTags = async () => {
    setPopularTagsLoading(true);
    try {
      const res = await apiGetMostPopularTags(`limit=${6}`);
      setPopularTags(res.data.tags);
    } catch (error) {
      console.log(error);
    } finally {
      setPopularTagsLoading(false);
      setIsFetchPopularTags(false);
    }
  };

  const getMostViewedPosts = async () => {
    setMostViewedPostsLoading(true);
    try {
      const res = await apiGetMostViewedPosts(`limit=${4}`);
      setMostViewedPosts(res.data.posts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchMostViewedPosts(false);
      setMostViewedPostsLoading(false);
    }
  };

  const getPostDetail = useCallback(async () => {
    setPostLoading(true);
    window.scrollTo(0, 0);
    try {
      const res = await apiGetDetailPost(slug);
      if (!res.data.result) {
        console.log("error");
      } else {
        setPost(res.data.result);
        getPostComment(res.data.result?._id);
        getRelatedPosts(res.data.result?._id);
        getPostOption(res.data.result?.userId?._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPostLoading(false);
      setIsFetchPost(false);
      setPostCommentsLoading(false);
      setIsFetchPostComments(false);
      setIsFetchRelatedPosts(false);
      setRelatedPostsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    setPost(null);
    setIsFetchPost(true);
    setIsFetchPostComments(true);
    setIsFetchRelatedPosts(true);
    getPostDetail();
    getMostPopularTags();
    getMostViewedPosts();
  }, [slug, getPostDetail]);

  useEffect(() => {
    if (replyInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyInputVisible]);

  const handleCreateSubComment = (baseId) => {
    if (!user) {
      errorAlert("Chưa đăng nhập", "Bạn cần đăng nhập để trả lời bình luận");
    } else {
      setReplyInputVisible(true);
      setCommentId(baseId);
    }
    if (!subCommentInput || baseId !== commentId) {
      setIsBaseEdit(false);
      setIsSubEdit(false);
      setSubCommentId("");
      setSubCommentInput("");
    } else if (replyInputVisible && !!commentId) {
      setIsLoadingSubComment(true);
      apiCreatePostComments("sub", {
        baseId: baseId,
        comment: subCommentInput,
      })
        .then((res) => {
          if (res.data.result) {
            setReplyInputVisible(false);
            setCommentId("");
            setSubCommentInput("");
            getPostComment(post._id);
            setIsLoadingSubComment(false);
          } else {
            errorAlert("Lỗi", "Xin vui lòng thử lại sau");
            setIsLoadingSubComment(false);
          }
        })
        .catch(() => {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingSubComment(false);
        });
    }
  };

  const handleCreateComment = () => {
    setReplyInputVisible(false);
    setCommentId("");
    if (!user) {
      errorAlert("Chưa đăng nhập", "Bạn cần đăng nhập để bình luận");
    } else {
      setIsLoadingComment(true);
      apiCreatePostComments("base", {
        postId: post._id,
        comment: commentInput,
      })
        .then((res) => {
          if (res.data.result) {
            setCommentInput("");
            getPostComment(post._id);
            setIsLoadingComment(false);
          } else {
            errorAlert("Lỗi", "Xin vui lòng thử lại sau");
            setIsLoadingComment(false);
          }
        })
        .catch((error) => {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingComment(false);
          console.log(error);
        });
    }
  };

  const handleEditCommentClick = (commentId, comment) => {
    setIsBaseEdit(true);
    setCommentId(commentId);
    setShowDropdown(!showDropdown);
    setSubCommentInput(comment);
    setReplyInputVisible(true);
    setIsSubEdit(false);
    setSubCommentId("");
  };

  const handleCancelEditCommentClick = () => {
    setIsBaseEdit(false);
    setCommentId("");
    setIsSubEdit(false);
    setSubCommentId("");
  };

  const handleEditSubCommentClick = (subCommentId, comment) => {
    setCommentId("");
    setIsBaseEdit(false);
    setIsSubEdit(true);
    setSubCommentId(subCommentId);
    setShowDropdown(!showDropdown);
    setSubCommentInput(comment);
    setReplyInputVisible(true);
  };

  const handleUpdateBaseComment = (id) => {
    setIsLoadingEditBaseComment(true);
    apiUpdatePostComments(id, "base", {
      comment: subCommentInput,
    })
      .then((res) => {
        if (res.data.result) {
          setSubCommentInput("");
          getPostComment(post._id);
          setIsLoadingEditBaseComment(false);
          setIsBaseEdit(false);
          setReplyInputVisible(false);
        } else {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingEditBaseComment(false);
        }
      })
      .catch((error) => {
        errorAlert("Lỗi", "Xin vui lòng thử lại sau");
        setIsLoadingEditBaseComment(false);
        console.log(error);
      });
  };

  const handleUpdateSubComment = (id) => {
    setIsLoadingEditBaseComment(true);
    apiUpdatePostComments(id, "sub", {
      comment: subCommentInput,
    })
      .then((res) => {
        if (res.data.result) {
          setSubCommentInput("");
          getPostComment(post._id);
          setIsLoadingEditBaseComment(false);
          setIsBaseEdit(false);
          setReplyInputVisible(false);
          setIsSubEdit(false);
        } else {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingEditBaseComment(false);
        }
      })
      .catch(() => {
        errorAlert("Lỗi", "Xin vui lòng thử lại sau");
        setIsLoadingEditBaseComment(false);
      });
  };

  const handleDeleteCommentClick = (status, id) => {
    setShowDropdown(false);
    const confirmDelete = () => {
      return apiDeletePostComments(id, status);
    };

    const deletePostInState = () => {
      getPostComment(post._id);
    };

    deleteAlert(
      "Xóa bình luận",
      "Bạn có chắc chắn muốn xóa bình luận không?",
      confirmDelete,
      deletePostInState
    );
  };

  const handleReportCommentClick = (status, id) => {
    setShowDropdown(false);
    const confirmReport = () => {
      return apiCreateReportPostComments({
        commentId: id,
        typeComment: status,
      });
    };

    const deletePostInState = () => {};

    confirmAlert(
      "Báo cáo bình luận",
      "Bạn cho rằng bình luận này là xấu?",
      "Báo cáo",
      confirmReport,
      deletePostInState,
      {
        title: "Đã báo cáo bình luận",
        text: "Báo cáo bình luận thành công",
        timer: 1500,
        isShowConfirmButton: false,
      }
    );
  };

  const dispatch = useDispatch();
  const { favoritePosts } = useSelector((state) => state?.post);
  const { followingIds } = useSelector((state) => state?.user);

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

  const followUserOnClick = async (userId) => {
    try {
      dispatch(followUserSlice(userId));
      await apiFollowUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const unFollowUserOnClick = async (userId) => {
    try {
      dispatch(unFollowUserSlice(userId));
      await apiUnFollowUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const isFollowed = (userId) => {
    return followingIds.some((followingId) => followingId.following === userId);
  };

  return (
    <div className="post-detail-container">
      <div className="post-detail-content">
        <div className="post-detail-left">
          {!isFetchPost && !post && (
            <p className="text-not-found">Không có bài viết này</p>
          )}
          {(isFetchPost || postLoading) && <PostContentSkeleton />}
          {!!post && !isFetchPost && (
            <div className="post-content">
              <div className="post-content-header">
                <img src={post?.thumbnail_url} alt={post?.title} />
                <h1>{post?.title}</h1>
                <div className="interact">
                  <div className="interact-item">
                    <RxCountdownTimer className={"icon"} size={22} />{" "}
                    <p>{getCreatedAtString(post?.createdAt)}</p>
                  </div>
                  <div className="interact-item">
                    <FaRegComment className={"icon"} size={22} />{" "}
                    <p>{post?.comment_count} bình luận</p>
                  </div>
                  <div className="interact-item">
                    <AiOutlineEye className={"icon"} size={24} />{" "}
                    <p>{post?.view_count} lượt xem</p>
                  </div>
                  <button
                    className="interact-item"
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
                      <>
                        <AiFillHeart size={24} className={"arrow liked"} />
                        Yêu thích
                      </>
                    ) : (
                      <>
                        <AiOutlineHeart size={24} className={"arrow"} /> Yêu
                        thích
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: post?.content }}
                className="content"
              />
              <div className="tags">
                <h1 className="tags-title">Tags</h1>
                <div className="tags-list">
                  {post?.tags?.map((tag, index) => (
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
              <div className="share-post">
                <h1>Chia sẻ bài viết</h1>
                <div className="copy-input">
                  <p id="post-share-link">
                    {`${window.location.origin}/post/${post.slug}`}
                  </p>
                  <Link onClick={handleCopyClick}>
                    {!copied ? (
                      <MdContentCopy className="icon-copy" size={24} />
                    ) : (
                      <BsCheckAll
                        color="#00c491"
                        className="icon-copy"
                        size={24}
                      />
                    )}
                  </Link>
                </div>
              </div>
            </div>
          )}
          {(isFetchPost || postLoading) && <AuthorPostHorizontalSkeleton />}
          {!!post && !isFetchPost && (
            <div className="author">
              <div className="title">
                <h1>Tác giả</h1>
              </div>
              <div className="author-content">
                <div className="author-content-info">
                  <div className="left">
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
                      />
                    </Link>
                  </div>
                  <div className="right">
                    <Link
                      to={ROUTES.PROFILE_PAGE.path.replace(
                        ":username",
                        post?.userId?.username
                      )}
                    >
                      <h2> {post?.userId?.name}</h2>
                    </Link>
                    <p>{post?.userId?.bio}</p>
                    {!!post?.userId?.social && (
                      <div className="social">
                        {!!post?.userId?.social?.facebook && (
                          <Link
                            to={post?.userId?.social?.facebook}
                            target="_blank"
                          >
                            <img src={facebookIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.instagram && (
                          <Link
                            to={post?.userId?.social?.instagram}
                            target="_blank"
                          >
                            <img src={instagramIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.youtube && (
                          <Link
                            to={post?.userId?.social?.youtube}
                            target="_blank"
                          >
                            <img src={youtubeIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.tiktok && (
                          <Link
                            to={post?.userId?.social?.tiktok}
                            target="_blank"
                          >
                            <img src={tiktokIcon} alt="" />
                          </Link>
                        )}
                      </div>
                    )}
                    {user && user?._id === post?.userId?._id ? null : (
                      <button
                        className={`btn-see-all ${
                          isFollowed(post?.userId?._id) ? "" : "follow"
                        }`}
                        onClick={() => {
                          if (!user) {
                            errorAlert(
                              "Bạn chưa đăng nhập",
                              "Bạn cần phải đăng nhập theo dõi"
                            );
                          } else {
                            isFollowed(post?.userId?._id)
                              ? unFollowUserOnClick(post?.userId?._id)
                              : followUserOnClick(post?.userId?._id);
                          }
                        }}
                      >
                        {isFollowed(post?.userId?._id) && !!user
                          ? "Đang theo dõi"
                          : "Theo dõi"}
                      </button>
                    )}
                  </div>
                </div>
                {!!postsUserNewest && (
                  <div className="author-content-posts">
                    {postsUserNewest.map((postUserNewest, index) => (
                      <div
                        key={postUserNewest._id}
                        className="item-blog-container"
                      >
                        <div className="item-blog">
                          <div className="img-blog">
                            <Link to={`/post/${postUserNewest.slug}`}>
                              <img src={postUserNewest?.thumbnail_url} alt="" />
                            </Link>
                          </div>
                          <div className="title-blog">
                            <Link to={`/post/${postUserNewest.slug}`}>
                              <h4>
                                {truncateTitle(
                                  capitalizeFirstLetter(postUserNewest.title),
                                  55
                                )}
                              </h4>
                            </Link>
                            <p>
                              <RxCountdownTimer className={"icon-time"} />
                              {getCreatedAtString(postUserNewest.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {(isFetchPostComments || postCommentsLoading) && (
            <PostCommentSkeleton />
          )}
          {!!postComments && !isFetchPostComments && !!post && (
            <div className="comment">
              <div className="title">
                <h1>Bình luận</h1>
              </div>
              <div className="comment-content">
                <div className="main-input">
                  <h2>Viết bình luận</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateComment();
                    }}
                  >
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                      placeholder="Bình luận..."
                      className="input"
                    />
                    <button
                      disabled={
                        isLoadingComment === true &&
                        isLoadingSubComment === true
                      }
                      type="submit"
                      className="btn-reply large"
                    >
                      {isLoadingComment ? <Loader /> : "Bình luận"}
                    </button>
                  </form>
                </div>
                {!!postComments &&
                  postComments
                    .slice(0, visibleComments)
                    .map((comment, index) => (
                      <div key={comment._id}>
                        <div
                          className={`base-comment${
                            index === -1 ? " border-none" : ""
                          }`}
                        >
                          <Link
                            to={ROUTES.PROFILE_PAGE.path.replace(
                              ":username",
                              comment?.userId?.username
                            )}
                          >
                            <img
                              src={
                                !!comment.userId.avatar
                                  ? comment.userId.avatar
                                  : avtDefault
                              }
                              alt=""
                            />
                          </Link>
                          <div className="main-content">
                            <div className="info">
                              <Link
                                to={ROUTES.PROFILE_PAGE.path.replace(
                                  ":username",
                                  comment?.userId?.username
                                )}
                              >
                                <h3>{comment.userId.name}</h3>
                              </Link>
                              <p>{getCreatedAtString(comment.createdAt)}</p>
                            </div>
                            {isBaseEdit && commentId === comment._id ? null : (
                              <p>{comment.comment}</p>
                            )}
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                if (isBaseEdit && commentId === comment._id) {
                                  handleUpdateBaseComment(comment._id);
                                } else {
                                  handleCreateSubComment(comment._id);
                                  setIsBaseEdit(false);
                                }
                              }}
                            >
                              {replyInputVisible &&
                              commentId === comment._id ? (
                                <textarea
                                  ref={inputRef}
                                  value={subCommentInput}
                                  onChange={(e) =>
                                    setSubCommentInput(e.target.value)
                                  }
                                  required
                                  placeholder="Trả lời..."
                                  className="input"
                                />
                              ) : undefined}
                              {isBaseEdit && commentId === comment._id ? (
                                <div className="btn-edit-container">
                                  <button
                                    onClick={handleCancelEditCommentClick}
                                    type="button"
                                    className="btn-cancel"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    disabled={
                                      isLoadingComment === true ||
                                      isLoadingEditBaseComment === true
                                    }
                                    type="submit"
                                    className="btn-reply"
                                  >
                                    {isLoadingEditBaseComment &&
                                    commentId === comment._id ? (
                                      <Loader />
                                    ) : (
                                      "Lưu"
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  disabled={
                                    isLoadingSubComment === true ||
                                    isLoadingComment === true
                                  }
                                  type="submit"
                                  className="btn-reply"
                                >
                                  {isLoadingSubComment &&
                                  commentId === comment._id ? (
                                    <Loader />
                                  ) : (
                                    "Trả lời"
                                  )}
                                </button>
                              )}
                            </form>
                          </div>
                          <div
                            ref={
                              showDropdownBaseId === comment._id
                                ? dropdownRef
                                : null
                            }
                            className="action-comment"
                          >
                            <BiDotsVerticalRounded
                              onClick={() => {
                                setShowDropdownBaseId(comment._id);
                                setShowDropdownSubId("");
                                setShowDropdown(!showDropdown);
                              }}
                              className={"icon-three-dot"}
                            />
                            {showDropdown &&
                            showDropdownBaseId === comment._id ? (
                              <div className="dropdown-action">
                                <ul>
                                  {user?._id === comment.userId._id && (
                                    <li
                                      onClick={() => {
                                        handleEditCommentClick(
                                          comment._id,
                                          comment.comment
                                        );
                                      }}
                                    >
                                      Chỉnh sửa
                                    </li>
                                  )}
                                  {user?._id === comment.userId._id && (
                                    <li
                                      onClick={() => {
                                        handleDeleteCommentClick(
                                          "base",
                                          comment._id
                                        );
                                      }}
                                    >
                                      Xóa
                                    </li>
                                  )}
                                  <li
                                    onClick={() => {
                                      handleReportCommentClick(
                                        "base",
                                        comment._id
                                      );
                                    }}
                                  >
                                    Báo cáo bình luận xấu
                                  </li>
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {!!comment.subComments &&
                          comment.subComments
                            .slice(0, visibleComments)
                            .map((subComments, index) => (
                              <div
                                key={subComments._id}
                                className="base-comment sub-comment"
                              >
                                <Link
                                  to={ROUTES.PROFILE_PAGE.path.replace(
                                    ":username",
                                    subComments?.userId?.username
                                  )}
                                >
                                  <img
                                    src={
                                      !!subComments.userId.avatar
                                        ? subComments.userId.avatar
                                        : avtDefault
                                    }
                                    alt=""
                                  />
                                </Link>
                                <div className="main-content">
                                  <div className="info">
                                    <Link
                                      to={ROUTES.PROFILE_PAGE.path.replace(
                                        ":username",
                                        subComments?.userId?.username
                                      )}
                                    >
                                      <h3>{subComments.userId.name}</h3>
                                    </Link>
                                    <p>
                                      {getCreatedAtString(
                                        subComments.createdAt
                                      )}
                                    </p>
                                  </div>
                                  {isSubEdit &&
                                  subCommentId === subComments._id ? null : (
                                    <p>{subComments.comment}</p>
                                  )}

                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      handleUpdateSubComment(subComments._id);
                                    }}
                                  >
                                    {replyInputVisible &&
                                    subCommentId === subComments._id ? (
                                      <textarea
                                        ref={inputRef}
                                        value={subCommentInput}
                                        onChange={(e) =>
                                          setSubCommentInput(e.target.value)
                                        }
                                        required
                                        placeholder="Trả lời..."
                                        className="input"
                                      />
                                    ) : undefined}
                                    {isSubEdit &&
                                    subCommentId === subComments._id ? (
                                      <div className="btn-edit-container">
                                        <button
                                          onClick={handleCancelEditCommentClick}
                                          type="button"
                                          className="btn-cancel"
                                        >
                                          Hủy
                                        </button>
                                        <button
                                          disabled={
                                            isLoadingComment === true ||
                                            isLoadingEditBaseComment === true
                                          }
                                          type="submit"
                                          className="btn-reply"
                                        >
                                          {isLoadingEditBaseComment &&
                                          subCommentId === subComments._id ? (
                                            <Loader />
                                          ) : (
                                            "Lưu"
                                          )}
                                        </button>
                                      </div>
                                    ) : null}
                                  </form>
                                  {/* <textarea
                              // value={this.state.text}
                              // onChange={this.handleChange}
                              required
                              placeholder="Bình luận..."
                              className="input"
                            />
                            <button className="btn-reply">Trả lời</button> */}
                                </div>
                                <div
                                  ref={
                                    showDropdownSubId === subComments._id
                                      ? dropdownRef
                                      : null
                                  }
                                  className="action-comment"
                                >
                                  <BiDotsVerticalRounded
                                    onClick={() => {
                                      setShowDropdownBaseId("");
                                      setShowDropdownSubId(subComments._id);
                                      setShowDropdown(!showDropdown);
                                    }}
                                    className={"icon-three-dot"}
                                  />
                                  {showDropdown &&
                                  showDropdownSubId === subComments._id ? (
                                    <div className="dropdown-action">
                                      <ul>
                                        {user?._id ===
                                          subComments.userId._id && (
                                          <li
                                            onClick={() => {
                                              handleEditSubCommentClick(
                                                subComments._id,
                                                subComments.comment
                                              );
                                            }}
                                          >
                                            Chỉnh sửa
                                          </li>
                                        )}
                                        {user?._id ===
                                          subComments.userId._id && (
                                          <li
                                            onClick={() => {
                                              handleDeleteCommentClick(
                                                "sub",
                                                subComments._id
                                              );
                                            }}
                                          >
                                            Xóa
                                          </li>
                                        )}
                                        <li
                                          onClick={() => {
                                            handleReportCommentClick(
                                              "sub",
                                              subComments._id
                                            );
                                          }}
                                        >
                                          Báo cáo bình luận xấu
                                        </li>
                                      </ul>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                      </div>
                    ))}
                {postComments.length > numberCommentVisible && (
                  <div className="see-more">
                    <button
                      onClick={() => {
                        if (visibleComments > numberCommentVisible) {
                          handleHideLessComments();
                        } else {
                          handleViewMoreComments();
                        }
                      }}
                      className="btn-see-more"
                    >
                      <div>
                        {visibleComments > numberCommentVisible
                          ? "Ẩn bớt"
                          : "Xem tất cả bình luận"}
                        {visibleComments > numberCommentVisible ? (
                          <MdKeyboardArrowUp size={24} className={"arrow"} />
                        ) : (
                          <MdKeyboardArrowDown size={24} className={"arrow"} />
                        )}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {(isFetchRelatedPosts || relatedPostsLoading) && (
            <RelatedPostsSkeleton />
          )}
          {relatedPosts.length > 0 && !isFetchRelatedPosts && !!post && (
            <div className="related-posts">
              <div className="title">
                <h1>Bài viết liên quan</h1>
              </div>
              <div className="posts">
                {relatedPosts.map((post) => (
                  <div key={post._id} className="item-blog-container">
                    <div className="item-blog">
                      <div className="img-blog">
                        <Link
                          to={ROUTES.POST_DETAIL_PAGE.path.replace(
                            ":slug",
                            post?.slug
                          )}
                        >
                          <img src={post?.thumbnail_url} alt={post?.title} />
                        </Link>
                      </div>
                      <div className="title-blog">
                        <Link
                          to={ROUTES.POST_DETAIL_PAGE.path.replace(
                            ":slug",
                            post?.slug
                          )}
                        >
                          <h4>
                            {truncateTitle(
                              capitalizeFirstLetter(post?.title),
                              55
                            )}
                          </h4>
                        </Link>
                        <p>
                          <RxCountdownTimer className={"icon-time"} />
                          {getCreatedAtString(post?.createdAt)}
                        </p>
                      </div>
                    </div>{" "}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="post-detail-right">
          {(isFetchPost || postLoading) && <AuthorPostVerticalSkeleton />}
          {!!post && !isFetchPost && (
            <div className="author">
              <div className="title">
                <h2>Tác giả</h2>
              </div>
              <div className="author-content">
                <div className="author-content-info">
                  <div className="left">
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
                      />
                    </Link>
                  </div>
                  <div className="right">
                    <Link
                      to={ROUTES.PROFILE_PAGE.path.replace(
                        ":username",
                        post?.userId?.username
                      )}
                    >
                      <h3>{post?.userId?.name}</h3>
                    </Link>
                    <p>{post?.userId?.bio}</p>
                    {!!post?.userId?.social && (
                      <div className="social">
                        {!!post?.userId?.social?.facebook && (
                          <Link
                            to={post?.userId?.social?.facebook}
                            target="_blank"
                          >
                            <img src={facebookIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.instagram && (
                          <Link
                            to={post?.userId?.social?.instagram}
                            target="_blank"
                          >
                            <img src={instagramIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.youtube && (
                          <Link
                            to={post?.userId?.social?.youtube}
                            target="_blank"
                          >
                            <img src={youtubeIcon} alt="" />
                          </Link>
                        )}
                        {!!post?.userId?.social?.tiktok && (
                          <Link
                            to={post?.userId?.social?.tiktok}
                            target="_blank"
                          >
                            <img src={tiktokIcon} alt="" />
                          </Link>
                        )}
                      </div>
                    )}
                    {user && user?._id === post?.userId?._id ? null : (
                      <button
                        className={`btn-see-all ${
                          isFollowed(post?.userId?._id) ? "" : "follow"
                        }`}
                        onClick={() => {
                          if (!user) {
                            errorAlert(
                              "Bạn chưa đăng nhập",
                              "Bạn cần phải đăng nhập theo dõi"
                            );
                          } else {
                            isFollowed(post?.userId?._id)
                              ? unFollowUserOnClick(post?.userId?._id)
                              : followUserOnClick(post?.userId?._id);
                          }
                        }}
                      >
                        {isFollowed(post?.userId?._id) && !!user
                          ? "Đang theo dõi"
                          : "Theo dõi"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {(isFetchMostViewedPosts || mostViewedPostsLoading) && (
            <PostMostSkeleton />
          )}
          {mostViewedPosts.length > 0 && !isFetchMostViewedPosts && (
            <div className="post-most">
              <div className="title">
                <h2>Bài viết nổi bật</h2>
              </div>
              <div className="item-blog-container">
                {mostViewedPosts.map((post, index) => (
                  <div key={post._id} className="item-blog">
                    <div className="img-blog">
                      <Link
                        to={ROUTES.POST_DETAIL_PAGE.path.replace(
                          ":slug",
                          post?.slug
                        )}
                      >
                        <img src={post?.thumbnail_url} alt="" />
                      </Link>
                    </div>
                    <div className="title-blog">
                      <Link
                        to={ROUTES.POST_DETAIL_PAGE.path.replace(
                          ":slug",
                          post?.slug
                        )}
                      >
                        <h4>
                          {truncateTitle(
                            capitalizeFirstLetter(post?.title),
                            40
                          )}
                        </h4>
                      </Link>
                      <p>
                        <RxCountdownTimer className={"icon-time"} />
                        {getCreatedAtString(post?.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(popularTagsLoading || isFetchPopularTags) && <TagCloudSkeleton />}
          {popularTags.length > 0 && !isFetchPopularTags && (
            <div className="tag-cloud">
              <div className="title">
                <h3>Khám phá</h3>
              </div>
              <div className="tag-container">
                {popularTags.map((tag, index) => (
                  <Link
                    to={`${ROUTES.POST_SEARCH_PAGE.path}?s=${tag.name}`}
                    key={tag._id}
                    className={`item-tag tag-${index + 1}`}
                  >
                    <span># </span>
                    {truncateTitle(tag.name, 25)}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {(isFetchMostViewedPosts || isFetchPopularTags) && (
            <FollowMeSkeleton />
          )}
          {!isFetchMostViewedPosts && !isFetchPopularTags && (
            <div className="follow-me">
              <div className="title">
                <h2>Theo dõi chúng tôi</h2>
              </div>
              <div className="follow-container">
                <Link className={"item-follow"}>
                  <div className="img">
                    <img src={facebookIcon} alt="" />
                  </div>
                  <h3>Facebook</h3>
                </Link>
                <Link to={"https://www.youtube.com/"} className={"item-follow"}>
                  <div className="img">
                    <img src={youtubeIcon} alt="" />
                  </div>
                  <h3>Youtube</h3>
                </Link>
                <Link className={"item-follow"}>
                  <div className="img">
                    <img src={instagramIcon} alt="" />
                  </div>
                  <h3>Instagram</h3>
                </Link>
                <Link className={"item-follow"}>
                  <div className="img">
                    <img src={tiktokIcon} alt="" />
                  </div>
                  <h3>TikTok</h3>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
