import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as Icon from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CarouselComponent from "../components/CarouselComponent";

function EditCarousel() {

  const { currentUser } = useSelector((state) => state.user);
  const [carousels, setCarousels] = useState([]);
  const [carousel , setCarousel] = useState({});
  const {carouselId} = useParams();

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const response = await fetch("/api/carouselitems/getcarousels");
        const data = await response.json();
        setCarousels(data.carousel);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchCarousel = async () => {
      try {
        const response = await fetch(`/api/carouselitems/getcarousels?carouselId=${carouselId}`);
        const data = await response.json();
        setCarousel(data.carousel[0]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCarousels();
    fetchCarousel();
  }, [currentUser._id,carouselId]);
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar select={"carusel"} />
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
              <h1 className="text-sm font-semibold">Carousels</h1>
            </div>
            <div className="flex flex-row gap-3">
              <Icon.Plus
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={()=>navigate("/carusel/createcarousel")}
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
            {carousels &&
              carousels.map((carousel) => (
                <div
                key={carousel._id}
                  onClick={() => navigate(`/carusel/${carousel._id}`)}
                  className="p-1 border border-transparent cursor-pointer hover:bg-gray-100 text-sm text-gray-900 flex flex-row items-center transition duration-100"
                >
                  <img
                    src={`/${carousel.images[0]}`}
                    alt=""
                    className="h-10 w-10"
                  />
                  <div className="flex-1">
                    <p className="  line-clamp-1 px-1 text-sm text-gray-800">
                      {carousel.description}
                    </p>
                    <p className="line-clamp-1 px-1 text-xs text-gray-600">
                      <span className="">Slug :</span>
                      {carousel.slug}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <CarouselComponent carousel={carousel}/>
        </div>
      </div>
    </div>
  )
}

export default EditCarousel
