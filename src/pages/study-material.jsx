import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaImage, FaVideo, FaUpload } from 'react-icons/fa';
import teacher from '../assets/teacher.png';
import Sidebar from '../components/Sidebar';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const StudyMaterial = () => {
  const [pdfs, setPdfs] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setTeacherData({
            name: userDoc.data().name || '',
            email: userDoc.data().email || '',
          });
        }
      }
    };
    fetchTeacherData();
  }, []);

  const handleFileUpload = (type, e) => {
    const files = Array.from(e.target.files);
    if (type === 'pdf') setPdfs((prev) => [...prev, ...files]);
    if (type === 'image') setImages((prev) => [...prev, ...files]);
    if (type === 'video') setVideos((prev) => [...prev, ...files]);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 md:ml-64">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Study Material</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-md">
              Manage and upload PDFs, Images, and Videos for your class
            </p>
          </div>
          {/* Improved Profile Section */}
          <div className="flex flex-col items-center gap-3 mt-4 sm:mt-0">
            <img
              src={teacher}
              alt="Teacher Profile"
              className="w-28 h-28 rounded-full border-4 border-purple-600 shadow-lg mb-2"
            />
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-900">{teacherData.name || 'Teacher'}</p>
              <p className="text-md text-purple-600 font-medium">Teacher</p>
            </div>
          </div>
        </div>

        {/* PDFs Section */}
        <section className="bg-red-50 p-6 rounded-xl border border-red-200 shadow mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-red-600">
              <FaFilePdf size={22} /> PDFs
            </h3>
            <label className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer select-none">
              <FaUpload /> Upload PDF
              <input
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload('pdf', e)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pdfs.length > 0 ? (
              pdfs.map((file, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded bg-white shadow text-sm truncate"
                  title={file.name}
                >
                  {file.name}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No PDFs uploaded.</p>
            )}
          </div>
        </section>

        {/* Images Section */}
        <section className="bg-green-50 p-6 rounded-xl border border-green-200 shadow mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-green-600">
              <FaImage size={22} /> Images
            </h3>
            <label className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer select-none">
              <FaUpload /> Upload Image
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload('image', e)}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.length > 0 ? (
              images.map((file, index) => (
                <div
                  key={index}
                  className="w-full aspect-square overflow-hidden rounded border border-gray-300"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="upload"
                    className="object-cover w-full h-full"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No images uploaded.</p>
            )}
          </div>
        </section>

        {/* Videos Section */}
        <section className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-blue-600">
              <FaVideo size={22} /> Videos
            </h3>
            <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer select-none">
              <FaUpload /> Upload Video
              <input
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload('video', e)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.length > 0 ? (
              videos.map((file, index) => (
                <div
                  key={index}
                  className="w-full aspect-square overflow-hidden rounded border border-gray-300 flex items-center justify-center bg-black"
                >
                  <video
                    controls
                    className="object-cover w-full h-full"
                    style={{ background: 'black' }}
                    preload="metadata"
                  >
                    <source src={URL.createObjectURL(file)} type={file.type} />
                    Sorry, your browser doesn't support embedded videos.
                  </video>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No videos uploaded.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudyMaterial;
