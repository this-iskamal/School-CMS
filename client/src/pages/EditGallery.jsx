import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as Icon from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import GalleryComponent from "../components/GalleryComponent";

function EditGallery() {
    const { currentUser } = useSelector((state) => state.user);
    const [gallerys, setGallerys] = useState([]);
    const [gallery , setGallery] = useState({});
    const {galleryId} = useParams();

    useEffect(() => {
        const fetchGallerys = async () => {
          try {
            const response = await fetch("/api/gallery/getgallery");
            const data = await response.json();
            setGallerys(data.gallery);
          } catch (error) {
            console.error(error);
          }
        };
        const fetchGallery = async () => {
          try {
            const response = await fetch(`/api/gallery/getgallery?galleryId=${galleryId}`);
            const data = await response.json();
            setGallery(data.gallery[0]);
          } catch (error) {
            console.error(error);
          }
        }
        fetchGallerys();
        fetchGallery();
      }, [currentUser._id,galleryId]);

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar select={"gallery"} />
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
              <h1 className="text-sm font-semibold">Gallery</h1>
            </div>
            <div className="flex flex-row gap-3">
              <Icon.Plus
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={()=>navigate("/gallery/creategallery")}
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
            {gallerys &&
              gallerys.map((gallery) => (
                <div
                key={gallery._id}
                  onClick={() => navigate(`/gallery/${galleryId._id}`)}
                  className="p-1 border border-transparent cursor-pointer hover:bg-gray-100 text-sm text-gray-900 flex flex-row items-center transition duration-100"
                >
                  <img
                    src={`/${gallery.images[0]}`}
                    alt=""
                    className="h-10 w-10"
                  />
                  <div className="flex-1">
                    <p className="  line-clamp-1 px-1 text-sm text-gray-800">
                      {gallery.description}
                    </p>
                    <p className="line-clamp-1 px-1 text-xs text-gray-600">
                      <span className="">Slug :</span>
                      {gallery.slug}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <GalleryComponent gallery={gallery}/>
        </div>
      </div>
    </div>
  )
}

export default EditGallery
