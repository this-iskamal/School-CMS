import React, { useState } from "react";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function NoticeComponent() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => prevImages.concat(filesArray));
      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };

  const handlegenerateclick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-between px-4 py-5 border-b-2">
        <h1 className="text-sm font-semibold text-black">This is the notice</h1>
        <Icon.X
          size={20}
          color="gray"
          strokeWidth={2}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 px-16 my-5 flex flex-col items-start">
        <h1 className="text-gray-600 text-sm font-normal">Recent Notice</h1>
        <p className="text-3xl font-bold w-full mt-3">This is the notice</p>
        <form className="mt-16 flex flex-col w-full gap-16">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-gray-900 text-md font-semibold">
              Notice Title
            </label>
            <input
              type="text"
              name=""
              id=""
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-gray-900 text-md font-semibold">
              Slug
            </label>
            <div className="flex flex-row gap-1">
              <input
                type="text"
                name=""
                id=""
                className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
              />
              <button
                className="px-2 py-1 border-2 rounded-sm bg-gray-100"
                onClick={handlegenerateclick}
              >
                <span className="text-xs font-semibold">Generate</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-gray-900 text-md font-semibold">
              Recent Notice
            </label>
            <ReactQuill theme="snow" className="h-72 " />
            <input
              type="text"
              name=""
              id=""
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="imageUpload"
              className="text-gray-900 text-md font-semibold"
            >
              Image
            </label>
            <input
              type="file"
              id="imageUpload"
              multiple
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
              onChange={handleImageChange}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`upload-${index}`}
                  className="h-20 w-20 object-cover rounded-sm"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-gray-900 text-md font-semibold">
              Image
            </label>
            <input
              type="text"
              name=""
              id=""
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
            />
          </div>
        </form>
      </div>
      <div className="flex flex-row justify-between items-center px-6 py-2 border-t-2">
        <h1 className="text-sm font-semibold">Not Published</h1>
        <div className="flex flex-row items-center gap-2">
          <button
            className="px-2 py-1 border-2 rounded-sm bg-gray-100 flex flex-row items-center gap-1"
            onClick={handlegenerateclick}
          >
            <Icon.ArrowUp size={20} color="gray" strokeWidth={2} />
            <span className="text-xs font-semibold">Publish</span>
          </button>
          <Icon.MoreHorizontal size={20} color="gray" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
