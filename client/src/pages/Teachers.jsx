import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Teachers() {
  return (
    <div className="bg-white w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-row ">
        <Sidebar select={"teacher"}/>
       <div className=""></div>
      </div>
    </div>
  );
}
