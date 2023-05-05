import React, { useEffect } from "react";
import ROUTES from "../constants/routes";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = (props) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth?.login);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.HOME_PAGE.path);
    }
  }, [navigate, user]);

  return <>{props.children}</>;
};

export default PrivateRoute;
