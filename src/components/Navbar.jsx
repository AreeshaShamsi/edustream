import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../assets/edut.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-transparent border-b border-gray-200 px-4 sm:px-6 py-4 w-full mb-6">
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="logo"
            className="h-10 w-10 md:h-16 md:w-auto rounded-full object-contain shadow-sm"
          />
          <span className="text-2xl sm:text-base font-semibold text-blue-950">Edustream</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium text-base">
          {['Home', 'Courses', 'Pricing', 'Contact'].map((item) => (
            <li key={item} className="relative cursor-pointer group">
              {item}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </li>
          ))}
        </ul>

        {/* Login button (desktop only) */}
        <div className="hidden md:block">
          <Link to="/login">
            <button className="border border-blue-950 text-blue-950 px-5 py-2 rounded-lg hover:bg-purple-50 transition text-base">
              Login
            </button>
          </Link>
        </div>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-blue-950 focus:outline-none">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 text-gray-800 font-semibold text-lg px-2">
          {['Home', 'Courses', 'Pricing', 'Contact'].map((item) => (
            <div key={item} className="hover:text-purple-600 cursor-pointer">
              {item}
            </div>
          ))}

          {/* Login button in mobile */}
          <Link to="/login">
            <button className="border border-blue-950 text-blue-950 px-5 py-3 rounded-lg hover:bg-purple-50 transition w-full text-lg">
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
