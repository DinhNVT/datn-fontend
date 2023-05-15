import { Link } from "react-router-dom";
import "./HomePage.scss";
import React from "react";
import avtDefault from "../../assets/images/avatar_default.png";
import { RxCountdownTimer } from "react-icons/rx";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import ROUTES from "../../constants/routes";

const HomePage = () => {
  return (
    <div className="for-you-container">
      <div className="for-you-item">
        <div className="for-you-item-content">
          <Link to={ROUTES.POST_DETAIL_PAGE.path}>
            <img
              src="https://i.ex-cdn.com/nongnghiep.vn/files/dungct/2021/04/10/tac-dung-cua-cay-oi_nongnghiep-120034_919.jpg"
              alt=""
            />
          </Link>
          <div className="for-you-post-info">
            <Link className="title">
              <h2>Kỹ thuật trồng ổi trong chậu cho quả sai lúc lỉu</h2>
            </Link>
            <div className="interact">
              <div className="interact-item">
                <RxCountdownTimer className={"icon"} size={22} />{" "}
                <p>04-04-2023</p>
              </div>
              <div className="interact-item">
                <FaRegComment className={"icon"} size={22} />{" "}
                <p>34 bình luận</p>
              </div>
              <div className="interact-item">
                <AiOutlineEye className={"icon"} size={24} /> <p>33 lượt xem</p>
              </div>
            </div>
            <div className="info-post">
              <div className="author">
                <Link>
                  <img src={avtDefault} alt="" className="avt" />
                  <h4>Nguyễn Hữu Dinh</h4>
                </Link>
              </div>
            </div>
            <p>
              Thành lập tháng 4/2013, Đặng Gia Trang hiện là đơn vị cung cấp
              phân trùn quế hàng đầu Việt Nam với thương hiệu Sfarm. Đồng thời
              cũng đã phát triển thêm các sản phẩm vật tư khác cung cấp cho
              ngành nông nghiệp đô thị chủ yếu là dòng giá thể và phân bón hữu
              cơ, sinh học như đất sạch hữu cơ, mụn dừa xử lý, trấu hun nguyên
              cánh,…
            </p>
            <div className="tags">
              <Link className={"item-tag tag-1"}>
                {" "}
                <span># </span>Trồng ổi
              </Link>
              <Link className={"item-tag tag-2"}>
                {" "}
                <span># </span>Trồng ổi
              </Link>
              <Link className={"item-tag tag-3"}>
                {" "}
                <span># </span>Trồng ổi
              </Link>
            </div>
            <div className="read-more-btn">
              <Link>
                Đọc thêm
                <BsArrowRight size={24} className={"arrow"} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="for-you-item">
        <div className="for-you-item-content">
          <Link to={ROUTES.POST_DETAIL_PAGE.path}>
            <img
              src="https://i.ex-cdn.com/nongnghiep.vn/files/dungct/2021/04/10/tac-dung-cua-cay-oi_nongnghiep-120034_919.jpg"
              alt=""
            />
          </Link>
          <div className="for-you-post-info">
            <Link className="title">
              <h2>Kỹ thuật trồng ổi trong chậu cho quả sai lúc lỉu</h2>
            </Link>
            <div className="interact">
              <div className="interact-item">
                <RxCountdownTimer className={"icon"} size={22} />{" "}
                <p>04-04-2023</p>
              </div>
              <div className="interact-item">
                <FaRegComment className={"icon"} size={22} />{" "}
                <p>34 bình luận</p>
              </div>
              <div className="interact-item">
                <AiOutlineEye className={"icon"} size={24} /> <p>33 lượt xem</p>
              </div>
            </div>
            <div className="info-post">
              <div className="author">
                <Link>
                  <img src={avtDefault} alt="" className="avt" />
                  <h4>Nguyễn Hữu Dinh</h4>
                </Link>
              </div>
            </div>
            <p>
              Thành lập tháng 4/2013, Đặng Gia Trang hiện là đơn vị cung cấp
              phân trùn quế hàng đầu Việt Nam với thương hiệu Sfarm. Đồng thời
              cũng đã phát triển thêm các sản phẩm vật tư khác cung cấp cho
              ngành nông nghiệp đô thị chủ yếu là dòng giá thể và phân bón hữu
              cơ, sinh học như đất sạch hữu cơ, mụn dừa xử lý, trấu hun nguyên
              cánh,…
            </p>
            <div className="tags">
              <Link className={"item-tag tag-1"}>
                {" "}
                <span># </span>Trồng ổi
              </Link>
              <Link className={"item-tag tag-2"}>
                {" "}
                <span># </span>Trồng ổi
              </Link>
              <Link className={"item-tag tag-3"}>
                {" "}
                <span># </span>Trồng ổi
              </Link>
            </div>
            <div className="read-more-btn">
              <Link>
                Đọc thêm
                <BsArrowRight size={24} className={"arrow"} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
