import React, { useState, useRef, useEffect } from "react";
import "./Header.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import SearchModal from "../SearchModal/SearchModal";
import { MdKeyboardArrowDown } from "react-icons/md";
import { getAllCategories } from "../../apis/category";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fix, setFix] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForget, setIsForget] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);

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

  //Search
  const showModalSearch = () => {
    setIsShowSearch(true);
  };

  const closeModalSearch = () => {
    setIsShowSearch(false);
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

  const getAllCategoriesPost = async () => {
    try {
      const res = await getAllCategories();
      if (res.data.sortedCategories.length > 0) {
        setCategories(res.data.sortedCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCategoriesPost();
  }, []);
  return (
    <div className="header-base">
      <SearchModal
        isShowSearch={isShowSearch}
        closeModalSearch={closeModalSearch}
      />
      <div className={`header-container${fix ? " header-fixed" : ""}`}>
        <div className="menu-bar grid-container">
          <Link to="/">
            <img src={LogoHorizontal} alt="GaFast" />
          </Link>
          <ul className="ul-menu">
            <li
              className={
                location.pathname.includes("/post") || location.pathname === "/"
                  ? "active"
                  : ""
              }
            >
              <Link to={"/"}>Bài viết</Link>
            </li>
            <li
              className={`category-menu ${
                location.pathname.includes("/category") ? "active" : ""
              }`}
            >
              Danh mục <MdKeyboardArrowDown size={24} className={"arrow"} />
              {categories.length > 0 && (
                <div className="category-list">
                  <ul>
                    {categories.map((category, index) => (
                      <Link
                        to={ROUTES.CATEGORY_PAGE.path.replace(
                          ":slug",
                          category.slug
                        )}
                        key={category._id}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li
              className={location.pathname.includes("/contact") ? "active" : ""}
            >
              <Link to={"/contact"}>Liên hệ</Link>
            </li>
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

            <Link
              onClick={(e) => {
                e.preventDefault();
                showModalSearch();
              }}
            >
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
