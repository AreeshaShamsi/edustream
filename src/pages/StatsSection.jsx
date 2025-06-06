import React from 'react';

const StatsSection = () => {
  return (
    <section className="px-6 py-12 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        
        {/* Text Section */}
        <div>
          <div className="border-l-4 border-purple-700 pl-4 py-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-snug">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Purple card */}
          <div className="bg-violet-500 text-white text-center px-6 py-8 rounded-2xl shadow flex flex-col justify-center min-h-[180px] md:row-span-2">
            <h3 className="text-2xl font-bold">10,00,000+</h3>
            <p className="mt-2 text-sm">Happy Teachers &<br />Students</p>
          </div>

          {/* Other cards */}
          <div className="bg-gray-100 text-center px-6 py-8 rounded-2xl shadow flex flex-col justify-center min-h-[180px]">
            <h3 className="text-xl font-bold text-gray-800">50 Lac+</h3>
            <p className="mt-2 text-sm text-gray-600">Live Class Min</p>
          </div>

          <div className="bg-gray-100 text-center px-6 py-8 rounded-2xl shadow flex flex-col justify-center min-h-[180px]">
            <h3 className="text-xl font-bold text-gray-800">17,50,000+</h3>
            <p className="mt-2 text-sm text-gray-600">Quizzes & Test</p>
          </div>

          <div className="bg-gray-100 text-center px-6 py-8 rounded-2xl shadow flex flex-col justify-center min-h-[180px]">
            <h3 className="text-xl font-bold text-gray-800">2,50,000+</h3>
            <p className="mt-2 text-sm text-gray-600">Resources</p>
          </div>

          <div className="bg-gray-100 text-center px-6 py-8 rounded-2xl shadow flex flex-col justify-center min-h-[180px]">
            <h3 className="text-xl font-bold text-gray-800">13,000+</h3>
            <p className="mt-2 text-sm text-gray-600">Assignments</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
