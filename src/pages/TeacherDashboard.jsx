import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaRecordVinyl, FaQuestion } from 'react-icons/fa';
import teacher from '../assets/teacher.png';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setTeacherData({
            name: userDoc.data().name || '',
            email: userDoc.data().email || '',
          });
        }
      }
    };
    fetchTeacherData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - visible on large screens */}
      <div className="hidden lg:block w-64 fixed h-screen border-r border-gray-200 bg-white">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 
                       lg:ml-64 lg:mr-0 
                       xl:mr-72 
                       overflow-auto min-h-screen">

        {/* Content top header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, {teacherData.name || 'Teacher'}
            </h2>
            <p className="text-sm text-gray-500">
              {dateString}, {dayName}
            </p>
          </div>
          <div className="space-x-2">
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Create Classroom
            </button>
            <button className="border px-4 py-2 rounded hover:bg-gray-100">Switch Classroom</button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <div
            className="p-4 rounded-lg bg-blue-100 text-center shadow hover:shadow-md transition cursor-pointer"
            onClick={() => navigate('/study-material')}
          >
            <div className="text-4xl mb-2 flex justify-center">
              <FaBookOpen />
            </div>
            <h3 className="text-lg font-semibold mb-2">Study Material</h3>
            <button className="bg-white text-sm px-4 py-1 border rounded hover:bg-gray-100">View</button>
          </div>
          <div className="p-4 rounded-lg bg-orange-100 text-center shadow hover:shadow-md transition">
            <div className="text-4xl mb-2 flex justify-center">
              <FaQuestion />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ask Doubt</h3>
            <button className="bg-white text-sm px-4 py-1 border rounded hover:bg-gray-100">Ask</button>
          </div>
          <div className="p-4 rounded-lg bg-pink-100 text-center shadow hover:shadow-md transition">
            <div className="text-4xl mb-2 flex justify-center">
              <FaRecordVinyl />
            </div>
            <h3 className="text-lg font-semibold mb-2">Recording</h3>
            <button className="bg-white text-sm px-4 py-1 border rounded hover:bg-gray-100">View</button>
          </div>
        </div>

        {/* Teacher profile for small and medium screens */}
        <div className="lg:hidden bg-white p-6 rounded-xl shadow-md text-center mb-6">
          <img
            src={teacher}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold mb-1">{teacherData.name || 'Teacher'}</h3>
          <p className="text-sm text-gray-500 mb-1">Teacher</p>
          <p className="text-sm text-gray-500 mb-1 break-all">{teacherData.email}</p>
          <p className="text-sm text-gray-500 mb-6">Classroom Id: 6314676212</p>

          <div className="w-full text-left max-w-xs mx-auto space-y-3 text-sm text-gray-700">
            <div className="flex justify-between font-medium">
              <span>No. of Students</span> <span>0</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Classroom</span> <span>1</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - visible on extra-large screens (xl and up) */}
      <aside className="hidden xl:flex flex-col w-72 fixed right-0 top-0 bg-white p-6 shadow-md h-screen items-center text-center overflow-auto">
        <img src={teacher} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
        <h3 className="text-xl font-semibold mb-1">{teacherData.name || 'Teacher'}</h3>
        <p className="text-sm text-gray-500 mb-1">Teacher</p>
        <p className="text-sm text-gray-500 mb-1 break-all">{teacherData.email}</p>
        <p className="text-sm text-gray-500 mb-6">Classroom Id: 6314676212</p>

        <div className="w-full text-left space-y-3 text-sm text-gray-700">
          <div className="flex justify-between font-medium">
            <span>No. of Students</span> <span>0</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Classroom</span> <span>1</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default TeacherDashboard;
