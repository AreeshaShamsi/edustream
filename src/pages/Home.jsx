import React from 'react';
import Pic from '../assets/climg.png';
import Navbar from '../components/Navbar';
import StatsSection from '../pages/StatsSection';
import '@fontsource/inter'; 
import Footer from '../components/Footer';
import About from '../pages/About';
import Testimonials from '../pages/Testimonials';


export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
        <Navbar />

        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-[60vh] md:min-h-[calc(100vh-80px)] px-4 sm:px-6 max-w-7xl mx-auto gap-6 md:gap-10">
          {/* Left content */}
          <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left">
            <p className="text-sm sm:text-base text-gray-500 mb-1 sm:mb-2">10K+ Users trust us</p>

           <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-snug sm:leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
  Best Online <br />
  <span className="relative inline-block">
    <span className="bg-yellow-200 absolute inset-x-0 bottom-0 h-[0.5em] z-0"></span>
    <span className="relative z-10">Classroom Platform</span>
  </span>
</h2>

            <p className="mt-3 text-xs sm:text-base md:text-lg text-gray-600 max-w-full md:max-w-md mx-auto md:mx-0 pl-4 border-l-4 border-purple-700">
              EduStream is the World's #1 Online Classroom Platform, specially designed for teachers and students to enhance learning together.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
  <button className="bg-blue-950 text-white px-6 py-3 rounded-lg font-medium text-base sm:text-sm w-full sm:w-auto hover:bg-blue-900 transition">
    Get Started
  </button>
  <button className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium text-base sm:text-sm w-full sm:w-auto hover:bg-gray-100 transition">
    Learn More
  </button>
</div>

          </div>

          {/* Right Image */}
          <div className="md:w-1/2 w-full flex justify-center">
            <img
              src={Pic}
              alt="3D Student"
              className="w-[220px] sm:w-[300px] md:w-[450px] lg:w-[500px] max-w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <StatsSection />
      <About />
      <Testimonials />
      
      {/* Footer */}
      <Footer />
     
    </>
  );
}
