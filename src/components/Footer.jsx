import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-orange-50 to-neutral-100 py-10 px-4 sm:px-6 text-gray-900">
      <div className="max-w-6xl mx-auto text-center">

        {/* Brand */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-2">EduStream</h2>
        <p className="text-sm sm:text-base text-gray-800 mb-6 max-w-md mx-auto">
          Learn anywhere. Anytime. Empower your future with EduStream.
        </p>

        {/* Newsletter */}
        <form className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-6 px-4 sm:px-0">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition w-full sm:w-auto"
          >
            Subscribe
          </button>
        </form>

        {/* Social Media */}
        <div className="flex justify-center gap-5 mb-6 text-gray-950 text-lg">
          <a href="#" className="hover:text-gray-900 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-900 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-900 transition"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-900 transition"><FaYoutube /></a>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-6">
          <Link to="/about" className="hover:text-gray-900">About</Link>
          <Link to="/courses" className="hover:text-gray-900">Courses</Link>
          <Link to="/faq" className="hover:text-gray-900">FAQ</Link>
          <Link to="/contact" className="hover:text-gray-900">Contact</Link>
          <Link to="/privacy" className="hover:text-gray-900">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-900">Terms</Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} EduStream. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
