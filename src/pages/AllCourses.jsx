import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const auth = getAuth();

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [readingCourses, setReadingCourses] = useState([]);
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "courses"));
      const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const unblockedCourses = courseList.filter(course => !course.blocked); // ✅ Hide blocked
      setCourses(unblockedCourses);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (studentSnap.exists()) {
          setUserType("student");
          setReadingCourses(studentSnap.data().readingCourses || []);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const addToReading = async (courseId) => {
    try {
      const studentRef = doc(db, "students", userId);
      await updateDoc(studentRef, {
        readingCourses: arrayUnion(courseId),
      });
      setReadingCourses((prev) => [...prev, courseId]);
      alert("Course added to your reading list!");
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-purple-800 text-center mb-10">
          Explore All Courses
        </h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No courses available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out overflow-hidden relative"
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/view-course/${course.id}`)}
                  />
                )}

                <div className="p-5 pb-14 relative">
                  <h2
                    className="text-xl font-semibold text-purple-700 mb-2 cursor-pointer hover:underline"
                    onClick={() => navigate(`/view-course/${course.id}`)}
                  >
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description?.slice(0, 80)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.category && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        {course.category}
                      </span>
                    )}
                    {course.language && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        {course.language}
                      </span>
                    )}
                    {course.level && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {course.level}
                      </span>
                    )}
                  </div>

                  {/* Start Reading Button */}
                  {userType === "student" && (
                    <button
                      onClick={() => addToReading(course.id)}
                      disabled={readingCourses.includes(course.id)}
                      className={`absolute bottom-3 left-4 px-4 py-2 text-sm font-medium rounded ${
                        readingCourses.includes(course.id)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {readingCourses.includes(course.id)
                        ? "Already Reading"
                        : "Start Reading"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;