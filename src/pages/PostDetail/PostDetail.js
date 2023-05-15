import React, { useCallback, useEffect, useRef, useState } from "react";
import "./PostDetail.scss";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import NotFoundPage from "../404/NotFoundPage";
import {
  apiCreatePostComments,
  apiGetDetailPost,
  apiGetPostComments,
  apiGetPostsOption,
} from "../../apis/post";
import { getCreatedAtString } from "../../utils/convertTime";
import avtDefault from "../../assets/images/avatar_default.png";
import facebookIcon from "../../assets/images/facebook.png";
import youtubeIcon from "../../assets/images/youtube.png";
import instagramIcon from "../../assets/images/instagram.png";
import tiktokIcon from "../../assets/images/tiktok.png";
import { useSelector } from "react-redux";
import { errorAlert } from "../../utils/customAlert";
import Loader from "../../components/Loader/Loader";
import { truncateTitle } from "../../utils/truncateString";

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [postComments, setPostComments] = useState(null);
  const [postsUserNewest, setPostsUserNewest] = useState(null);
  const [found, setFound] = useState(true);
  const [replyInputVisible, setReplyInputVisible] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [subCommentInput, setSubCommentInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
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

  const getPostComment = (postId) => {
    apiGetPostComments(postId)
      .then((res) => {
        if (res.data.result) {
          setPostComments(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
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
        console.log(err.message);
      });
  };

  const getPostDetail = useCallback(async () => {
    const post = await apiGetDetailPost(slug)
      .then((res) => {
        if (!res.data.result) {
          setFound(false);
        } else {
          setPost(res.data.result);
          window.scrollTo(0, 0);
          return res.data.result;
        }
      })
      .catch(() => {
        setFound(false);
      });
    getPostComment(post._id);
    getPostOption(post.userId._id);
  }, [slug]);

  useEffect(() => {
    setFound(true);
    getPostDetail();
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
    if (replyInputVisible && !!commentId) {
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
        .catch(() => {
          errorAlert("Lỗi", "Xin vui lòng thử lại sau");
          setIsLoadingComment(false);
        });
    }
  };

  if (!found) {
    return <NotFoundPage />;
  }

  return (
    <div className="post-detail-container">
      <div className="post-detail-content">
        <div className="post-detail-left">
          {!!post && (
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
                    <Link key={tag._id} className={`item-tag tag-${index + 1}`}>
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
          {!!post && (
            <div className="author">
              <div className="title">
                <h1>Tác giả</h1>
              </div>
              <div className="author-content">
                <div className="author-content-info">
                  <div className="left">
                    <Link>
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
                    <h2>{post?.userId?.name}</h2>
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
                    <Link className="btn-see-all">Xem tất cả bài viết</Link>
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
                              <h4>{truncateTitle(postUserNewest.title, 60)}</h4>
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

          {!!postComments && (
            <div className="comment">
              <div className="title">
                <h1>Bình luận</h1>
              </div>
              <div className="comment-content">
                {!!postComments &&
                  postComments.map((comment, index) => (
                    <div>
                      <div key={comment._id} className="base-comment">
                        <img
                          src={
                            !!comment.userId.avatar
                              ? comment.userId.avatar
                              : avtDefault
                          }
                          alt=""
                        />
                        <div className="main-content">
                          <div className="info">
                            <h3>{comment.userId.name}</h3>
                            <p>{getCreatedAtString(comment.createdAt)}</p>
                          </div>
                          <p>{comment.comment}</p>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleCreateSubComment(comment._id);
                            }}
                          >
                            {replyInputVisible && commentId === comment._id ? (
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
                            <button
                              disabled={
                                isLoadingSubComment === true &&
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
                          </form>
                        </div>
                      </div>
                      {!!comment.subComments &&
                        comment.subComments.map((subComments, index) => (
                          <div className="base-comment sub-comment">
                            <img
                              src={
                                !!subComments.userId.avatar
                                  ? subComments.userId.avatar
                                  : avtDefault
                              }
                              alt=""
                            />
                            <div className="main-content">
                              <div className="info">
                                <h3>{subComments.userId.name}</h3>
                                <p>
                                  {getCreatedAtString(subComments.createdAt)}
                                </p>
                              </div>
                              <p>{subComments.comment}</p>
                              {/* <textarea
                              // value={this.state.text}
                              // onChange={this.handleChange}
                              required
                              placeholder="Bình luận..."
                              className="input"
                            />
                            <button className="btn-reply">Trả lời</button> */}
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
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
              </div>
            </div>
          )}

          <div className="related-posts">
            <div className="title">
              <h1>Bài viết liên quan</h1>
            </div>
            <div className="posts">
              <div className="item-blog-container">
                <div className="item-blog">
                  <div className="img-blog">
                    <Link>
                      <img
                        src="https://traicaycaonghe.vn/wp-content/uploads/2021/05/oinuhoang13.jpg"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="title-blog">
                    <Link>
                      <h4>Kỹ thuật trồng ổi trong chậu cho quả sai lúc lỉu</h4>
                    </Link>
                    <p>
                      <RxCountdownTimer className={"icon-time"} />
                      20-04-2023
                    </p>
                  </div>
                </div>
              </div>
              <div className="item-blog-container">
                <div className="item-blog">
                  <div className="img-blog">
                    <Link>
                      <img
                        src="https://traicaycaonghe.vn/wp-content/uploads/2021/05/oinuhoang13.jpg"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="title-blog">
                    <Link>
                      <h4>Kỹ thuật trồng ổi trong chậu cho quả sai lúc lỉu</h4>
                    </Link>
                    <p>
                      <RxCountdownTimer className={"icon-time"} />
                      20-04-2023
                    </p>
                  </div>
                </div>
              </div>
              <div className="item-blog-container">
                <div className="item-blog">
                  <div className="img-blog">
                    <Link>
                      <img
                        src="https://traicaycaonghe.vn/wp-content/uploads/2021/05/oinuhoang13.jpg"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="title-blog">
                    <Link>
                      <h4>Kỹ thuật trồng ổi trong chậu cho quả sai lúc lỉu</h4>
                    </Link>
                    <p>
                      <RxCountdownTimer className={"icon-time"} />
                      20-04-2023
                    </p>
                  </div>
                </div>
              </div>
              <div className="item-blog-container">
                <div className="item-blog">
                  <div className="img-blog">
                    <Link>
                      <img
                        src="https://traicaycaonghe.vn/wp-content/uploads/2021/05/oinuhoang13.jpg"
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="title-blog">
                    <Link>
                      <h4>Kỹ thuật trồng ổi trong chậu cho quả sai lúc lỉu</h4>
                    </Link>
                    <p>
                      <RxCountdownTimer className={"icon-time"} />
                      20-04-2023
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="post-detail-right">
          {!!post && (
            <div className="author">
              <div className="title">
                <h2>Tác giả</h2>
              </div>
              <div className="author-content">
                <div className="author-content-info">
                  <div className="left">
                    <Link>
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
                    <h3>{post?.userId?.name}</h3>
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
                    <Link className="btn-see-all">Xem tất cả bài viết</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
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
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
