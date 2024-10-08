import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Button, Modal, Toast } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

export default function NoticeComponent({ notice }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    images: [],
    imageUrls: [],
    pdfs: [],
    pdfUrls: [],
  });
  const [recentNotice, setRecentNotice] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreviews, setPdfPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || "",
        slug: notice.slug || "",
        content: notice.content || "",
        images: [],
        imageUrls: notice.images || [],
        pdfs: [],
        pdfUrls: notice.pdfs || [],
      });
      setRecentNotice(notice.content || "");
      if (notice.images) {
        setImagePreviews(notice.images);
        setUploadProgress(Array(notice.images.length).fill(100));
      }
      if (notice.pdfs) {
        setPdfPreviews(notice.pdfs);
      }
    }
  }, [notice]);

  useEffect(() => {
    const isValid =
      (formData.title || "").trim() !== "" &&
      (formData.slug || "").trim() !== "" &&
      (recentNotice || "").trim() !== "" &&
      uploadProgress.every((progress) => progress === 100);

    setIsFormValid(isValid);
  }, [formData, recentNotice, uploadProgress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newFilePreviews = files.map((file) => file);

    if (type === "image") {
      setImagePreviews([...imagePreviews, ...newFilePreviews]);
      setFormData({ ...formData, images: [...formData.images, ...files] });
    } else if (type === "pdf") {
      setPdfPreviews([...pdfPreviews, ...newFilePreviews]);
      setFormData({ ...formData, pdfs: [...formData.pdfs, ...files] });
    }

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

  const handleRemoveFile = (index, type) => {
    if (type === "image") {
      const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
      const newImages = formData.images.filter((_, i) => i !== index);
      const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
      const newUploadProgress = uploadProgress.filter((_, i) => i !== index);

      setImagePreviews(newImagePreviews);
      setFormData({ ...formData, images: newImages, imageUrls: newImageUrls });
      setUploadProgress(newUploadProgress);
    } else if (type === "pdf") {
      const newPdfPreviews = pdfPreviews.filter((_, i) => i !== index);
      const newPdfs = formData.pdfs.filter((_, i) => i !== index);
      const newPdfUrls = formData.pdfUrls.filter((_, i) => i !== index);
      const newUploadProgress = uploadProgress.filter((_, i) => i !== index);

      setPdfPreviews(newPdfPreviews);
      setFormData({ ...formData, pdfs: newPdfs, pdfUrls: newPdfUrls });
      setUploadProgress(newUploadProgress);
    }
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

    const noticeData = new FormData();
    noticeData.append("title", formData.title);
    noticeData.append("slug", formData.slug);
    noticeData.append("content", recentNotice);
    formData.images.forEach((image) => {
      noticeData.append("images", image);
    });
    formData.pdfs.forEach((pdf) => {
      noticeData.append("pdfs", pdf);
    });
    noticeData.append(
      "imageUrls",
      JSON.stringify(imagePreviews.filter((image) => typeof image === "string"))
    );
    noticeData.append(
      "pdfUrls",
      JSON.stringify(pdfPreviews.filter((pdf) => typeof pdf === "string"))
    );

    try {
      const response = await fetch(
        `/api/recentnotices/updatenotice/${notice._id}/${currentUser._id}`,
        {
          method: "PUT",
          body: noticeData,
        }
      );

      if (response.ok) {
        toast.success("Notice published successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Failed to publish notice");
      }
    } catch (error) {
      toast.error("Failed to publish notice");
      console.error("Error:", error);
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
        `/api/recentnotices/deletenotice/${notice._id}/${currentUser._id}`,
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
        navigate("/recentnotices");
      }
    } catch (error) {
      toast.error("Failed to delete notice");
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
        <h1 className="text-sm font-semibold text-black">This is the notice</h1>
        <Icon.X
          size={20}
          color="gray"
          strokeWidth={2}
          className="cursor-pointer"
          onClick={() => navigate("/recentnotices")}
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 px-16 my-5 flex flex-col items-start">
        <h1 className="text-gray-600 text-sm font-normal">Recent Notice</h1>
        <p className="text-3xl font-bold w-full mt-3">This is the notice</p>
        <form
          className="mt-16 flex flex-col w-full gap-16"
          onSubmit={handlePublish}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="noticeTitle"
              className="text-gray-900 text-md font-semibold"
            >
              Notice Title
            </label>
            <input
              type="text"
              name="title"
              id="noticeTitle"
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
              htmlFor="recentNotice"
              className="text-gray-900 text-md font-semibold"
            >
              Recent Notice
            </label>
            <ReactQuill
              theme="snow"
              className="h-72"
              value={recentNotice}
              onChange={setRecentNotice}
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
              onChange={(e) => handleFileChange(e, "image")}
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
                    onClick={() => handleRemoveFile(index, "image")}
                  >
                    <Icon.X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="pdfUpload"
              className="text-gray-900 text-md font-semibold"
            >
              PDFs
            </label>
            <input
              type="file"
              id="pdfUpload"
              multiple
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
              onChange={(e) => handleFileChange(e, "pdf")}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {pdfPreviews.map((image, index) => (
                <div key={index} className="relative">
                  <p className="text-sm mr-8 h-16">
                    {typeof image === "string"
                      ? image.split("\\").pop()
                      : image.name}
                  </p>
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
                    onClick={() => handleRemoveFile(index, "pdf")}
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
          {notice.createdAt
            ? `Published ${formatDistanceToNow(new Date(notice.createdAt))} ago`
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
                onClick={() => setDeleteModal(true)}
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
              Are you sure you want to delete this notice?
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
  );
}
