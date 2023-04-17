import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ROUTES from "../constants/routes";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {Object.values(ROUTES).map((route, index) => {
          if (route.isPrivate) {
            return (
              <PrivateRoute
                path={route.path}
                exact
                element={
                  <route.layout>
                    <route.component />
                  </route.layout>
                }
                key={index}
              />
            );
          }

          return (
            <Route
              path={route.path}
              exact
              element={
                <route.layout>
                  <route.component />
                </route.layout>
              }
              key={index}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
