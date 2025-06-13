import React from 'react';

const StatsSection = () => {
  return (
    <section className="px-4 sm:px-6 py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Text Section */}
        <div className="mb-8 lg:mb-0 w-full lg:w-1/2">
          <div className="border-l-4 border-purple-700 pl-3 sm:pl-4 py-8 sm:py-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 leading-snug">
              Trusted by Institutions, <br />
              Educators, and Students <br />
              <span className="relative inline-block">
                <span className="bg-yellow-200 absolute inset-x-0 bottom-0 h-[0.5em] z-0"></span>
                <span className="relative z-10">across 135 countries</span>
              </span>
            </h2>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full lg:w-1/2">
          {/* Purple card */}
          <div className="bg-violet-500 text-white text-center px-4 sm:px-6 py-6 sm:py-8 rounded-2xl shadow flex flex-col justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            <h3 className="text-xl sm:text-2xl font-bold">10,00,000+</h3>
            <p className="mt-2 text-xs sm:text-sm">Happy Teachers &<br />Students</p>
          </div>

          {/* Other cards */}
          <div className="bg-gray-100 text-center px-4 sm:px-6 py-6 sm:py-8 rounded-2xl shadow flex flex-col justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">50 Lac+</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Live Class Min</p>
          </div>

          <div className="bg-gray-100 text-center px-4 sm:px-6 py-6 sm:py-8 rounded-2xl shadow flex flex-col justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">17,50,000+</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Quizzes & Test</p>
          </div>

          <div className="bg-gray-100 text-center px-4 sm:px-6 py-6 sm:py-8 rounded-2xl shadow flex flex-col justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">2,50,000+</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Resources</p>
          </div>

          <div className="bg-gray-100 text-center px-4 sm:px-6 py-6 sm:py-8 rounded-2xl shadow flex flex-col justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">13,000+</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">Assignments</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
