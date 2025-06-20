import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import '@fontsource/inter';

// Import images
import teacherImg from '../assets/teacher.png';
import studentImg from '../assets/student.png';

const images = {
  teacher: teacherImg,
  student: studentImg,
};

const BasicInfoPage = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to continue.');
      return;
    }
    if (!name.trim() || !role) {
      alert('Please enter your name and select a role.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name.trim(),
        role,
      });

      // Redirect based on role
      // Redirect based on role
      if (role === 'Teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    } catch (error) {
      alert('Error saving info: ' + (error.message || error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
          Tell Us About You
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">To get started, we need a little info</p>

        {/* Role Select */}
        <div className="flex justify-center gap-6 sm:gap-10 mb-10 flex-wrap">
          {['Teacher', 'Student'].map((type) => (
            <div
              key={type}
              onClick={() => setRole(type)}
              className={`group relative cursor-pointer w-24 sm:w-28 aspect-square rounded-full flex flex-col items-center justify-center overflow-hidden border-4 transition duration-300 ease-in-out transform
                ${role === type
                  ? type === 'Teacher'
                    ? 'bg-blue-100 border-blue-800 scale-105 shadow-xl'
                    : 'bg-green-100 border-green-600 scale-105 shadow-xl'
                  : 'bg-gray-100 border-gray-300 hover:scale-105 hover:shadow-lg'
                }
              `}
            >
              <img
                src={images[type.toLowerCase()]}
                alt={type}
                className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 sm:gap-10 mb-8 -mt-6 flex-wrap">
          {['Teacher', 'Student'].map((type) => (
            <p
              key={type}
              className={`text-center font-semibold text-gray-700 text-sm w-24 sm:w-28 ${role === type ? 'text-blue-900' : ''
                }`}
            >
              {type}
            </p>
          ))}
        </div>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-5 py-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base sm:text-lg"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg shadow-md transition"
        >
          Continue
        </button>

        {/* Logout */}
        <button
          onClick={() => auth.signOut().then(() => navigate('/login'))}
          className="mt-6 w-full text-center text-purple-700 hover:underline font-medium text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default BasicInfoPage;
