import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import * as Icon from "react-feather";
import Cookies from "js-cookie";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove("access_token");
    dispatch(signOutSuccess());
    navigate("/sign-in");
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full sm:max-w-xs sm:border-r-2">
        <h1 className="text-sm font-semibold mx-5 mt-3 text-gray-700">
          Content
        </h1>
        <div
          className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => {
            navigate("/recentnotices");
          }}
        >
          <p className="text-sm font-semibold text-gray-700">Recent Notices</p>
          <Icon.ChevronRight className="text-gray-400 h-4" />
        </div>
        <div
          className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => {
            navigate("/news");
          }}
        >
          <p className="text-sm font-semibold text-gray-700">News</p>
          <Icon.ChevronRight className="text-gray-400 h-4" />
        </div>
        <div
          className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => {
            navigate("/carusel");
          }}
        >
          <p className="text-sm font-semibold text-gray-700">Carousel</p>
          <Icon.ChevronRight className="text-gray-400 h-4" />
        </div>
        <div
          className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => {
            navigate("/gallery");
          }}
        >
          <p className="text-sm font-semibold text-gray-700">Gallery</p>
          <Icon.ChevronRight className="text-gray-400 h-4" />
        </div>
        <div
          className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => {
            navigate("/teachers");
          }}
        >
          <p className="text-sm font-semibold text-gray-700">Teachers</p>
          <Icon.ChevronRight className="text-gray-400 h-4" />
        </div>

        <hr className="my-4 mx-3 border-gray-300" />

        <div
          className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2"
          onClick={handleLogout}
        >
          <p className="text-sm font-semibold text-gray-700">Logout</p>
          <Icon.LogOut className="text-gray-400 h-4" />
        </div>
      </div>
    </div>
  );
}
