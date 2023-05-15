import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import "./HomeLayout.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Slider from "react-slick";
import { Link, useLocation } from "react-router-dom";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import avtDefault from "../../assets/images/avatar_default.png";
// import { BsArrowRight } from "react-icons/bs";
import ROUTES from "../../constants/routes";
import { getLatestPost } from "../../apis/post";
import { getCreatedAtString } from "../../utils/convertTime";
import { truncateTitle } from "../../utils/truncateString";

const HomeLayout = (props) => {
  const [latestPosts, setLatestPosts] = useState([]);
  const getLatestPostFetch = async () => {
    getLatestPost().then((res) => setLatestPosts(res.data.result));
  };
  useEffect(() => {
    getLatestPostFetch();
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
                    latestPosts?.map((post) => (
                      <div key={post._id} className="slider-item">
                        <img src={post.thumbnail_url} alt="" />
                        <div className="tags">
                          {post?.tags.map((tag, index) => (
                            <Link
                              key={tag._id}
                              className={`item-tag tag-${index + 1}`}
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
                                <Link>
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
                            <Link>
                              Yêu thích
                              <AiOutlineHeart size={24} className={"arrow"} />
                            </Link>
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
                  <Link>Đang theo dõi</Link>
                </li>
              </ul>
            </div>
            <div className="home-children">
              <div className="children-left">{props.children}</div>
              <div className="children-right">Right</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeLayout;
