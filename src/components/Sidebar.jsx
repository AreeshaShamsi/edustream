// components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChalkboardTeacher, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import Logo from '../assets/edu.jpg';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-blue-950 shadow-lg border-r transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}
    >
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

      <nav className="mt-6 flex flex-col gap-2 px-4">
        <NavLink
          to="/teacher-dashboard"
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
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-blue-900 transition font-medium"
        >
          <FaSignOutAlt className="text-lg" /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
