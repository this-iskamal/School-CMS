import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import * as Icon from "react-feather";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Teachers() {
  const { currentUser } = useSelector((state) => state.user);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState(null); 

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("/api/teachers/getteachers");
        const data = await response.json();
        setTeachers(data.teachers);
        setFilteredTeachers(data.teachers); 
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeachers();
  }, [currentUser._id]);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(term) ||
      teacher.position.toLowerCase().includes(term)
    );
    setFilteredTeachers(filtered);
  };

  const sortTeachers = (criteria) => {
    const sortedTeachers = [...filteredTeachers];
    if (criteria === "name") {
      sortedTeachers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "position") {
      sortedTeachers.sort((a, b) => a.position.localeCompare(b.position));
    }
    setFilteredTeachers(sortedTeachers);
    setSortCriteria(criteria);

  };



  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-row">
        <Sidebar select={"teachers"} />
        <div className="flex-1 w-full sm:max-w-sm sm:border-r-2">
          <div className="p-3 flex flex-row justify-between items-center">
            <div className="flex flex-row flex-1 gap-2">
              <Icon.ArrowLeft
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer md:hidden"
                onClick={() => navigate("/")}
              />
              <h1 className="text-sm font-semibold">Teachers</h1>
            </div>

            <div className="flex flex-row gap-3 relative">
              <Icon.Plus
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={() => navigate("createteacher")}
              />
              <Icon.MoreHorizontal
                size={20}
                color="gray"
                strokeWidth={1.5}
                className="cursor-pointer"
                onClick={() => setSortCriteria(!sortCriteria)}
              />
              {sortCriteria && (
                <div className="absolute top-5 -right-2 w-40 z-10 bg-white border shadow-md rounded-md flex flex-col gap-2">
                  <div
                    className="p-2 flex justify-start items-center flex-row mt-1 rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                    onClick={() => sortTeachers("name")}
                  >
                    <Icon.Filter size={16} strokeWidth={1.5} className="mr-2" />
                    <span>Sort By Name</span>
                  </div>
                  <div
                    className="p-2 flex justify-start items-center flex-row mb-1 rounded-md text-gray-700 text-sm font-semibold hover:text-white hover:bg-blue-600 cursor-pointer"
                    onClick={() => sortTeachers("position")}
                  >
                    <Icon.Filter size={16} strokeWidth={1.5} className="mr-2" />
                    <span>Sort By Position</span>
                  </div>
                </div>
              )}
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
              value={searchTerm}
              onChange={handleSearch} 
            />
          </div>
          <div className="mt-4 mx-3 flex flex-col gap-2">
            {filteredTeachers &&
              filteredTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  onClick={() => navigate(`${teacher._id}`)}
                  className="p-1 border border-transparent cursor-pointer hover:bg-gray-100 text-sm text-gray-900 flex flex-row items-center transition duration-100"
                >
                  <img
                    src={`/${teacher.profilePicture}`}
                    alt=""
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 px-1 text-sm text-gray-800">
                      {teacher.name}
                    </p>
                    <p className="line-clamp-1 px-1 text-xs text-gray-600">
                      {teacher.position}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
