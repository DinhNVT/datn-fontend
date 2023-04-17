import React from "react";
import "./MainLayout.scss";

const MainLayout = (props) => {
  return (
    <div>
      <p>Header</p>
      {props.children}
      <p>Footer</p>
    </div>
  );
};

export default MainLayout;
