import React from "react";
import { useNavigate } from "react-router-dom";
import * as Icon from "react-feather";

export default function Sidebar({ select }) {
  const navigation = useNavigate();
  return (
    <div className="hidden md:flex flex-col lg:flex-1 w-full sm:max-w-xs sm:border-r-2">
      <h1 className="text-sm font-semibold  mx-5 mt-3 text-gray-700">
        Content
      </h1>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "recentnotices" ? "#556BFC" : "" }}
        onClick={() => {
          navigation("/recentnotices");
        }}
      >
        <p
          className="text-sm font-semibold text-gray-700 "
          style={{ color: select === "recentnotices" ? "white" : "" }}
        >
          Recent Notices
        </p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "news" ? "#556BFC" : "" }}
        onClick={() => {
          navigation("/news");
        }}
      >
        <p
          className="text-sm font-semibold text-gray-700 "
          style={{ color: select === "news" ? "white" : "" }}
        >
          News
        </p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "carusel" ? "#556BFC" : "" }}
        onClick={() => {
          navigation("/carusel");
        }}
      >
        <p
          className="text-sm font-semibold text-gray-700 "
          style={{ color: select === "carusel" ? "white" : "" }}
        >
          Carousel
        </p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "gallery" ? "#556BFC" : "" }}
        onClick={() => {
          navigation("/gallery");
        }}
      >
        <p
          className="text-sm font-semibold text-gray-700 "
          style={{ color: select === "gallery" ? "white" : "" }}
        >
          Gallery
        </p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
      <div
        className="rounded-md mx-3 mt-2 flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 "
        style={{ backgroundColor: select === "teachers" ? "#556BFC" : "" }}
        onClick={() => {
          navigation("/teachers");
        }}
      >
        <p
          className="text-sm font-semibold text-gray-700 "
          style={{ color: select === "teachers" ? "white" : "" }}
        >
          Teachers
        </p>
        <Icon.ChevronRight className="text-gray-400 h-4" />
      </div>
    </div>
  );
}
