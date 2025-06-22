// components/Testimonials.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';
import '@fontsource/inter'; 

const testimonials = [
  {
    name: 'Areesha Shamsi',
    feedback:
      '“EduStream made learning so easy. The mentors were supportive and the course structure really helped me become confident in my skills.”',
    highlight: 'feel confident in my skills',
  },
  {
    name: 'Cub Pal',
    feedback:
      '“EduStream is a fantastic platform. Everything from lectures to assignments is tailored for beginners. Highly recommend for landing your dream job!”',
    highlight: 'Highly recommend for landing your dream job',
  },
  {
    name: 'Pawan Pal',
    feedback:
      '“I took the Full Stack Development track on EduStream and loved the detailed roadmap. The practical sessions were the best part!”',
    highlight: 'loved the detailed roadmap',
  },
  {
    name: 'Pawan Shamsi',
    feedback:
      '“Exceeded all expectations. The support from the instructors and quality of resources helped me crack my first tech interview.”',
    highlight: 'helped me crack my first tech interview',
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-12 px-4 md:px-20">
   <h2 className="text-4xl font-bold text-gray-800 font-inter mb-10 text-center font-inter">
  What Our Students Say About{' '}
  <span className="relative inline-block">
    <span className="bg-yellow-200 absolute inset-x-0 bottom-0 h-[0.5em] z-0 rounded"></span>
    <span className="relative text-blue-950 z-10">EduStream</span>
  </span>
</h2>



      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl shadow p-6 border hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center mb-3 text-yellow-500">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>
            <p className="text-gray-700 italic mb-4">
              {t.feedback.replace(t.highlight, '')}
              <span className="font-semibold text-gray-900"> {t.highlight}</span>
              .
            </p>
            <p className="text-sm font-bold text-gray-600">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
