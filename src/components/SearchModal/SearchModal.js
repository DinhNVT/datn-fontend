import React, { useEffect, useState } from "react";
import "./SearchModal.scss";
import { Link, useNavigate } from "react-router-dom";
import { TfiClose } from "react-icons/tfi";
import { FiSearch } from "react-icons/fi";
import ROUTES from "../../constants/routes";

const SearchModal = (props) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [errorInput, setErrorInput] = useState("");
  useEffect(() => {
    setErrorInput("")
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        props.closeModalSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [props]);

  const handleKeywordChange = (e) => {
    const fullName = e.target.value;
    setKeyword(fullName);
    if (fullName.length > 1000) {
      setErrorInput("Nhập từ khóa không hợp lệ");
    } else {
      setErrorInput("");
    }
  };

  const handleInputConfirm = () => {
    if (!keyword) {
      setErrorInput("Hãy nhập từ khóa");
    } else {
      navigate(`${ROUTES.POST_SEARCH_PAGE.path}?s=${keyword}`);
      props.closeModalSearch();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleInputConfirm();
    }
  };

  return (
    <div
      className={`search-modal-container${props.isShowSearch ? " show" : ""}`}
    >
      <TfiClose onClick={props.closeModalSearch} className="close" />
      <div className="search-modal-content">
        <div className="input-search">
          <h1>Tìm kiếm bài viết</h1>
          <div className="input-bar">
            <input
              size="40"
              className="input"
              aria-required="true"
              aria-invalid="true"
              value={keyword}
              onChange={handleKeywordChange}
              onKeyDown={handleKeyDown}
              type="text"
              name="keyword"
              placeholder="Nhập từ khóa"
              required
            />
            <FiSearch onClick={handleInputConfirm} className="icon-search" />
          </div>
          {!!errorInput && (
            <span className="error-text" aria-hidden="true">
              {errorInput}
            </span>
          )}
          {/* <div className="suggest-container">
            <div className="suggest-item">
              <img
                src="https://thuthuatnhanh.com/wp-content/uploads/2021/11/hinh-anh-chill-dep.jpg"
                alt=""
              />
              <h4>
                {" "}
                Ổi trồng trong nhà Ổi trồng trong nhàỔi trồng trong nhà Ổi trồng
                trong nhà
              </h4>
            </div>
            <div className="suggest-item">
              <img
                src="https://thuthuatnhanh.com/wp-content/uploads/2021/11/hinh-anh-chill-dep.jpg"
                alt=""
              />
              <h4>Ổi trồng trong nhà Ổi trồng trong nhà</h4>
            </div>
          </div> */}
        </div>
        <div className="or-keyword">
          <h3>Hoặc tìm kiếm bằng từ khóa...</h3>
          <div className="tags">
            <Link className={`item-tag tag-1`}>
              <span># </span>
              Tag 1
            </Link>
            <Link className={`item-tag tag-2`}>
              <span># </span>
              Tag 1
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
