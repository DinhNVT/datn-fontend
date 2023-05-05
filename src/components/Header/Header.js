import React, { useState, useRef, useEffect } from "react";
import "./Header.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "../../constants/routes";
import LogoHorizontal from "../../assets/images/LogoHorizontal.png";
import { FaRegUser, FaRegEdit } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Modal from "../Modal/Modal";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
import { useDispatch, useSelector } from "react-redux";
import { registerReset, forgetReset } from "../../stores/authNotSaveSlice";
import avtDefault from "../../assets/images/avatar_default.png";
import AvtDropDown from "./AvtDropDown/AvtDropDown";
import { clearErrorLogin } from "../../stores/authSlice";
import ROUTES from "../../constants/routes";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fix, setFix] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForget, setIsForget] = useState(false);

  const { user } = useSelector((state) => state?.auth?.login);
  const setFixed = () => {
    if (window.pageYOffset > 10) {
      setFix(true);
    } else {
      setFix(false);
    }
  };

  const showLogin = () => {
    setIsLogin(true);
    setIsSignUp(false);
    setIsForget(false);
    dispatch(registerReset());
    dispatch(forgetReset());
  };

  const showSignUp = () => {
    setIsSignUp(true);
    setIsLogin(false);
    setIsForget(false);
  };

  const showForget = () => {
    setIsForget(true);
    setIsSignUp(false);
    setIsLogin(false);
  };

  const showModal = () => {
    setIsLogin(true);
    dispatch(registerReset());
    dispatch(forgetReset());
    dispatch(clearErrorLogin());
  };

  const closeModal = () => {
    dispatch(registerReset());
    dispatch(forgetReset());
    dispatch(clearErrorLogin());
    setIsLogin(false);
    setIsSignUp(false);
    setIsForget(false);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  function handleAvatarClick() {
    setShowDropdown(!showDropdown);
  }

  window.addEventListener("scroll", setFixed);
  const location = useLocation();
  return (
    <div className="header-base">
      <div className={`header-container${fix ? " header-fixed" : ""}`}>
        <div className="menu-bar grid-container">
          <Link to="/">
            <img src={LogoHorizontal} alt="GaFast" />
          </Link>
          <ul className="ul-menu">
            {MENU_ITEMS.map((item) => (
              <li
                key={item.link}
                className={location.pathname === item.link ? "active" : ""}
              >
                <Link to={item.link}>{item.name}</Link>
              </li>
            ))}
          </ul>
          <div className="right-header">
            {!!user && location.pathname !== ROUTES.WRITE_PAGE.path ? (
              <button
                onClick={() => {
                  navigate(ROUTES.WRITE_PAGE.path);
                }}
              >
                Viết bài <FaRegEdit className="write-icon" />
              </button>
            ) : undefined}

            <Link>
              <FiSearch className={"icon-search"} />
            </Link>
            {!!user ? (
              <div className="user-avt" ref={dropdownRef}>
                <Link className="btn-avt">
                  <img
                    onClick={handleAvatarClick}
                    src={user.avatar ? user.avatar : avtDefault}
                    alt={user?.name}
                  />
                </Link>
                {showDropdown && (
                  <AvtDropDown
                    handleAvatarClick={handleAvatarClick}
                    user={user}
                  />
                )}
              </div>
            ) : (
              <Link onClick={showModal}>
                <FaRegUser className={"icon-user"} />
              </Link>
            )}
          </div>
        </div>
      </div>
      {isLogin && (
        <Modal closeModal={closeModal}>
          <Login
            closeModal={closeModal}
            showForget={showForget}
            showSignUp={showSignUp}
          />
        </Modal>
      )}
      {isSignUp && (
        <Modal closeModal={closeModal}>
          <SignUp
            closeModal={closeModal}
            showForget={showForget}
            showLogin={showLogin}
          />
        </Modal>
      )}
      {isForget && (
        <Modal closeModal={closeModal}>
          <ForgetPassword closeModal={closeModal} showLogin={showLogin} />
        </Modal>
      )}
    </div>
  );
};

export default Header;
