import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  const authToken = Cookies.get("access_token");

  if (!currentUser || !authToken) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
