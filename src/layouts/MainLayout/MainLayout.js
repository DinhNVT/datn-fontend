import React from "react";
import "./MainLayout.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const MainLayout = (props) => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-children">{props.children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
