import React from "react";
import "./NotFoundPage.scss";
import Img404 from "../../assets/images/404.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="img">
          <img src={Img404} alt="" />
        </div>
        <div className="text">
          <h1>ERROR 404</h1>
          <p>PAGE NOT FOUND!</p>
          <p>Oops! Looks like something wrong. We are working on it. Sorry!</p>
          <div className="btn-home">
            <Link to={"/"}>
              Home <BsArrowRight className={"icon"} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
