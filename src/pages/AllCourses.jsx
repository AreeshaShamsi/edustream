import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Ensure this path is correct

const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            const querySnapshot = await getDocs(collection(db, "courses"));
            const courseList = [];
            querySnapshot.forEach((doc) => {
                courseList.push({ id: doc.id, ...doc.data() });
            });
            setCourses(courseList);
        };
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-purple-800 text-center mb-10">
                    Explore All Courses
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => navigate(`/view-course/${course.id}`)}
                            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer group overflow-hidden relative"
                        >
                            {course.image && (
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-48 object-cover group-hover:brightness-90 transition duration-300"
                                />
                            )}
                            <div className="p-5 pb-10 relative">
                                <h2 className="text-xl font-semibold text-purple-700 mb-2 group-hover:underline">
                                    {course.title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    {course.description?.slice(0, 80)}...
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
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

                                {/* Created Date */}
                                {course.createdAt && (
                                    <p className="absolute bottom-3 right-4 text-gray-400 text-xs">
                                        {course.createdAt.toDate().toLocaleDateString("en-GB", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllCourses;
