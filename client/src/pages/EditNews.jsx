import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as Icon from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NewsComponent from "../components/NewsComponent";

export default function EditNews() {
  const { currentUser } = useSelector((state) => state.user);
  const [news, setnews] = useState([]);
  const [newss, setnewss] = useState({});
  const { newsId } = useParams();
  const [options, setOptions] = useState(false);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchnews = async () => {
      try {
        const response = await fetch("/api/news/getnews");
        const data = await response.json();
        setnews(data.news);
        setFilteredNews(data.news);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchnewss = async () => {
      try {
        const response = await fetch(`/api/news/getnews?newsId=${newsId}`);
        const data = await response.json();
        setnewss(data.news[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchnews();
    fetchnewss();
  }, [currentUser._id, newsId]);
  const navigate = useNavigate();

  const sortNews = (criteria) => {
    const sortedNews = [...filteredNews];
    if (criteria === "title") {
      sortedNews.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criteria === "created") {
      sortedNews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (criteria === "lastEdited") {
      sortedNews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    setFilteredNews(sortedNews);
    setSortCriteria(criteria);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    const filtered = news.filter((news) =>
      news.title.toLowerCase().includes(term) ||
      news.slug.toLowerCase().includes(term)
    );
    console.log(filtered)
    setFilteredNews(filtered);
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar select={"news"} />
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
              <h1 className="text-sm font-semibold">News</h1>
            </div>
            <div className="flex flex-row gap-3 relative">
              <Icon.Plus
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={()=>navigate("/news/createnews")}
              />
              <Icon.MoreHorizontal
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={() => setOptions(!options)}
                />
                {options && (
                  <div className="absolute top-5 -right-2 w-40 z-10 bg-white border shadow-md rounded-md flex flex-col gap-2">
                    <div
                      className="p-2 flex justify-start items-center flex-row  mt-1 rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                      onClick={() => sortNews("title")}
                    >
                      <Icon.Filter size={16} strokeWidth={1.5} className="mr-2" />
                      <span>Sort By Title</span>
                    </div>
                    <div
                      className="p-2 flex justify-start items-center flex-row rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                      onClick={() => sortNews("created")}
                    >
                      <Icon.Filter size={16} strokeWidth={1.5} className="mr-2" />
                      <span>Sort By Created</span>
                    </div>
                    <div
                      className="p-2 flex justify-start items-center flex-row mb-1 rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                      onClick={() => sortNews("lastEdited")}
                    >
                      <Icon.Filter size={16} strokeWidth={1.5} className="mr-2" />
                      <span>Sort By Last Edited</span>
                    </div>
                  </div>
                )}
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
              onChange={handleSearch}

            />
          </div>
          <div className="mt-4 mx-3 flex flex-col gap-2 overflow-auto">
            {filteredNews &&
              filteredNews.map((newss) => (
                <div
                  key={newss._id}
                  onClick={() => navigate(`/news/${newss._id}`)}
                  className="p-1 border border-transparent cursor-pointer hover:bg-gray-100 text-sm text-gray-900 flex flex-row items-center transition duration-100"
                >
                  <img
                    src={`/${newss.images[0]}`}
                    alt=""
                    className="h-10 w-10"
                  />
                  <div className="flex-1">
                    <p className="  line-clamp-1 px-1 text-sm text-gray-800">
                      {newss.title}
                    </p>
                    <p className="line-clamp-1 px-1 text-xs text-gray-600">
                      <span className="">Slug :</span>
                      {newss.slug}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <NewsComponent news={newss} />
        </div>
      </div>
    </div>
  );
}
