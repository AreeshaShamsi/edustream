import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FaBook, FaQuestionCircle, FaFileAlt, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import Logo from "../assets/edu.jpg";

const StudentSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on window resize (>= md)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Hamburger Icon (Mobile) */}
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-white rounded-md shadow md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="text-purple-700" />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40  bg-blue-950 text-white transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5  bg-blue-950 border-b  ">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full border-2 border-white shadow" />
            <h1 className="text-xl font-bold">EduStream</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white">
            <X size={24} />
          </button>
        </div>

        {/* Mobile Nav */}
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavLink
            to="/admin-dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
                isActive ? " bg-blue-950 border-l-4 border-white" : "hover: bg-blue-950"
              }`
            }
          >
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          

          <NavLink
            to="/logout"
            className="flex items-center gap-4 px-4 py-3 mt-4 rounded-lg hover: bg-blue-950 font-medium"
          >
            <FaSignOutAlt />
            Logout
          </NavLink>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed md:left-0 md:top-0  bg-blue-950 text-white shadow-lg z-30">
        <div className="flex items-center gap-3 px-6 py-5  bg-blue-950 border-b  ">
          <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full border-2 border-white shadow" />
          <h1 className="text-xl font-bold">EduStream</h1>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
                isActive ? " bg-blue-950 border-l-4 border-white" : "hover:bg-blue-950"
              }`
            }
          >
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          

          

          
          <NavLink
            to="/logout"
            className="flex items-center gap-2 px-4  mt-2 rounded-lg hover: bg-blue-950 font-medium"
          >
            <FaSignOutAlt />
            Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default StudentSidebar;
