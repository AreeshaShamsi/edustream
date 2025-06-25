import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

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
  const [newChapter, setNewChapter] = useState({
    number: '',
    title: '',
    videoUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleAddChapter = () => {
    const { number, title, videoUrl, description } = newChapter;
    if (number && title && videoUrl && description) {
      setChapters((prev) => [...prev, newChapter]);
      setNewChapter({ number: '', title: '', videoUrl: '', description: '' });
    } else {
      toast.warn("Please fill in all chapter fields.");
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
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.secure_url || null;
    } catch (err) {
      toast.error('Image upload failed.');
      return null;
    }
  };

  const extractYoutubeId = (url) => {
    try {
      const match = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&?/]+)/
      );
      return match && match[1] ? match[1] : null;
    } catch {
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

      const finalChapters = [...chapters];
      if (newChapter.title && newChapter.videoUrl && newChapter.description && newChapter.number) {
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
      setTitle('');
      setSubtitle('');
      setCategory('');
      setLanguage('');
      setLevel('');
      setDescription('');
      setYoutubeLink('');
      setImage(null);
      setChapters([]);
      setNewChapter({ number: '', title: '', videoUrl: '', description: '' });
      navigate('/my-courses');
    } catch (error) {
      toast.error(`Error creating course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const youtubeId = extractYoutubeId(youtubeLink);

  return (
    <>
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 w-full p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-4xl font-bold text-purple-700 text-center">Create Course</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-lg" required />
            <input placeholder="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full p-2 border rounded-lg" required />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg" required>
              <option value="">Select Category</option>
              <option value="IT & Software">IT & Software</option>
              <option value="Design">Design</option>
              <option value="Photography">Photography</option>
              <option value="Business">Business</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Marketing">Marketing</option>
              <option value="Music">Music</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="I don't know yet">I don't know yet</option>
            </select>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded-lg" required>
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 border rounded-lg" required>
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <textarea placeholder="Course Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" rows="3" />

            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded-lg" />
            <input placeholder="Intro YouTube Link" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full p-2 border rounded-lg" />

            {/* YouTube Preview */}
            {youtubeId && (
              <div className="aspect-video mt-2 rounded overflow-hidden shadow border">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube Preview"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Chapter Section */}
            <h3 className="text-lg font-bold text-purple-700">Add Chapter</h3>
            <input placeholder="Chapter Number" type="number" value={newChapter.number} onChange={(e) => setNewChapter({ ...newChapter, number: e.target.value })} className="w-full p-2 border rounded-lg" />
            <input placeholder="Chapter Title" value={newChapter.title} onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })} className="w-full p-2 border rounded-lg" />
            <input placeholder="Video URL" value={newChapter.videoUrl} onChange={(e) => setNewChapter({ ...newChapter, videoUrl: e.target.value })} className="w-full p-2 border rounded-lg" />
            <textarea placeholder="Short Description" value={newChapter.description} onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })} className="w-full p-2 border rounded-lg" rows="2" />

            <button type="button" onClick={handleAddChapter} className="bg-purple-600 text-white px-4 py-2 rounded">Add Chapter</button>

            <ul className="mt-2">
              {chapters.map((ch, idx) => (
                <li key={idx} className="p-2 bg-gray-50 border rounded mb-1">
                  <strong>Chapter {ch.number}:</strong> {ch.title} — {ch.description}
                </li>
              ))}
            </ul>

            <button type="submit" disabled={loading} className={`w-full py-2 text-white font-semibold rounded ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}>
              {loading ? 'Submitting...' : 'Submit Course'}
            </button>
          </form>
        </div>
      </main>
    
    </>
  );
};

export default CreateCourse;
