import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";

const Moderation = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        const users = userSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredTeachers = users.filter(
          (user) => user.role?.toLowerCase() === "teacher"
        );
        setTeachers(filteredTeachers);

        const courseSnap = await getDocs(collection(db, "courses"));
        const allCourses = courseSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getYouTubeThumbnail = (url) => {
    try {
      const parsed = new URL(url);
      const id = parsed.hostname.includes("youtu.be")
        ? parsed.pathname.slice(1)
        : parsed.searchParams.get("v");
      return `https://img.youtube.com/vi/${id}/0.jpg`;
    } catch {
      return "";
    }
  };

  const toggleBlock = async (courseId, currentStatus) => {
    try {
      await updateDoc(doc(db, "courses", courseId), {
        blocked: !currentStatus,
      });
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId ? { ...c, blocked: !currentStatus } : c
        )
      );
      toast.success(`Course ${!currentStatus ? "blocked" : "unblocked"}!`);
    } catch (err) {
      toast.error("Failed to update block status.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 w-full md:ml-64 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Teachers & Their Courses
        </h1>

        {teachers.length === 0 ? (
          <p className="text-gray-600">No teachers found.</p>
        ) : (
          teachers.map((teacher) => {
            const teacherCourses = courses.filter(
              (course) => course.userId === teacher.id
            );

            return (
              <div key={teacher.id} className="mb-10">
                <h2 className="text-xl font-semibold text-blue-700 mb-3">
                  👤 {teacher.name || "Unnamed"} ({teacher.email})
                </h2>

                {teacherCourses.length === 0 ? (
                  <p className="text-sm text-gray-500">No courses uploaded.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacherCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-xl shadow p-4"
                      >
                        {course.youtubeLink && (
                          <img
                            src={getYouTubeThumbnail(course.youtubeLink)}
                            alt="Course thumbnail"
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {course.description}
                        </p>
                        <button
                          onClick={() =>
                            toggleBlock(course.id, course.blocked || false)
                          }
                          className={`mt-2 inline-block px-4 py-1 text-sm rounded-lg font-semibold ${
                            course.blocked
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                        >
                          {course.blocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default Moderation;
