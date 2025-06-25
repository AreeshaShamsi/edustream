import React, { useEffect, useState } from 'react';
import { doc, getDocs, collection, deleteDoc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { FaTrash, FaStar } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    if (auth.currentUser) {
      const q = query(collection(db, 'courses'), where('userId', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    }
  };

  const deleteCourse = async (id) => {
    await deleteDoc(doc(db, 'courses', id));
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);

  return (
   <><Sidebar/>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 sm:px-8 mt-16 sm:mt-8 mb-6">
          <h1 className="text-3xl font-bold text-purple-700">My Courses</h1>
          <button
            onClick={() => navigate('/create-course')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
          >
            + Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-500">You haven’t created any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => navigate(`/view-course/${course.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition cursor-pointer"
              >
                {/* Thumbnail */}
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  <div className="text-sm text-gray-500">
                    <span>🌐 {course.language}</span> | <span>🎯 {course.level}</span>
                  </div>

                  {/* YouTube Link */}
                  {course.youtubeLink && (
                    <a
                      href={course.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // prevent card navigation
                      className="text-sm text-blue-600 hover:underline block"
                    >
                      🔗 Watch on YouTube
                    </a>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-3">
                    <FaStar className="text-yellow-400 cursor-pointer" title="Rate" />
                    <FaTrash
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent navigation
                        deleteCourse(course.id);
                      }}
                      title="Delete"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default MyCourses;
