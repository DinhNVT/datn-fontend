import React from "react";
import "./NoHeaderLayout.scss";
import Header from "../../components/Header/Header";

const NoHeaderLayout = (props) => {
  return (
    <div className="no-header-layout">
      <Header />
      <div className="no-header-children">{props.children}</div>
    </div>
  );
};

export default NoHeaderLayout;
