import React, { useState, useEffect } from 'react';
import {
  FaFilePdf,
  FaImage,
  FaVideo,
  FaUpload,
  FaYoutube,
} from 'react-icons/fa';
import teacher from '../assets/teacher.png';
import Sidebar from '../components/Sidebar';
import { auth, db, storage } from '../firebase';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const StudyMaterial = () => {
  const [pdfs, setPdfs] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [teacherData, setTeacherData] = useState({ name: '', email: '' });

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setTeacherData({
          name: userDoc.data().name || '',
          email: userDoc.data().email || '',
        });
      }

      const uploadsRef = collection(db, 'users', user.uid, 'uploads');
      const snapshot = await getDocs(uploadsRef);
      const pdfList = [], imageList = [], videoList = [], ytList = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.fileType === 'pdf') pdfList.push(data);
        else if (data.fileType === 'image') imageList.push(data);
        else if (data.fileType === 'video') videoList.push(data);
        else if (data.fileType === 'youtube') ytList.push(data.url);
      });

      setPdfs(pdfList);
      setImages(imageList);
      setVideos(videoList);
      setYoutubeVideos(ytList);
    };

    fetchData();
  }, []);

  const handleFileUpload = async (type, e) => {
    const user = auth.currentUser;
    if (!user) return;

    const files = Array.from(e.target.files);
    const uploadedFiles = [];

    for (const file of files) {
      try {
        let url = '';
        if (type === 'video') {
          const fileRef = ref(storage, `${type}s/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          url = await getDownloadURL(fileRef);
        } else {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', UPLOAD_PRESET);
          const resourceType = type === 'image' ? 'image' : 'raw';

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
            formData
          );
          url = res.data.secure_url;
        }

        const fileData = {
          name: file.name,
          url,
          uploadedAt: serverTimestamp(),
          fileType: type,
        };

        await addDoc(collection(db, 'users', user.uid, 'uploads'), fileData);
        uploadedFiles.push(fileData);
        toast.success(`${file.name} uploaded successfully.`);
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (type === 'pdf') setPdfs((prev) => [...prev, ...uploadedFiles]);
    if (type === 'image') setImages((prev) => [...prev, ...uploadedFiles]);
    if (type === 'video') setVideos((prev) => [...prev, ...uploadedFiles]);
  };

  const handleAddYoutubeVideo = async () => {
    if (!newYoutubeUrl.trim()) return;
    const user = auth.currentUser;
    if (!user) return;
    if (!newYoutubeUrl.includes('youtube.com') && !newYoutubeUrl.includes('youtu.be')) {
      toast.error('Invalid YouTube URL');
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'uploads'), {
        url: newYoutubeUrl.trim(),
        uploadedAt: serverTimestamp(),
        fileType: 'youtube',
      });
      setYoutubeVideos((prev) => [...prev, newYoutubeUrl.trim()]);
      setNewYoutubeUrl('');
      toast.success('YouTube video added');
    } catch (err) {
      console.error('Error adding YouTube video:', err);
      toast.error('Failed to add YouTube video');
    }
  };

  const extractYoutubeID = (url) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const renderSection = (title, icon, items, type, accept, isVideo = false) => (
    <section className={`bg-${type}-50 p-5 rounded-xl border border-${type}-200 shadow mb-10`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-semibold flex items-center gap-2 text-${type}-600`}>
          {icon} {title}
        </h3>
        <label className={`bg-${type}-600 hover:bg-${type}-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2`}>
          <FaUpload /> Upload {title}
          <input
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(title.toLowerCase(), e)}
          />
        </label>
      </div>
      <div className={`grid ${isVideo ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'} gap-4`}>
        {items.length > 0 ? (
          items.map((file, i) =>
            isVideo ? (
              <video key={i} controls className="w-full h-auto rounded shadow">
                <source src={file.url} type="video/mp4" />
              </video>
            ) : type === 'image' ? (
              <img key={i} src={file.url} alt={file.name} className="rounded shadow object-cover w-full h-48" />
            ) : (
              <a
                href={file.url}
                key={i}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-white border rounded shadow hover:bg-gray-50 truncate"
              >
                {file.name}
              </a>
            )
          )
        ) : (
          <p className="text-gray-500">No {title.toLowerCase()} uploaded.</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Toaster position="top-right" />
      <aside className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <Sidebar />
      </aside>

      <main className="flex-1 p-4 sm:p-8 md:ml-64">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Study Material</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-md">
              Upload and manage your PDFs, images, videos, and YouTube links here.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 mt-4 sm:mt-0">
            <img
              src={teacher}
              alt="Teacher Profile"
              className="w-28 h-28 rounded-full border-4 border-purple-600 shadow-lg"
            />
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{teacherData.name || 'Teacher'}</p>
              <p className="text-md text-purple-600 font-medium">Teacher</p>
            </div>
          </div>
        </div>

        {renderSection('PDFs', <FaFilePdf />, pdfs, 'red', 'application/pdf')}
        {renderSection('Images', <FaImage />, images, 'green', 'image/*')}
        {renderSection('Videos', <FaVideo />, videos, 'blue', 'video/*', true)}

        <section className="bg-blue-100 p-6 rounded-xl border border-blue-300 shadow">
          <label className="text-blue-700 font-semibold flex items-center gap-2 mb-2">
            <FaYoutube size={20} /> Add YouTube Video URL
          </label>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newYoutubeUrl}
              onChange={(e) => setNewYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddYoutubeVideo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {youtubeVideos.map((url, i) => {
              const videoId = extractYoutubeID(url);
              return videoId ? (
                <iframe
                  key={i}
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube Video"
                  className="w-full aspect-video rounded shadow"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : null;
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudyMaterial;