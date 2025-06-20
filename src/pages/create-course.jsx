import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [chapters, setChapters] = useState([]);
  const [newChapter, setNewChapter] = useState({ title: '', videoUrl: '' });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.videoUrl) {
      setChapters((prev) => [...prev, newChapter]);
      setNewChapter({ title: '', videoUrl: '' });
    } else {
      toast.warn("Please fill in both title and video URL for the chapter.");
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Cloudinary upload failed. Status: ${response.status}, Body: ${text}`);
      }

      const data = await response.json();
      return data.secure_url || null;
    } catch (err) {
      console.error('Cloudinary Upload Error:', err);
      toast.error('Image upload failed. Check your cloud name or preset.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !description || !subtitle || !language || !level) {
      toast.error('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImageToCloudinary();
      const user = auth.currentUser;

      if (!user) {
        toast.error('User not logged in!');
        return;
      }

      // ✅ Finalize chapters by including newChapter if not empty
      const finalChapters = [...chapters];
      if (newChapter.title && newChapter.videoUrl) {
        finalChapters.push(newChapter);
      }

      const courseData = {
        title,
        subtitle,
        category,
        language,
        level,
        description,
        youtubeLink,
        chapters: finalChapters,
        image: imageUrl || '',
        createdAt: new Date(),
        userId: user.uid,
      };

      const courseRef = doc(db, 'courses', `${user.uid}_${Date.now()}`);
      await setDoc(courseRef, courseData);

      toast.success('Course created successfully!');

      // Clear form
      setTitle('');
      setSubtitle('');
      setCategory('');
      setLanguage('');
      setLevel('');
      setDescription('');
      setYoutubeLink('');
      setImage(null);
      setChapters([]);
      setNewChapter({ title: '', videoUrl: '' });

      // Navigate to My Courses
      navigate("/my-courses");
    } catch (error) {
      toast.error(`Error creating course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);

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

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-4xl font-bold text-purple-700 text-center">Create Course</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Inputs */}
            <div>
              <label className="font-semibold text-purple-700">Course Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-lg mt-1" required />
            </div>

            <div>
              <label className="font-semibold text-purple-700">Course Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full p-2 border rounded-lg mt-1" required />
            </div>

            <div>
              <label className="font-semibold text-purple-700">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg mt-1" required>
                <option value="">Select Category</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Office Productivity">Office Productivity</option>
                <option value="Personal Development">Personal Development</option>
                <option value="Design">Design</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Photography">Photography</option>
                <option value="Music">Music</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-purple-700">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded-lg mt-1" required>
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-purple-700">Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 border rounded-lg mt-1" required>
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-purple-700">Course Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg mt-1" rows="4" required />
            </div>

            <div>
              <label className="font-semibold text-purple-700">Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded-lg mt-1" />
              {image && <div className="mt-2 text-sm text-gray-600">Selected: {image.name}</div>}
            </div>

            <div>
              <label className="font-semibold text-purple-700">YouTube Video Link</label>
              <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/..." className="w-full p-2 border rounded-lg mt-1" />
              {youtubeLink && (
                <div className="mt-4">
                  <iframe width="100%" height="300" src={youtubeLink.replace('watch?v=', 'embed/')} title="Preview" frameBorder="0" allowFullScreen />
                </div>
              )}
            </div>

            {/* Chapters */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-purple-700">Add Chapters</h3>
              <input placeholder="Chapter Title" className="w-full p-2 border rounded-lg mb-2" value={newChapter.title} onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })} />
              <input placeholder="YouTube Link" className="w-full p-2 border rounded-lg mb-2" value={newChapter.videoUrl} onChange={(e) => setNewChapter({ ...newChapter, videoUrl: e.target.value })} />
              <button type="button" onClick={handleAddChapter} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow">Add Chapter</button>

              <ul className="mt-4 space-y-2">
                {chapters.map((ch, idx) => (
                  <li key={idx} className="border p-2 rounded-md bg-gray-50">
                    <span className="font-semibold">{ch.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center pt-4">
              <button type="submit" className={`${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-lg text-lg font-semibold`} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Course'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCourse;
