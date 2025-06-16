import React, { useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({ title: "", videoUrl: "" });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.videoUrl) {
      setChapters([...chapters, newChapter]);
      setNewChapter({ title: "", videoUrl: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to create a course.");
      return;
    }
    const courseId = Date.now().toString();
    const storage = getStorage();

    try {
      setLoading(true);
      let imageUrl = "";

      if (image) {
        const imageRef = ref(storage, `courses/${user.uid}/${courseId}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "users", user.uid, "courses", courseId), {
        title,
        category,
        description,
        image: imageUrl,
        youtubeLink,
        chapters,
        createdAt: new Date(),
      });

      alert("Course created!");
      setTitle("");
      setCategory("");
      setDescription("");
      setImage(null);
      setYoutubeLink("");
      setChapters([]);
    } catch (error) {
      alert("Error creating course: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarToggle = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <Sidebar />
      </div>

      <div className="md:hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="fixed top-4 left-4 z-40">
          <button
            onClick={handleSidebarToggle}
            className="text-purple-700 bg-white p-2 rounded-full shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
            </svg>
          </button>
        </div>

        <div className={`fixed top-0 left-0 h-full w-64 bg-blue-950 shadow-lg z-50 border-r transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar />
        </div>
      </div>

      <main className="flex-1 ml-0 md:ml-64 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-4xl font-bold text-purple-700 text-center">
            Create Course
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Fields */}
            <div>
              <label className="font-semibold text-purple-700">Course Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1" placeholder="Enter course title" required />
            </div>

            <div>
              <label className="font-semibold text-purple-700">Category</label>
              <input value={category} onChange={e => setCategory(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1" placeholder="Enter course category" required />
            </div>

            <div>
              <label className="font-semibold text-purple-700">Course Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1" rows="4" placeholder="Describe your course briefly" required />
            </div>

            {/* Image Upload */}
            <div>
              <label className="font-semibold text-purple-700">Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
                className="w-full p-2 border rounded-lg mt-1" />
              {image && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {image.name}
                </div>
              )}
            </div>

            {/* YouTube Video */}
            <div>
              <label className="font-semibold text-purple-700">YouTube Video Link</label>
              <input value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)}
                placeholder="https://youtube.com/..." className="w-full p-2 border rounded-lg mt-1" />
              {youtubeLink && (
                <div className="mt-4">
                  <iframe width="100%" height="300"
                    src={youtubeLink.replace("watch?v=", "embed/")}
                    title="Preview" frameBorder="0" allowFullScreen />
                </div>
              )}
            </div>

            {/* Chapters */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-purple-700">Add Chapters</h3>
              <div className="space-y-2">
                <input placeholder="Chapter Title" className="w-full p-2 border rounded-lg"
                  value={newChapter.title} onChange={(e) =>
                    setNewChapter({ ...newChapter, title: e.target.value })} />
                <input placeholder="YouTube Link" className="w-full p-2 border rounded-lg"
                  value={newChapter.videoUrl} onChange={(e) =>
                    setNewChapter({ ...newChapter, videoUrl: e.target.value })} />
                <button onClick={handleAddChapter}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow">
                  Add Chapter
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {chapters.map((ch, idx) => (
                  <li key={idx} className="border p-2 rounded-md bg-gray-50 flex items-center gap-2">
                    <span className="font-semibold">{ch.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className={`${
                  loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white px-6 py-2 rounded-lg text-lg font-semibold`}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Course"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;
