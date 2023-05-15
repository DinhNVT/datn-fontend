import React from "react";
import "./Footer.scss";
import { RxCountdownTimer } from "react-icons/rx";
import { Link } from "react-router-dom";
import facebook from "../../assets/images/facebook.png";
import youtube from "../../assets/images/youtube.png";
import instagram from "../../assets/images/instagram.png";
import tiktok from "../../assets/images/tiktok.png";
import gafastIcon from "../../assets/images/LogoHorizontal.png";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="grid-container">
        <div className="content">
          <div className="item latest-blog">
            <div className="title">
              <h3>Bài viết mới nhất</h3>
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
                  <img
                    src="https://pgdconcuong.edu.vn/wp-content/uploads/2023/03/1678477180_Gia-thit-soc-bao-nhieu-tien-1kg-Gia-thit-soc-768x529.jpeg"
                    alt=""
                  />
                </div>
                <div className="title-blog">
                  <h4>
                    Kỹ thuật trồng ổi trong chậu mới nhất cho quả sai lúc lỉu
                  </h4>
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
                  <img
                    src="https://vuongquocloaivat.com/wp-content/uploads/2020/05/ca-canh-compressed.jpg"
                    alt=""
                  />
                </div>
                <div className="title-blog">
                  <h4>Kỹ thuật trồng ổi trong chậu cho quả sai lúc lỉu</h4>
                  <p>
                    <RxCountdownTimer className={"icon-time"} />
                    20-04-2023
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="item tag-cloud">
            <div className="title">
              <h3>Khám phá</h3>
            </div>
            <div className="tag-container">
              <Link className={"item-tag tag-1"}>
                <span># </span>Trồng ổi
              </Link>
              <Link className={"item-tag tag-2"}>
                <span># </span>Trồng mít
              </Link>
              <Link className={"item-tag tag-3"}>
                <span># </span>Nuôi sóc
              </Link>
              <Link className={"item-tag tag-4"}>
                <span># </span>Phân bón
              </Link>
              <Link className={"item-tag tag-5"}>
                <span># </span>Chăn nuôi
              </Link>
              <Link className={"item-tag tag-6"}>
                <span># </span>Sâu
              </Link>
              <Link className={"item-tag tag-6"}>
                <span># </span>Bò
              </Link>
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
