import React, { useState, useEffect } from "react";
import { BsArrowUp } from "react-icons/bs";
import "./BackToTopButton.scss";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`back-to-top ${isVisible ? "visible" : ""}`}>
      <button onClick={scrollToTop}>
        <BsArrowUp />
      </button>
    </div>
  );
};

export default BackToTopButton;
