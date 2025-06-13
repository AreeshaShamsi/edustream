import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateClassroom = () => {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [message, setMessage] = useState("");
  const [classroomId, setClassroomId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = uuidv4(); // Generate unique ID
    setClassroomId(id);
    setMessage("Classroom created successfully!");
    setClassName("");
    setSection("");
    // You can also send this ID to your backend/database here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Create Classroom
        </h2>
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />
        <input
          type="text"
          placeholder="Section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
        >
          Create
        </button>
        {message && (
          <div className="mt-4 text-green-600">
            {message}
            {classroomId && (
              <div className="mt-2 text-sm text-gray-700">
                Classroom ID:{" "}
                <span className="font-mono">{classroomId}</span>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateClassroom;
