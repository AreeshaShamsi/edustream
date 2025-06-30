import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const auth = getAuth();

const StudentCourses = () => {
  const [readingCourses, setReadingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReadingCourses = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);

        const readingIds = studentSnap.data()?.readingCourses || [];

        const allCoursesSnap = await getDocs(collection(db, "courses"));
        const allCourses = allCoursesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = allCourses.filter((course) =>
          readingIds.includes(course.id)
        );

        setReadingCourses(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch reading courses:", error);
        setLoading(false);
      }
    };

    fetchReadingCourses();
  }, []);

  if (loading)
    return <div className="text-center p-10 text-lg">Loading your courses...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
          Your Reading Courses
        </h1>

        {readingCourses.length === 0 ? (
          <p className="text-center text-gray-600">
            You haven’t started any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow p-5 cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/view-course/${course.id}`)}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="rounded-md w-full h-40 object-cover mb-4"
                />
                <h2 className="text-xl font-semibold text-indigo-700 mb-2">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {course.description?.slice(0, 90)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
