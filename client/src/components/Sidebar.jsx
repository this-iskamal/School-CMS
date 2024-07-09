import React from "react";
import { useNavigate } from "react-router-dom";
import * as Icon from "react-feather";

export default function Sidebar({select}) {
  const navigation = useNavigate();
  return (
    <div className=" flex-1 w-full sm:max-w-xs sm:border-r-2">
      <h1 className="text-sm font-semibold  mx-5 mt-3 text-gray-700">
        Content
      </h1>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "recentnotices" ? "#f3f4f6" : ""}}
        onClick={() => {
          navigation("/recentnotices");
        }}
      >
        <p className="text-sm font-semibold text-gray-700 ">Recent Notices</p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "news" ? "#f3f4f6" : ""}}
        onClick={() => {
          navigation("/news");
        }}
      >
        <p className="text-sm font-semibold text-gray-700 ">News</p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "carusel" ? "#f3f4f6" : ""}}
        onClick={() => {
          navigation("/carusel");
        }}
      >
        <p className="text-sm font-semibold text-gray-700 ">Carousel</p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "gallery" ? "#f3f4f6" : ""}}
        onClick={() => {
          navigation("/gallery");
        }}
      >
        <p className="text-sm font-semibold text-gray-700 ">Gallery</p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "teachers" ? "#f3f4f6" : ""}}
        onClick={() => {
          navigation("/teachers");
        }}
      >
        <p className="text-sm font-semibold text-gray-700 ">Teachers</p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
    </div>
  );
}
