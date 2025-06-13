import React, { useState, useEffect } from 'react';
import {
  FaFilePdf,
  FaImage,
  FaVideo,
  FaUpload,
  FaYoutube,
  FaTrash,
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
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';

const StudyMaterial = () => {
  const [pdfs, setPdfs] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [newYoutubeUrl, setNewYoutubeUrl] = useState('');
  const [teacherData, setTeacherData] = useState({ name: '', email: '' });

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (type, e) => {
    const user = auth.currentUser;
    if (!user) return;

    const files = Array.from(e.target.files);

    for (const file of files) {
      try {
        let url = '';

        if (type === 'pdf') {
          // ✅ Upload to Filebase backend
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('http://localhost:5000/api/file-upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (!result.url) throw new Error('Filebase upload failed');
          url = result.url;

        } else if (type === 'image' || type === 'video') {
          // ✅ Upload to Firebase Storage
          const folder = type === 'image' ? 'images' : 'videos';
          const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
          await uploadBytes(fileRef, file);
          url = await getDownloadURL(fileRef);
        } else {
          toast.error('Unsupported file type.');
          continue;
        }

        const fileData = {
          name: file.name,
          url,
          uploadedAt: serverTimestamp(),
          fileType: type,
        };

        await addDoc(collection(db, 'users', user.uid, 'uploads'), fileData);
        toast.success(`${file.name} uploaded successfully.`);
      } catch (err) {
        console.error(`Upload failed for ${file.name}:`, err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    await fetchData();
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
      setNewYoutubeUrl('');
      toast.success('YouTube video added');
      await fetchData();
    } catch (err) {
      console.error('Error adding YouTube video:', err);
      toast.error('Failed to add YouTube video');
    }
  };

  const handleDelete = async (file, type) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const user = auth.currentUser;
    if (!user) return;

    // Find the Firestore doc to delete
    const uploadsRef = collection(db, 'users', user.uid, 'uploads');
    const snapshot = await getDocs(uploadsRef);
    let docId = null;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.url === file.url && data.fileType === type && data.name === file.name) {
        docId = docSnap.id;
      }
    });
    if (!docId) return toast.error("File not found in database.");

    // Delete from Firestore
    await deleteDoc(doc(db, 'users', user.uid, 'uploads', docId));

    // Delete from storage if not YouTube
    if (type === "video" || type === "pdf" || type === "image") {
      try {
        // Only delete from Firebase Storage if the file is stored there
        if (file.url.includes("firebasestorage")) {
          const url = new URL(file.url);
          const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
          const fileRef = ref(storage, path);
          await deleteObject(fileRef);
        }
      } catch (err) {
        // Ignore if not in Firebase Storage
      }
    }

    toast.success("Deleted successfully.");
    await fetchData();
  };

  const extractYoutubeID = (url) => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const renderSection = (title, icon, items, type, accept, isVideo = false) => (
    <section className="bg-white p-5 rounded-xl border border-gray-200 shadow mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
          {icon} {title}
        </h3>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer flex items-center gap-2">
          <FaUpload /> Upload {title}
          <input
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(type, e)}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map((file, i) => (
            <div key={i} className="relative group">
              {type === 'pdf' ? (
                <div className="p-4 border rounded shadow bg-gray-50">
                  <FaFilePdf size={30} className="text-red-600 mb-2" />
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(file.url)}&embedded=true`}
                    className="w-full h-48 mt-2"
                    title={file.name}
                    frameBorder="0"
                  />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-blue-600 text-sm underline mt-2 inline-block"
                  >
                    Download
                  </a>
                </div>
              ) : type === 'image' ? (
                <img key={i} src={file.url} alt={file.name} className="rounded shadow object-cover w-full h-48" />
              ) : isVideo ? (
                <video key={i} controls className="w-full h-48 rounded shadow">
                  <source src={file.url} type="video/mp4" />
                </video>
              ) : null}
              <button
                type="button"
                onClick={() => handleDelete(file, type)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))
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
              Upload and manage your PDFs (Filebase), images, videos (Firebase), and YouTube links.
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

        {renderSection('PDFs', <FaFilePdf />, pdfs, 'pdf', 'application/pdf')}
        {renderSection('Images', <FaImage />, images, 'image', 'image/*')}
        {renderSection('Videos', <FaVideo />, videos, 'video', 'video/*', true)}

        <section className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow">
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
