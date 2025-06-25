import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaChalkboardTeacher, FaUsers, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import Logo from "../assets/edu.jpg";

const Sidebar = () => {
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
      {/* Hamburger Icon (Mobile Only) */}
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-white rounded-md shadow md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars className="text-purple-700" />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-blue-950 text-white transform transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-blue-900 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full border-2 border-white shadow" />
            <h1 className="text-xl font-bold">EduStream</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavLink
            to="/teacher-dashboard"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
                isActive ? "bg-blue-800 border-l-4 border-white" : "hover:bg-blue-900"
              }`
            }
          >
            <FaChalkboardTeacher />
            Dashboard
          </NavLink>

          <NavLink
            to="/students"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
                isActive ? "bg-blue-800 border-l-4 border-white" : "hover:bg-blue-900"
              }`
            }
          >
            <FaUsers />
            Students
          </NavLink>

          <NavLink
            to="/logout"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-blue-900 font-medium"
          >
            <FaSignOutAlt />
            Logout
          </NavLink>
        </nav>
      </div>

      {/* Static Sidebar for md+ */}
      <div className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed md:left-0 md:top-0 bg-blue-950 text-white shadow-lg z-30">
        <div className="flex items-center gap-3 px-6 py-5 bg-blue-900 border-b border-blue-800">
          <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full border-2 border-white shadow" />
          <h1 className="text-xl font-bold">EduStream</h1>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavLink
            to="/teacher-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
                isActive ? "bg-blue-800 border-l-4 border-white" : "hover:bg-blue-900"
              }`
            }
          >
            <FaChalkboardTeacher />
            Dashboard
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition ${
                isActive ? "bg-blue-800 border-l-4 border-white" : "hover:bg-blue-900"
              }`
            }
          >
            <FaUsers />
            Students
          </NavLink>

          <NavLink
            to="/logout"
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-blue-900 font-medium"
          >
            <FaSignOutAlt />
            Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
