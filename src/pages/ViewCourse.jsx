import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(-1);

  useEffect(() => {
    const fetchCourse = async () => {
      const docRef = doc(db, 'courses', courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const courseData = docSnap.data();
        setCourse(courseData);
        setSelectedVideo(courseData.youtubeLink); // This is the main course video
      }
    };
    fetchCourse();
  }, [courseId]);

  const getYouTubeVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.slice(1); // removes the leading slash
      } else {
        return parsedUrl.searchParams.get('v');
      }
    } catch (err) {
      return '';
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : '';
  };

  return (
    <>
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:ml-64">
        <div className="max-w-6xl mx-auto mt-4">
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/my-courses')}
              className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-lg shadow mb-6 mt-12"
            >
              ← Back to My Courses
            </button>
          </div>
        </div>

        {course ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Course Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h1 className="text-3xl font-bold text-purple-700">{course.title}</h1>
              <p className="text-gray-600 mt-2 text-lg">{course.description}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  Level: {course.level || 'N/A'}
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Language: {course.language || 'N/A'}
                </span>
              </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              {selectedVideo ? (
                <iframe
                  className="w-full h-full"
                  src={getYouTubeEmbedUrl(selectedVideo)}
                  title="Course Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-white flex items-center justify-center h-full">
                  No video selected
                </div>
              )}
            </div>

            {/* Chapters */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chapters</h2>
              {course.chapters?.length ? (
                <div className="space-y-4">
                  {course.chapters.map((chapter, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedVideo(chapter.videoUrl);
                        setActiveChapterIndex(i);
                      }}
                      className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${
                        activeChapterIndex === i
                          ? 'bg-purple-50 border-purple-600'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <img
                        src={getYouTubeThumbnail(chapter.videoUrl)}
                        alt={`Thumbnail for ${chapter.title}`}
                        className="w-28 h-20 object-cover rounded-lg border"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {chapter.number ? `${chapter.number}. ` : `${i + 1}. `}
                          {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No chapters available.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center mt-10 text-gray-500 text-lg">Loading course...</p>
        )}
      </main>
    </>
  );
};

export default ViewCourse;
