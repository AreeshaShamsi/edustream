// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BasicInfoPage from './pages/BasicInfoPage';
import PrivateRoute from './components/PrivateRoute';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateClassroom from './pages/Create-classroom';
import StudyMaterial from './pages/study-material'; // Add this import
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Logout from './pages/Logout';

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
         <Route path="/create-classroom" element={<CreateClassroom />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route
          path="/basic-info"
          element={
            <PrivateRoute>
              <BasicInfoPage />
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/teacher-dashboard"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        /> */}
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
