// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BasicInfoPage from './pages/BasicInfoPage';
import PrivateRoute from './components/PrivateRoute';
import TeacherDashboard from './pages/TeacherDashboard';
import Testimonials from './pages/Testimonials';


import StudyMaterial from './pages/study-material'; // Add this import
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Logout from './pages/Logout';
import AskDoubt from './pages/AskDoubt';
import CreateCourse from './pages/create-course';
import MyCourses from './pages/MyCourses';
import ViewCourse from './pages/ViewCourse';
import StudentDashboard from './pages/StudentDashboard'; // Import StudentDashboard
import AllCourses from './pages/AllCourses'; // Import AllCourses




// import NotFound from './pages/NotFound';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/teacher-dashboard"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <PrivateRoute>
              <CreateCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <PrivateRoute>
              <MyCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-course/:courseId"
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        />
        <Route
          path="/ask-doubt"
          element={
            <PrivateRoute>
              <AskDoubt />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <AllCourses />
            </PrivateRoute>
          }
        />

        <Route path="/testimonials" element={<Testimonials />} />

        <Route
          path="/basic-info"
          element={
            <PrivateRoute>
              <BasicInfoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/study-material"
          element={
            <PrivateRoute>
              <StudyMaterial />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
