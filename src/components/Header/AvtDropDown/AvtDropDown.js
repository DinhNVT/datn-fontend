import React from "react";
import "./AvtDropDown.scss";
import avtDefault from "../../../assets/images/avatar_default.png";
import { useDispatch } from "react-redux";
import { logoutUserFetch } from "../../../stores/apiAuthRequest";
import { Link } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

const AvtDropDown = (props) => {
  const dispatch = useDispatch();
  const handleLogoutClick = () => {
    logoutUserFetch(dispatch, props.handleAvatarClick);
  };
  return (
    <div className="avatar-dropdown">
      <div className="info-user">
        <div className="avt">
          <img
            src={props.user.avatar ? props.user.avatar : avtDefault}
            alt={props.user?.name}
          />
        </div>
        <div className="info-title">
          <h4>{props.user?.name}</h4>
          <p>{props.user?.email}</p>
        </div>
      </div>
      <hr />
      <div className="logout-btn">
        <Link className={"btn"} onClick={handleLogoutClick}>
          Đăng xuất <IoLogOutOutline size={24} />
        </Link>
      </div>
    </div>
  );
};

export default AvtDropDown;
