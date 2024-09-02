import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify"; 
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

function CreateGallery() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    slug: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isValid =
      formData.slug.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.images.length > 0 &&
      uploadProgress.every((progress) => progress === 100);

    setIsFormValid(isValid);
  }, [formData, uploadProgress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
    setFormData({ ...formData, images: files });
    setUploadProgress(Array(files.length).fill(0));

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadstart = () => updateProgress(index, 0);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          updateProgress(index, progress);
        }
      };
      reader.onloadend = () => updateProgress(index, 100);
      reader.readAsDataURL(file);
    });
  };

  const updateProgress = (index, progress) => {
    setUploadProgress((prevProgress) => {
      const newProgress = [...prevProgress];
      newProgress[index] = progress;
      return newProgress;
    });
  };

  const handleGenerateClick = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      slug: formData.description.toLowerCase().replace(/ /g, "-"),
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (isPublishing) return;

    setIsPublishing(true);

    const galleryData = new FormData();
    galleryData.append("description", formData.description);
    galleryData.append("slug", formData.slug);
    formData.images.forEach((image) => {
      galleryData.append("images", image);
    });

    try {
      const response = await fetch("/api/gallery/addnewgallery", {
        method: "POST",
        body: galleryData,
      });

      if (response.ok) {
        toast.success("Gallery published successfully!");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        setError("Failed to publish carousel");
        if (response.message === "Unauthenticated User") {
          setError("Unauthenticated User. Please login to continue.");
          toast.error("Unauthenticated User. Please login to continue.");
          navigate("/sign-in");
        }

        console.log(response);
        toast.error("Error occurred while publishing the gallery.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred while publishing the gallery.");
    }finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ToastContainer />
      <div className="flex flex-row justify-between px-4 py-5 border-b-2">
        <h1 className="text-sm font-semibold text-black">
          This is the Gallery
        </h1>
        <Icon.X
          size={20}
          color="gray"
          strokeWidth={2}
          className="cursor-pointer"
          onClick={() => navigate("/gallery")}
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 px-16 my-5 flex flex-col items-start">
        <h1 className="text-gray-600 text-sm font-normal">Gallery</h1>
        <p className="text-3xl font-bold w-full mt-3">This is the Gallery</p>
        <form
          className="mt-16 flex flex-col w-full gap-16"
          onSubmit={handlePublish}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="noticeTitle"
              className="text-gray-900 text-md font-semibold"
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="slug"
              className="text-gray-900 text-md font-semibold"
            >
              Slug
            </label>
            <div className="flex flex-row gap-1">
              <input
                type="text"
                name="slug"
                id="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
              />
              <button
                className="px-2 py-1 border-2 rounded-sm bg-gray-100"
                onClick={handleGenerateClick}
              >
                <span className="text-xs font-semibold">Generate</span>
              </button>
            </div>
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
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`upload-${index}`}
                    className="h-20 w-20 object-cover rounded-sm"
                  />
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                    {uploadProgress[index] < 100 ? (
                      <div className="w-16 bg-gray-300 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${uploadProgress[index]}%` }}
                        ></div>
                      </div>
                    ) : (
                      <Icon.CheckCircle size={24} color="green" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-row justify-between items-center px-6 py-2 border-t-2">
        <h1 className="text-sm font-semibold">Not Published</h1>
        <div className="flex flex-row items-center gap-2">
          <button
            className={`px-2 py-1 border-2 rounded-sm flex flex-row items-center gap-1 ${
              isFormValid&&!isPublishing ? "bg-gray-100" : "bg-gray-300 cursor-not-allowed"
            }`}
            type="submit"
            disabled={!isFormValid||isPublishing}
            onClick={handlePublish}
          >
            <Icon.ArrowUp size={20} color="gray" strokeWidth={2} />
            <span className="text-xs font-semibold">{isPublishing?"Publishing...":"Publish"}</span>
          </button>
          <Icon.MoreHorizontal size={20} color="gray" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

export default CreateGallery;
