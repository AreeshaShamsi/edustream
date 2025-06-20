import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ViewCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(-1);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(db, 'courses', courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const courseData = docSnap.data();
          setCourse(courseData);
          setSelectedVideo(courseData.youtubeLink); // default to intro video
        } else {
          console.log('No such document!');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };

    fetchCourse();
  }, [courseId]);

  const getYouTubeEmbedUrl = (url) => {
    try {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {course ? (
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-700 mb-4">{course.title}</h1>

          {/* Video Section */}
          <div className="w-full mb-6 aspect-video bg-black rounded-xl overflow-hidden shadow-md">
            {selectedVideo ? (
              <iframe
                className="w-full h-full"
                src={getYouTubeEmbedUrl(selectedVideo)}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="text-white p-4">No video selected</p>
            )}
          </div>

          {/* Chapters */}
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Chapters</h2>
          <div className="space-y-3">
            {course.chapters && course.chapters.length > 0 ? (
              course.chapters.map((chapter, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedVideo(chapter.videoUrl);
                    setActiveChapterIndex(index);
                  }}
                  className={`p-4 bg-white rounded-xl shadow-md cursor-pointer border-l-4 ${
                    activeChapterIndex === index ? 'border-purple-600 bg-purple-50' : 'border-transparent'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-700">{chapter.title}</h3>
                </div>
              ))
            ) : (
              <p>No chapters available</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">Loading course...</div>
      )}
    </div>
  );
};

export default ViewCourse;
