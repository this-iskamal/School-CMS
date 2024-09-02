import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Button, Modal, Toast } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";

function TeacherComponent({ teacher }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    position: "",
    phonenumber: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        position: teacher.position || "",
        address: teacher.address || "",
        phonenumber: teacher.phonenumber || "",
      });
    }
  }, [teacher]);

  useEffect(() => {
    const isValid =
      (formData.name || "").trim() !== "" &&
      (formData.position || "").trim() !== "" &&
      (formData.phonenumber || "").trim() !== "" &&
      (formData.address || "").trim() !== "";

    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (isPublishing) return;
    setIsPublishing(true);

    try {
      const response = await fetch(
        `/api/teachers/updateteacher/${teacher._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Techer published successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Failed to publish teacher");
      }
    } catch (error) {
      toast.error("Failed to publish teacher");

      console.error("Error:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/teachers/deleteteacher/${teacher._id}/${currentUser._id}`,
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
        navigate("/teachers");
      }
    } catch (error) {
      toast.error("Failed to delete teacher");

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
        <h1 className="text-sm font-semibold text-black">
          This is the teacher
        </h1>
        <Icon.X
          size={20}
          color="gray"
          strokeWidth={2}
          className="cursor-pointer"
          onClick={() => navigate("/teachers")}
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
        </form>
      </div>
      <div className="flex flex-row justify-between items-center px-6 py-2 border-t-2">
        <h1 className="text-sm font-semibold">
          {teacher.createdAt
            ? `Published ${formatDistanceToNow(
                new Date(teacher.createdAt)
              )} ago`
            : "Not Published"}
        </h1>

        <div className="relative">
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
                {isPublishing ? "Publishing" : "Publish"}
              </span>
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

export default TeacherComponent;
