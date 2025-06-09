import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChalkboardTeacher,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import Logo from '../assets/edu.jpg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
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

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 border-r transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Logo Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b">
          <img src={Logo} alt="Logo" className="h-10 w-10 rounded-full shadow" />
          <h1 className="text-xl font-bold text-purple-700 tracking-wide">EduStream</h1>
        </div>

        {/* Nav Links */}
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavLink
            to="/teacher-dashboard"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition hover:bg-purple-50 ${
                isActive
                  ? 'bg-purple-100 text-purple-800 font-semibold border-l-4 border-purple-500'
                  : 'text-gray-700'
              }`
            }
          >
            <FaChalkboardTeacher className="text-lg" /> Dashboard
          </NavLink>

          <NavLink
            to="/students"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition hover:bg-purple-50 ${
                isActive
                  ? 'bg-purple-100 text-purple-800 font-semibold border-l-4 border-purple-500'
                  : 'text-gray-700'
              }`
            }
          >
            <FaUsers className="text-lg" /> Students
          </NavLink>

          <NavLink
            to="/logout"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <FaSignOutAlt className="text-lg" /> Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
