// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import React from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </Router>
  );
}

export default App;
