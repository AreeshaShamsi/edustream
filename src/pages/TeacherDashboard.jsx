import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaStar, FaQuestion } from 'react-icons/fa';
import teacher from '../assets/teacher.png';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  const [teacherData, setTeacherData] = useState({ name: '', email: '' });
  const [showCreate, setShowCreate] = useState(false);
  const [classroomId, setClassroomId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarToggle = () => {
  setIsSidebarOpen(!isSidebarOpen);
};


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

    function generateClassroomId() {
      return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }
    setClassroomId(generateClassroomId());
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-30" onClick={() => setIsSidebarOpen(false)} />
        )}
        <div className="fixed top-4 left-4 z-40">
          <button onClick={handleSidebarToggle} className="text-purple-700 bg-white p-2 rounded-full shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
            </svg>
          </button>
        </div>
        <div className={`fixed top-0 left-0 h-full w-64 bg-blue-950 shadow-lg z-50 border-r transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar />
        </div>
      </div>


      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
          <div className="bg-white w-64 h-full shadow-lg p-4">
            <button onClick={() => setIsSidebarOpen(false)} className="text-purple-700 text-xl mb-4">✕</button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full lg:ml-64 p-6 pt-20 lg:pt-6 overflow-auto">
        <div className="mb-6 flex justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {teacherData.name || 'Teacher'}</h1>
            <p className="text-gray-500 text-sm">{dateString}, {dayName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
              onClick={() => navigate('/create-course')}
            >
              Create Course
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200">
              Switch Classroom
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div onClick={() => navigate('/study-material')} className="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer border-t-4 border-blue-400">
            <div className="text-blue-600 text-3xl mb-3"><FaBookOpen /></div>
            <h2 className="text-lg font-semibold">Study Material</h2>
            <p className="text-sm text-gray-500 mt-1">All uploaded content</p>
          </div>
          <div onClick={() => navigate('/ask-doubt')} className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-yellow-400">
            <div className="text-yellow-600 text-3xl mb-3"><FaQuestion /></div>
            <h2 className="text-lg font-semibold">Ask Doubt</h2>
            <p className="text-sm text-gray-500 mt-1">Resolve queries easily</p>
          </div>
          <div onClick={() => navigate('/my-courses')} className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-pink-400">
            <div className="text-pink-600 text-3xl mb-3"><FaStar /></div>
            <h2 className="text-lg font-semibold">Courses</h2>
            <p className="text-sm text-gray-500 mt-1">View All Courses</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-green-400">
            <div className="text-green-600 text-3xl mb-3">🎯</div>
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="text-sm text-gray-500 mt-1">Manage tasks</p>
          </div>
        </div>

        {/* Timetable & Profile */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Timetable</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-purple-100 text-purple-800">
                    <th className="px-4 py-2 border">Day</th>
                    <th className="px-4 py-2 border">9:00 AM</th>
                    <th className="px-4 py-2 border">11:00 AM</th>
                    <th className="px-4 py-2 border">2:00 PM</th>
                    <th className="px-4 py-2 border">4:00 PM</th>
                  </tr>
                </thead>
                <tbody>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2 border font-medium text-gray-700">{day}</td>
                      <td className="px-4 py-2 border text-gray-600">--</td>
                      <td className="px-4 py-2 border text-gray-600">--</td>
                      <td className="px-4 py-2 border text-gray-600">--</td>
                      <td className="px-4 py-2 border text-gray-600">--</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <img src={teacher} alt="Profile" className="w-24 h-24 mx-auto rounded-full border-4 border-purple-500 shadow mb-4" />
            <h4 className="text-lg font-semibold">{teacherData.name || 'Teacher'}</h4>
            <p className="text-sm text-gray-500">{teacherData.email}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Classroom ID:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{classroomId}</span>
              </div>
              <div className="flex justify-between"><span>No. of Students:</span><span>0</span></div>
              <div className="flex justify-between"><span>Classrooms:</span><span>1</span></div>
            </div>
          </div>
        </div>

        {/* Optional: CreateClassroom modal */}
        {showCreate && (
          <CreateClassroom onCreated={() => setShowCreate(false)} />
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
