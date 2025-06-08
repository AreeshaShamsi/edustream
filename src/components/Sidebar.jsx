// Responsive Sidebar.jsx with fixed navbar height and overlay effect
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChalkboardTeacher, FaUsers, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Logo from '../assets/edu.jpg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="text-purple-700 bg-white p-2 rounded-full shadow"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md z-50 transition-transform transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 border-b flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-purple-700">Educate</h1>
        </div>

        <nav className="flex flex-col mt-6 space-y-2 px-4">
          <NavLink
            to="/teacher-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 ${
                isActive ? 'bg-purple-200 font-semibold text-purple-800' : 'text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaChalkboardTeacher /> Dashboard
          </NavLink>
          <NavLink
            to="/students"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-purple-100 ${
                isActive ? 'bg-purple-200 font-semibold text-purple-800' : 'text-gray-700'
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            <FaUsers /> Students
          </NavLink>
          <NavLink
            to="/logout"
            className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-100"
            onClick={() => setIsOpen(false)}
          >
            <FaSignOutAlt /> Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
