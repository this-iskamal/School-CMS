import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="bg-white w-full h-screen flex flex-col ">
      <Navbar />
      <h1 className="text-center  text-gray-500 text-6xl font-extrabold m-3">
        404
      </h1>
      <h1 className="text-center  text-gray-500 text-6xl font-extrabold">
        Page not found
      </h1>
      <p
        onClick={() => {
          navigate("/");
        }}
        className="text-md font-bold  text-gray-900 cursor-pointer  px-3 py-1 bg-gray-200  hover:underline text-center mt-10"
      >
        Redirect to home
      </p>
    </div>
  );
}
