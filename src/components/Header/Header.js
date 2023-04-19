import React from "react";
import "./Header.scss";
import { Link, useLocation } from "react-router-dom";
import { MENU_ITEMS } from "../../constants/routes";
import LogoHorizontal from "../../assets/images/LogoHorizontal.png";
import { FaRegUser, FaRegEdit } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";

const Header = () => {
  const [fix, setFix] = useState(false);
  const setFixed = () => {
    if (window.pageYOffset  > 10) {
      setFix(true);
    } else {
      setFix(false);
    }
  };

  window.addEventListener("scroll", setFixed);
  const location = useLocation();
  return (
    <div className={`header-container${fix ? " header-fixed" : ""}`}>
      <div className="menu-bar grid-container">
        <Link to="/">
          <img src={LogoHorizontal} alt="GaFast" />
        </Link>
        <ul>
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
          <button>
            Viết bài <FaRegEdit className="write-icon" />
          </button>
          <Link>
            <FiSearch className={"icon-search"} />
          </Link>
          <Link>
            <FaRegUser className={"icon-user"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
