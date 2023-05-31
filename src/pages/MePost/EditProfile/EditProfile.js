import React, { useEffect, useState } from "react";
import "./EditProfile.scss";
import avtDefault from "../../../assets/images/avatar_default.png";
import { TbPhotoEdit } from "react-icons/tb";
import facebookIcon from "../../../assets/images/facebook.png";
import instagramIcon from "../../../assets/images/instagram.png";
import youtubeIcon from "../../../assets/images/youtube.png";
import tiktokIcon from "../../../assets/images/tiktok.png";
import { VscCircleLargeFilled } from "react-icons/vsc";
import Modal from "../../../components/Modal/Modal";
import FullName from "./FullName/FullName";
import ChangePassword from "./ChangePassword/ChangePassword";
import ChangeSocial from "./ChangeSocial/ChangeSocial";
import ChangeAvatar from "./ChangeAvatar/ChangeAvatar";
import { useDispatch, useSelector } from "react-redux";
import { refreshUserFetch } from "../../../stores/apiAuthRequest";

const EditProfile = () => {
  const [isShowModal, setIsShowModal] = useState("");
  const closeModal = () => {
    setIsShowModal("");
  };
  const { user } = useSelector((state) => state?.auth?.login);
  const dispatch = useDispatch();
  const getUserByUserId = (dispatch) => {
    refreshUserFetch(dispatch);
  };

  useEffect(() => {
    getUserByUserId(dispatch);
  }, [dispatch]);
  return (
    <div className="edit-profile-container">
      <h1 className="title">Chỉnh sửa thông tin cá nhân</h1>
      {user && (
        <div className="edit-profile-content grid-container">
          <div
            onClick={() => {
              setIsShowModal("avatar");
            }}
            className="avt-img"
          >
            <img
              className="img"
              src={user?.avatar ? user?.avatar : avtDefault}
              alt=""
            />
            <TbPhotoEdit className={"edit-icon"} />
          </div>
          <div className="info-list">
            <div className="info-item disable">
              <h4>Email</h4>
              <p>{user?.email}</p>
            </div>
            <div
              onClick={() => {
                setIsShowModal("name");
              }}
              className="info-item"
            >
              <h4>Họ tên</h4>
              <p>{user?.name}</p>
            </div>
            <div
              onClick={() => {
                setIsShowModal("username");
              }}
              className="info-item"
            >
              <h4>Username</h4>
              <p>{user?.username}</p>
            </div>
            <div
              onClick={() => {
                setIsShowModal("bio");
              }}
              className="info-item"
            >
              <h4>Nghề nghiệp</h4>
              <p>{user?.bio}</p>
            </div>
            <div
              onClick={() => {
                setIsShowModal("social");
              }}
              className="info-item"
            >
              <h4>Mạng xã hội</h4>
              <div className="icon-list">
                {user.social.facebook && <img src={facebookIcon} alt="" />}
                {user.social.instagram && <img src={instagramIcon} alt="" />}
                {user.social.youtube && <img src={youtubeIcon} alt="" />}
                {user.social.tiktok && <img src={tiktokIcon} alt="" />}
                {!user.social.facebook &&
                  !user.social.instagram &&
                  !user.social.youtube &&
                  !user.social.tiktok && <p>Không có mạng xã hội</p>}
              </div>
            </div>
            <div
              onClick={() => {
                setIsShowModal("password");
              }}
              className="info-item"
            >
              <h4>Mật khẩu</h4>
              <div className="icon-list dot">
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
                <VscCircleLargeFilled size={8} />
              </div>
            </div>
          </div>
        </div>
      )}
      {(isShowModal === "name" ||
        isShowModal === "username" ||
        isShowModal === "bio") && (
        <Modal closeModal={closeModal}>
          <FullName status={isShowModal} closeModal={closeModal} />
        </Modal>
      )}
      {isShowModal === "password" && (
        <Modal closeModal={closeModal}>
          <ChangePassword closeModal={closeModal} />
        </Modal>
      )}
      {isShowModal === "social" && (
        <Modal closeModal={closeModal}>
          <ChangeSocial closeModal={closeModal} />
        </Modal>
      )}
      {isShowModal === "avatar" && (
        <Modal closeModal={closeModal}>
          <ChangeAvatar closeModal={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default EditProfile;
