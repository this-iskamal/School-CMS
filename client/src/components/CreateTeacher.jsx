import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

function CreateTeacher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    address: "",
    phonenumber: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isValid =
      formData.name.trim() !== "" &&
      formData.position.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.phonenumber.trim() !== "" &&
      formData.image !== null &&
      uploadProgress === 100;

    setIsFormValid(isValid);
  }, [formData, uploadProgress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setFormData({ ...formData, image: file });
    setUploadProgress(0);

    const reader = new FileReader();
    reader.onloadstart = () => updateProgress(0);
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        updateProgress(progress);
      }
    };
    reader.onloadend = () => updateProgress(100);
    reader.readAsDataURL(file);
  };

  const updateProgress = (progress) => {
    setUploadProgress(progress);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (isPublishing) return;
    setIsPublishing(true);

    const teacherData = new FormData();
    teacherData.append("name", formData.name);
    teacherData.append("position", formData.position);
    teacherData.append("address", formData.address);
    teacherData.append("profilePicture", formData.image);
    teacherData.append("phonenumber", formData.phonenumber);

    try {
      const response = await fetch("/api/teachers/addnewteacher", {
        method: "POST",
        body: teacherData,
      });

      if (response.ok) {
        toast.success("Notice published successfully!");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        setError("Failed to publish teacher");
        if (response.message === "Unauthenticated User") {
          setError("Unauthenticated User. Please login to continue.");
          toast.error("Unauthenticated User. Please login to continue.");
          navigate("/sign-in");
        }

        console.log(response);
        toast.error("Error occurred while publishing the teacher.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error occurred while publishing the teacher.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ToastContainer />
      <div className="flex flex-row justify-between px-4 py-5 border-b-2">
        <h1 className="text-sm font-semibold text-black">
          This is the teacher
        </h1>
        <Icon.X
          size={20}
          color="gray"
          strokeWidth={2}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 px-16 my-5 flex flex-col items-start">
        <h1 className="text-gray-600 text-sm font-normal">Teachers</h1>
        <p className="text-3xl font-bold w-full mt-3">This is the teacher</p>
        <form
          className="mt-16 flex flex-col w-full gap-16"
          onSubmit={handlePublish}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="teacherName"
              className="text-gray-900 text-md font-semibold"
            >
              Teacher Name
            </label>
            <input
              type="text"
              name="name"
              id="teacherName"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-gray-900 text-md font-semibold"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="position"
              className="text-gray-900 text-md font-semibold"
            >
              Position
            </label>
            <input
              type="text"
              name="position"
              id="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="phonenumber"
              className="text-gray-900 text-md font-semibold"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phonenumber"
              id="phonenumber"
              value={formData.phonenumber}
              onChange={handleInputChange}
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
              className="w-full border-2 px-3 py-1 text-md text-gray-800 outline-blue-500 rounded-sm"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="upload"
                  className="h-20 w-20 object-cover rounded-sm"
                />
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                  {uploadProgress < 100 ? (
                    <div className="w-16 bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  ) : (
                    <Icon.CheckCircle size={24} color="green" />
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
      <div className="flex flex-row justify-between items-center px-6 py-2 border-t-2">
        <h1 className="text-sm font-semibold">Not Published</h1>
        <div className="flex flex-row items-center gap-2">
          <button
            className={`px-2 py-1 border-2 rounded-sm flex flex-row items-center gap-1 ${
              isFormValid && !isPublishing
                ? "bg-gray-100"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            type="submit"
            disabled={!isFormValid || isPublishing}
            onClick={handlePublish}
          >
            <Icon.ArrowUp size={20} color="gray" strokeWidth={2} />
            <span className="text-xs font-semibold">
              {isPublishing ? "Publishing..." : "Publish"}
            </span>
          </button>
          <Icon.MoreHorizontal size={20} color="gray" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

export default CreateTeacher;
