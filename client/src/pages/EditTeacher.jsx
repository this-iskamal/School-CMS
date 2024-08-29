import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as Icon from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TeacherComponent from "../components/TeacherComponent";

function EditTeacher() {
  const { currentUser } = useSelector((state) => state.user);
  const [teachers, setTeachers] = useState([]);
  const [teacher, setTeacher] = useState({});
  const { teacherId } = useParams();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("/api/teachers/getteachers");
        const data = await response.json();
        setTeachers(data.teachers);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchTeacher = async () => {
      try {
        const response = await fetch(
          `/api/teachers/getteachers?teacherId=${teacherId}`
        );
        const data = await response.json();
        setTeacher(data.teachers[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeachers();
    fetchTeacher();
  }, [currentUser._id, teacherId]);
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full h-screen flex flex-col">
    <Navbar />
    <div className="flex flex-row flex-1 overflow-hidden">
      <Sidebar select={"teachers"} />
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
            <h1 className="text-sm font-semibold">Teachers</h1>
          </div>
          <div className="flex flex-row gap-3">
            <Icon.Plus
              size={20}
              color="gray"
              strokeWidth={1.5}
              className="cursor-pointer"
              onClick={() => navigate("/teachers/createteacher")}
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
          {teachers &&
            teachers.map((teacher) => (
              <div
              key={teacher._id}
                onClick={() => navigate(`/teachers/${teacher._id}`)}
                className="p-1 border border-transparent cursor-pointer hover:bg-gray-100 text-sm text-gray-900 flex flex-row items-center transition duration-100"
              >
                <img
                  src={`/${teacher.profilePicture}`}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="  line-clamp-1 px-1 text-sm text-gray-800">
                    {teacher.name}
                  </p>
                  <p className="line-clamp-1 px-1 text-xs text-gray-600">
                    <span className="">Position :</span>
                    {teacher.position}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <TeacherComponent teacher={teacher}/>
      </div>
    </div>
  </div>
  );
}

export default EditTeacher;
