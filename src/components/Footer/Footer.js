import React, { useEffect, useState } from "react";
import "./Footer.scss";
import { RxCountdownTimer } from "react-icons/rx";
import { Link } from "react-router-dom";
import facebook from "../../assets/images/facebook.png";
import youtube from "../../assets/images/youtube.png";
import instagram from "../../assets/images/instagram.png";
import tiktok from "../../assets/images/tiktok.png";
import gafastIcon from "../../assets/images/LogoHorizontal.png";
import { apiGetMostPopularTags, getLatestPost } from "../../apis/post";
import { truncateTitle } from "../../utils/truncateString";
import ROUTES from "../../constants/routes";
import { capitalizeFirstLetter } from "../../utils/convertString";
import { getCreatedAtString } from "../../utils/convertTime";

const Footer = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  const getLatestPostFetch = async () => {
    try {
      const res = await getLatestPost(`limit=3`);
      setLatestPosts(res.data.result);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getMostPopularTags = async () => {
    try {
      const res = await apiGetMostPopularTags(`limit=${6}`);
      setPopularTags(res.data.tags);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLatestPostFetch();
    getMostPopularTags();
  },[]);
  return (
    <div className="footer-container">
      <div className="grid-container">
        <div className="content">
          <div className="item latest-blog">
            <div className="title">
              <h3>Bài viết mới nhất</h3>
            </div>
            <div className="item-blog-container">
              {latestPosts.length > 0 &&
                latestPosts.map((post, index) => (
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
          <div className="item tag-cloud">
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
          <div className="item follow-me">
            <div className="title">
              <h3> Theo dõi chúng tôi</h3>
            </div>
            <div className="follow-container">
              <Link className={"item-follow"}>
                <div className="img">
                  <img src={facebook} alt="" />
                </div>
                <h3>Facebook</h3>
              </Link>
              <Link to={"https://www.youtube.com/"} className={"item-follow"}>
                <div className="img">
                  <img src={youtube} alt="" />
                </div>
                <h3>Youtube</h3>
              </Link>
              <Link className={"item-follow"}>
                <div className="img">
                  <img src={instagram} alt="" />
                </div>
                <h3>Instagram</h3>
              </Link>
              <Link className={"item-follow"}>
                <div className="img">
                  <img src={tiktok} alt="" />
                </div>
                <h3>TikTok</h3>
              </Link>
            </div>
          </div>
          <div className="item about-me">
            <div className="title">
              <h3>Giới thiệu</h3>
            </div>
            <Link className={"logo"} to={"/"}>
              <img src={gafastIcon} alt="gafast" />
            </Link>
            <p>
              <b>Gafast</b> giúp nông dân tại Việt Nam có thể tiếp cận với các
              công nghệ và các thông tin mới nhất, tăng cường kết nối giữa nông
              dân với nhau, hỗ trợ phát triển kinh tế cho các gia đình nông dân
              và góp phần thúc đẩy sự phát triển bền vững của nền nông nghiệp
              Việt Nam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
