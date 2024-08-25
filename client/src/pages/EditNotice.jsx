import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as Icon from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import NoticeComponent from "../components/NoticeComponent";
import { useSelector } from "react-redux";

export default function EditNotice() {
  const { currentUser } = useSelector((state) => state.user);
  const [notices, setNotices] = useState([]);
  const [notice , setNotice] = useState({});
  const {noticeId} = useParams();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch("/api/recentnotices/getnotices");
        const data = await response.json();
        setNotices(data.notices);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchNotice = async () => {
      try {
        const response = await fetch(`/api/recentnotices/getnotices?noticeId=${noticeId}`);
        const data = await response.json();
        setNotice(data.notices[0]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNotices();
    fetchNotice();
  }, [currentUser._id,noticeId]);
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar select={"recentnotices"} />
        <div className="hidden sm:flex flex-col w-full sm:max-w-sm sm:border-r-2">
          <div className="p-3 flex flex-row justify-between items-center">
            <div className="flex flex-row flex-1 gap-2">
              <Icon.ArrowLeft
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer md:hidden"
                onClick={() => navigate(-1)}
              />
              <h1 className="text-sm font-semibold">Recent Notices</h1>
            </div>
            <div className="flex flex-row gap-3">
              <Icon.Plus
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                
              />
              <Icon.MoreHorizontal
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="relative mx-3 my-1 px-1 border flex items-center focus-within:border-blue-500 rounded-md">
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <Icon.Search
                size={14}
                color="gray"
                strokeWidth={1.5}
                className="cursor-text"
              />
            </div>
            <input
              placeholder="Search"
              className="w-full pl-8 pr-2 py-1 outline-none text-sm border-none"
            />
          </div>
          <div className="mt-4 mx-3 flex flex-col gap-2 overflow-auto">
            {notices &&
              notices.map((notice) => (
                <div
                key={notice._id}
                  onClick={() => navigate(`/recentnotices/${notice._id}`)}
                  className="p-1 border border-transparent cursor-pointer hover:bg-gray-100 text-sm text-gray-900 flex flex-row items-center transition duration-100"
                >
                  <img
                    src={`/${notice.images[0]}`}
                    alt=""
                    className="h-10 w-10"
                  />
                  <div className="flex-1">
                    <p className="  line-clamp-1 px-1 text-sm text-gray-800">
                      {notice.title}
                    </p>
                    <p className="line-clamp-1 px-1 text-xs text-gray-600">
                      <span className="">Slug :</span>
                      {notice.slug}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <NoticeComponent notice={notice}/>
        </div>
      </div>
    </div>
  );
}
