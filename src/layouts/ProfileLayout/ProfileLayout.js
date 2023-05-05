import React from "react";
import "./ProfileLayout.scss";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import avtDefault from "../../assets/images/avatar_default.png";
import { useSelector } from "react-redux";

const ProfileLayout = (props) => {
  const { user } = useSelector((state) => state?.auth?.login);
  return (
    <div className="profile-layout">
      <Header />
      <div className="profile-children">
        <div className="profile-container">
          <div className="profile-menu">
            <div className="profile-info">
              <div className="avt">
                <img
                  src={user.avatar ? user.avatar : avtDefault}
                  alt={user?.name}
                />
              </div>
              <div className="name">
                <h1>{user?.name}</h1>
                <h3>{user?.email}</h3>
                <button>Sửa thông tin</button>
              </div>
            </div>
            <div className="profile-navbar">
              <ul>
                <li>
                  <Link className="active">Bài viết</Link>
                </li>
                <li>
                  <Link className="">Yêu thích</Link>
                </li>
                <li>
                  <Link>Đang theo dõi</Link>
                </li>
                <li>
                  <Link>Người theo dõi</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="profile-content">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
