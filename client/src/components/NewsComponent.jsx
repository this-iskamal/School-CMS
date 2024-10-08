import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify"; 
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

export default function NewsComponent({news}) {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    author:"",
    images: [],
    imageUrls: [],
  });

  const [newss, setNewss] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  console.log(news)

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        slug: news.slug || "",
        content: news.content || "",
        author: news.author || "",
        images: [],
        imageUrls: news.images || [], 
      });
      setNewss(news.content || "");
      if (news.images) {
        setImagePreviews(news.images);
        setUploadProgress(Array(news.images.length).fill(100));
      }
    }
  }, [news]);

  useEffect(() => {
    const isValid =
      (formData.title || "").trim() !== "" &&
      (formData.slug || "").trim() !== "" &&
      (formData.author || "").trim() !== ""&&
      (newss || "").trim() !== "" &&
      (formData.images.length > 0 || imagePreviews.length > 0) &&
      uploadProgress.every((progress) => progress === 100);

    setIsFormValid(isValid);
  }, [formData, newss, uploadProgress, imagePreviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map((file) => file);
    setImagePreviews([...imagePreviews, ...newImagePreviews]);
    setFormData({ ...formData, images: [...formData.images, ...files] });
    setUploadProgress([...uploadProgress, ...Array(files.length).fill(0)]);

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadstart = () =>
        updateProgress(uploadProgress.length + index, 0);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          updateProgress(uploadProgress.length + index, progress);
        }
      };
      reader.onloadend = () =>
        updateProgress(uploadProgress.length + index, 100);
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

  const handleRemoveImage = (index) => {
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
    const newUploadProgress = uploadProgress.filter((_, i) => i !== index);

    setImagePreviews(newImagePreviews);
    setFormData({ ...formData, images: newImages, imageUrls: newImageUrls }); 
    setUploadProgress(newUploadProgress);
  };

  const handleGenerateClick = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      slug: formData.title.toLowerCase().replace(/ /g, "-"),
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (isPublishing) return; 

    setIsPublishing(true);

    const newsData = new FormData();
    newsData.append("title", formData.title);
    newsData.append("slug", formData.slug);
    newsData.append("author",formData.author)
    newsData.append("content", newss);
    formData.images.forEach((image) => {
      newsData.append("images", image);
    });
    newsData.append(
      "imageUrls",
      JSON.stringify(imagePreviews.filter((image) => typeof image === "string"))
    );

    try {
      const response = await fetch(
        `/api/news/updatenews/${news._id}/${currentUser._id}`,
        {
          method: "PUT",
          body: newsData,
        }
      );

      if (response.ok) {
        toast.success("News published successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Failed to publish news");

      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to publish news");

    }finally {
      setIsPublishing(false); 
    }
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/news/deletenews/${news._id}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        console.log(data.message);
      } else {
        setDeleteModal(false);
        navigate("/news");
      }
    } catch (error) {
      console.error("Error:", error);
      console.error("Error:", error);

    }
  };

  const handleSchedulePublish = () => {
    console.log("Schedule Publish clicked");
  };


  return (
    <div className="flex flex-col h-full">
    <ToastContainer />
    <div className="flex flex-row justify-between px-4 py-5 border-b-2">
      <h1 className="text-sm font-semibold text-black">This is the news</h1>
      <Icon.X
        size={20}
        color="gray"
        strokeWidth={2}
        className="cursor-pointer"
        onClick={() => navigate("/news")}
      />
    </div>
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 px-16 my-5 flex flex-col items-start">
      <h1 className="text-gray-600 text-sm font-normal">News</h1>
      <p className="text-3xl font-bold w-full mt-3">This is the news</p>
      <form
        className="mt-16 flex flex-col w-full gap-16"
        onSubmit={handlePublish}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="newsTitle"
            className="text-gray-900 text-md font-semibold"
          >
            News Title
          </label>
          <input
            type="text"
            name="title"
            id="newstitle"
            value={formData.title}
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
            htmlFor="newsTitle"
            className="text-gray-900 text-md font-semibold"
          >
            Author
          </label>
          <input
            type="text"
            name="title"
            id="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="recentNews"
            className="text-gray-900 text-md font-semibold"
          >
            Recent News
          </label>
          <ReactQuill
            theme="snow"
            className="h-72"
            value={newss}
            onChange={setNewss}
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
            {imagePreviews.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={
                    typeof image === "string"
                      ? `/${image}`
                      : URL.createObjectURL(image)
                  }
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
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Icon.X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
    <div className="flex flex-row justify-between items-center px-6 py-2 border-t-2">
      <h1 className="text-sm font-semibold">
        {news.createdAt
          ? `Published ${formatDistanceToNow(new Date(news.createdAt))} ago` 
          : "Not Published"}
      </h1>

      <div className="relative">
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
          <div onClick={handleToggleDropdown} className="cursor-pointer">
            <Icon.MoreHorizontal size={20} color="gray" strokeWidth={2} />
          </div>
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 -mt-28 w-36 bg-white border border-gray-300 rounded shadow-lg">
            <button
              className="block w-full px-4 py-2 text-sm text-left border-b text-gray-800 hover:bg-gray-100"
              onClick={()=>setDeleteModal(true)}
            >
              Delete
            </button>
            <button
              className="block w-full text-sm px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
              onClick={handleSchedulePublish}
            >
              Schedule Publish
            </button>
          </div>
        )}
      </div>
    </div>
    <Modal
      show={deleteModal}
      onClose={() => setDeleteModal(false)}
      popup
      size="md"
    >
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this news?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDelete}>
              Yes, I'm sure
            </Button>
            <Button color="gray" onClick={() => setDeleteModal(false)}>
              No, take me back
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>
  )
}
