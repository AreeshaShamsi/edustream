import React from 'react';
import AboutImg from '../assets/edustream.png'; // Replace with your image

const About = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-neutral-100 py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">
        
        {/* Text Section */}
        <div className="backdrop-blur-md bg-white/60 p-8 rounded-2xl shadow-md">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-950 mb-6 leading-tight">
            Empower Your Learning <br /> with <span className="text-purple-600">EduStream</span>
          </h2>
          <p className="text-gray-700 text-lg mb-4">
            At EduStream, we redefine online education with curated content, expert instructors, and adaptive learning tools. Whether you're looking to upskill, explore, or kick-start your journey — we’ve got you covered.
          </p>
          <p className="text-gray-600 text-base">
            Our platform is designed to be intuitive, accessible, and future-ready. From bite-sized lessons to in-depth programs, we make knowledge convenient and inspiring.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-950 text-white rounded-lg hover:bg-purple-800 transition duration-300">
            Explore Courses
          </button>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={AboutImg}
            alt="About EduStream"
            className="w-full max-w-md rounded-xl shadow-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
