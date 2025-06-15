import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Sidebar from "../components/Sidebar";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    description: "",
    language: "",
    category: "",
    level: "",
    image: null,
    youtubeLink: "",
    chapters: [],
  });

  const [newChapter, setNewChapter] = useState({ title: "", videoUrl: "" });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCourseData({
      ...courseData,
      [name]: files ? files[0] : value,
    });
  };

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.videoUrl) {
      setCourseData({
        ...courseData,
        chapters: [...courseData.chapters, newChapter],
      });
      setNewChapter({ title: "", videoUrl: "" });
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to create a course.");
      return;
    }

    const courseId = Date.now().toString();
    const storage = getStorage();

    try {
      let imageUrl = "";

      // Upload image to Firebase Storage if selected
      if (courseData.image) {
        const imageRef = ref(storage, `courses/${user.uid}/${courseId}/${courseData.image.name}`);
        await uploadBytes(imageRef, courseData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Save course data to Firestore with image URL
      await setDoc(doc(db, "users", user.uid, "courses", courseId), {
        ...courseData,
        image: imageUrl, // URL not File object
        createdAt: new Date(),
      });

      alert("Course created!");
      navigate("/course-preview", { state: { course: { ...courseData, image: imageUrl } } });

    } catch (error) {
      alert("Error creating course: " + error.message);
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <Sidebar />
      </div>

      <div className="md:hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="fixed top-4 left-4 z-40">
          <button
            onClick={handleSidebarToggle}
            className="text-purple-700 bg-white p-2 rounded-full shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
              />
            </svg>
          </button>
        </div>

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-blue-950 shadow-lg z-50 border-r transition-transform duration-300 md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
      </div>

      <main className="flex-1 ml-0 md:ml-64 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-purple-700 text-center">
            Create Course
          </h2>

          <div>
            <label className="font-semibold text-purple-700">Course Title</label>
            <input
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              placeholder="Enter course title"
            />
          </div>

          <div>
            <label className="font-semibold text-purple-700">Course Subtitle</label>
            <input
              name="subtitle"
              value={courseData.subtitle}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              placeholder="Enter course subtitle"
            />
          </div>

          <div>
            <label className="font-semibold text-purple-700">Course Description</label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              rows="4"
              placeholder="Describe your course briefly"
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-purple-700">Course Language</label>
              <select
                name="language"
                value={courseData.language}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg mt-1"
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-purple-700">Category</label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg mt-1"
              >
                <option value="">Select Category</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Office Productivity">Office Productivity</option>
                <option value="Personal Development">Personal Development</option>
                <option value="Design">Design</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Photography">Photography</option>
                <option value="Music">Music</option>
                <option value="Development">Development</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-purple-700">Course Level</label>
            <select
              name="level"
              value={courseData.level}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-purple-700">Thumbnail Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
            {courseData.image && (
              <div className="mt-2 text-sm  text-gray-600">
                Selected: {courseData.image.name}
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold text-purple-700">YouTube Video Link</label>
            <input
              name="youtubeLink"
              value={courseData.youtubeLink}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className="w-full p-2 border rounded-lg mt-1"
            />
            {courseData.youtubeLink && (
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="300"
                  src={courseData.youtubeLink.replace("watch?v=", "embed/")}
                  title="Preview"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 text-purple-700">Add Chapters</h3>
            <div className="space-y-2">
              <input
                placeholder="Chapter Title"
                className="w-full p-2 border rounded-lg"
                value={newChapter.title}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, title: e.target.value })
                }
              />
              <input
                placeholder="YouTube Link"
                className="w-full p-2 border rounded-lg"
                value={newChapter.videoUrl}
                onChange={(e) =>
                  setNewChapter({ ...newChapter, videoUrl: e.target.value })
                }
              />
              <button
                onClick={handleAddChapter}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Add Chapter
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {courseData.chapters.map((ch, idx) => (
                <li
                  key={idx}
                  className="border p-2 rounded-md bg-gray-50 flex items-center gap-2"
                >
                  <span className="font-semibold">{ch.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-lg font-semibold"
            >
              Submit Course
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;
