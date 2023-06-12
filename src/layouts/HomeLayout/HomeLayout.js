import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import "./HomeLayout.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Slider from "react-slick";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import {
  AiOutlineEye,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import avtDefault from "../../assets/images/avatar_default.png";
import ROUTES from "../../constants/routes";
import {
  apiGetMostPopularTags,
  apiGetMostViewedPosts,
  getLatestPost,
} from "../../apis/post";
import { getCreatedAtString } from "../../utils/convertTime";
import { truncateTitle } from "../../utils/truncateString";
import { useDispatch, useSelector } from "react-redux";
import { errorAlert } from "../../utils/customAlert";
import { apiAddToFavorites, apiDeleteFavoritePost } from "../../apis/user";
import { BsCheckAll } from "react-icons/bs";
import {
  addToFavoritesSlice,
  removeFromFavoritesSlice,
} from "../../stores/postSlice";
import facebookIcon from "../../assets/images/facebook.png";
import youtubeIcon from "../../assets/images/youtube.png";
import instagramIcon from "../../assets/images/instagram.png";
import tiktokIcon from "../../assets/images/tiktok.png";
import { capitalizeFirstLetter } from "../../utils/convertString";

const HomeLayout = (props) => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

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

  const getLatestPostFetch = async () => {
    try {
      const res = await getLatestPost(`limit=6`);
      setLatestPosts(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const getMostViewedPosts = async () => {
    try {
      const res = await apiGetMostViewedPosts(`limit=${4}`);
      setMostViewedPosts(res.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const getMostPopularTags = async () => {
    try {
      const res = await apiGetMostPopularTags(`limit=${6}`);
      setPopularTags(res.data.tags);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLatestPostFetch();
    getMostViewedPosts();
    getMostPopularTags();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.auth?.login);
  const { favoritePosts } = useSelector((state) => state?.post);

  const handleFollowingClick = (e) => {
    e.preventDefault();
    if (!user) {
      errorAlert(
        "Bạn phải đăng nhập",
        "Bạn hãy đăng nhập để có xem những bài viết bạn theo dõi"
      );
    } else {
      navigate(ROUTES.HOME_FOLLOWING_PAGE.path);
    }
  };

  const addToFavorites = async (postId) => {
    try {
      dispatch(addToFavoritesSlice(postId));
      await apiAddToFavorites({ postId: postId });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const removeFromFavorites = async (postId) => {
    try {
      dispatch(removeFromFavoritesSlice(postId));
      await apiDeleteFavoritePost(postId);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const isPostLiked = (postId) => {
    return favoritePosts.some((favoritePost) => favoritePost.postId === postId);
  };

  return (
    <div className="home-layout">
      <Header />
      <div className="home-children">
        <div className="home-container">
          <div className="home-content">
            <div className="slider-container">
              {latestPosts.length > 0 ? (
                <Slider {...settings}>
                  {latestPosts.length > 0 &&
                    latestPosts.reverse().map((post) => (
                      <div key={post._id} className="slider-item">
                        <img src={post.thumbnail_url} alt="" />
                        <div className="tags">
                          {post?.tags.map((tag, index) => (
                            <Link
                              key={tag._id}
                              className={`item-tag tag-${index + 1}`}
                              to={`${ROUTES.POST_SEARCH_PAGE.path}?s=${tag.name}`}
                            >
                              <span># </span>
                              {tag.name}
                            </Link>
                          ))}
                        </div>
                        <div className="summary-container">
                          <div className="summary">
                            <Link to={`/post/${post.slug}`}>
                              <h1>{truncateTitle(post.title, 85)}</h1>
                            </Link>
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
                                    alt={post?.userId?.name}
                                    className="avt"
                                  />
                                  <h3>{post?.userId?.name}</h3>
                                </Link>
                              </div>
                              <div className="interact-item">
                                <RxCountdownTimer size={22} />{" "}
                                <p>{getCreatedAtString(post.createdAt)}</p>
                              </div>
                              <div className="interact-item">
                                <FaRegComment size={22} />{" "}
                                <p>{post.comment_count} bình luận</p>
                              </div>
                              <div className="interact-item">
                                <AiOutlineEye size={24} />{" "}
                                <p>{post.view_count} lượt xem</p>
                              </div>
                            </div>
                          </div>
                          <div className="read-more-btn">
                            {/* <Link>
                            Đọc thêm
                            <BsArrowRight size={24} className={"arrow"} />
                          </Link> */}
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
                    ))}
                </Slider>
              ) : (
                <div className="loader">
                  <div className="top">
                    <div className="tags-skeleton skeleton"></div>
                    <div className="tags-skeleton skeleton"></div>
                  </div>
                  <div className="bottom">
                    <div className="title-skeleton skeleton"></div>
                    <div className="title-skeleton skeleton last"></div>
                    <div className="info">
                      <div className="avt-skeleton skeleton"></div>
                      <div className="text-skeleton skeleton"></div>
                      <div className="text-skeleton skeleton"></div>
                      <div className="text-skeleton skeleton"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div></div>
            <div className="home-menu-bar">
              <ul>
                <li>
                  <Link
                    className={
                      location.pathname === ROUTES.HOME_PAGE.path
                        ? "active"
                        : ""
                    }
                    to={ROUTES.HOME_PAGE.path}
                  >
                    Dành cho bạn
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      location.pathname === ROUTES.HOME_FOLLOWING_PAGE.path
                        ? "active"
                        : ""
                    }
                    onClick={handleFollowingClick}
                  >
                    Đang theo dõi
                  </Link>
                </li>
              </ul>
            </div>
            <div className="home-children">
              <div className="children-left">{props.children}</div>
              <div className="children-right">
                <div className="post-most">
                  <div className="title">
                    <h2>Bài viết nổi bật</h2>
                  </div>
                  <div className="item-blog-container">
                    {mostViewedPosts.length > 0 &&
                      mostViewedPosts.map((post, index) => (
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
                                  45
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
                <div className="tag-cloud">
                  <div className="title">
                    <h3>Khám phá</h3>
                  </div>
                  <div className="tag-container">
                    {popularTags.length > 0 &&
                      popularTags.map((tag, index) => (
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
                    <Link
                      to={"https://www.youtube.com/"}
                      className={"item-follow"}
                    >
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
