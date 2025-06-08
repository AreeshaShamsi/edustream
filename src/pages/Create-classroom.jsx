import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateClassroom = () => {
  const [classroomName, setClassroomName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (classroomName && subjectName) {
      // Save to Firebase or context if needed
      navigate('/teacher-dashboard');
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50 px-4">
      <div className="w-full max-w-md sm:max-w-lg p-6 sm:p-10 bg-white rounded-3xl shadow-2xl border border-orange-200">
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
          Create Classroom
        </h1>
        <h2 className="text-center text-sm sm:text-lg font-medium text-orange-600 mb-8">
          Teacher
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Classroom Name
            </label>
            <input
              type="text"
              value={classroomName}
              onChange={(e) => setClassroomName(e.target.value)}
              placeholder="e.g. 10th Grade - A"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
            />
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition duration-300 shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClassroom;
