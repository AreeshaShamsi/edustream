import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import student from '../assets/student.png'; // Use a student avatar image
import { FaBookOpen, FaQuestion, FaStar } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentSidebar from '../components/StudentNavbar';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  const [studentData, setStudentData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchStudentData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setStudentData({
            name: userDoc.data().name || '',
            email: userDoc.data().email || '',
          });
        }
      }
    };
    fetchStudentData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <StudentSidebar/>

      <main className="flex-1 w-full md:ml-64 px-6 pt-24 md:pt-6 overflow-auto">
        <div className="mb-6 flex justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {studentData.name || 'Student'}
            </h1>
            <p className="text-gray-500 text-sm">
              {dateString}, {dayName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={() => navigate('/my-courses')}
            >
              View My Courses
            </button>
            <button
              className="border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200"
              onClick={() => navigate('/ask-doubt')}
            >
              Ask a Doubt
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"> 
          {/* <div
            onClick={() => navigate('/study-material')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer border-t-4 border-blue-400"
          >
            <div className="text-blue-600 text-3xl mb-3">
              <FaBookOpen />
            </div>
            <h2 className="text-lg font-semibold">Study Material</h2>
            <p className="text-sm text-gray-500 mt-1">Access all your study resources</p>
          </div> */} 

          <div
            onClick={() => navigate('/ask-doubt')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-yellow-400"
          >
            <div className="text-yellow-600 text-3xl mb-3">
              <FaQuestion />
            </div>
            <h2 className="text-lg font-semibold">Ask Doubt</h2>
            <p className="text-sm text-gray-500 mt-1">Get your questions answered</p>
          </div>

          <div
            onClick={() => navigate('/my-courses')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-pink-400"
          >
            <div className="text-pink-600 text-3xl mb-3">
              <FaStar />
            </div>
            <h2 className="text-lg font-semibold">My Courses</h2>
            <p className="text-sm text-gray-500 mt-1">View and manage your courses</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Announcements</h3>
            <div className="text-gray-500 text-sm">
              {/* You can add dynamic announcements here */}
              No new announcements.
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <img
              src={student}
              alt="Profile"
              className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500 shadow mb-4"
            />
            <h4 className="text-lg font-semibold">{studentData.name || 'Student'}</h4>
            <p className="text-sm text-gray-500">{studentData.email}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Enrolled Courses:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">0</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span>0</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Doubts:</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;