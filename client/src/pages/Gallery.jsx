import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Gallery() {
  const { currentUser } = useSelector((state) => state.user);
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/gallery/getgallery");
        const data = await response.json();
        setGallery(data.gallery);
        setFilteredGallery(data.gallery);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGallery();
  }, [currentUser._id]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = gallery.filter((item) =>
      item.description.toLowerCase().includes(term)
    );
    setFilteredGallery(filtered);
  };

  const sortGallery = (criteria) => {
    const sortedGallery = [...filteredGallery];
    if (criteria === "description") {
      sortedGallery.sort((a, b) => a.description.localeCompare(b.description));
    } else if (criteria === "created") {
      sortedGallery.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (criteria === "lastEdited") {
      sortedGallery.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    setFilteredGallery(sortedGallery);
    setSortCriteria(criteria);
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-row">
        <Sidebar select={"gallery"} />
        <div className={"flex-1 w-full sm:max-w-sm sm:border-r-2"}>
          <div className="p-3 flex flex-row justify-between items-center">
            <div className="flex flex-row flex-1 gap-2">
              <Icon.ArrowLeft
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer md:hidden"
                onClick={() => navigate("/")}
              />
              <h1 className="text-sm font-semibold">Gallery</h1>
            </div>

            <div className="flex flex-row gap-3 relative">
              <Icon.Plus
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={() => navigate("creategallery")}
              />
              <Icon.MoreHorizontal
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={() => setSortCriteria(!sortCriteria)}
              />
              {sortCriteria && (
                <div className="absolute top-5 -right-2 w-40 z-10 bg-white border shadow-md rounded-md flex flex-col gap-2">
                  <div
                    className="p-2 flex justify-start items-center flex-row mt-1 rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                    onClick={() => sortGallery("description")}
                  >
                    <Icon.Filter size={16} strokeWidth={1.5} className="mr-2" />
                    <span>Sort By Description</span>
                  </div>
                  <div
                    className="p-2 flex justify-start items-center flex-row rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                    onClick={() => sortGallery("created")}
                  >
                    <Icon.Filter size={16} strokeWidth={1.5} className="mr-2" />
                    <span>Sort By Created</span>
                  </div>
                  <div
                    className="p-2 flex justify-start items-center flex-row mb-1 rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                    onClick={() => sortGallery("lastEdited")}
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
              value={searchTerm}
              onChange={handleSearch} 
            />
          </div>
          <div className="mt-4 mx-3 flex flex-col gap-2">
            {filteredGallery &&
              filteredGallery.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`${item._id}`)}
                  className="p-1 border border-transparent cursor-pointer hover:bg-gray-100 text-sm text-gray-900 flex flex-row items-center transition duration-100"
                >
                  <img
                    src={`/${item.images[0]}`}
                    alt=""
                    className="h-10 w-10"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 px-1 text-sm text-gray-800">
                      {item.description}
                    </p>
                    <p className="line-clamp-1 px-1 text-xs text-gray-600">
                      <span className="">Slug :</span>
                      {item.slug}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
