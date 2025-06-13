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
          className="text-blue-950 bg-white p-2 rounded-full shadow"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-950 shadow-lg z-50 border-r transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={20} className="text-white" />
          </button>
        </div>

        {/* Logo Header */}
        <div className="flex bg-blue-900 items-center gap-3 px-6 py-5 border-b border-blue-800">
          <img
            src={Logo}
            alt="Logo"
            className="h-10 w-10 rounded-full shadow border-2 border-white"
          />
          <h1 className="text-xl font-bold text-white tracking-wide">
            EduStream
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavLink
            to="/teacher-dashboard"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition font-medium ${
                isActive
                  ? 'bg-blue-800 text-white border-l-4 border-white'
                  : 'text-white hover:bg-blue-900'
              }`
            }
          >
            <FaChalkboardTeacher className="text-lg" /> Dashboard
          </NavLink>

          <NavLink
            to="/students"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition font-medium ${
                isActive
                  ? 'bg-blue-800 text-white border-l-4 border-white'
                  : 'text-white hover:bg-blue-900'
              }`
            }
          >
            <FaUsers className="text-lg" /> Students
          </NavLink>

          <NavLink
            to="/logout"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-blue-900 transition font-medium"
          >
            <FaSignOutAlt className="text-lg" /> Logout
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
