import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import AdminSidebar from '../components/AdminSidebar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4'];

const AdminAnalytics = () => {
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userSnapshot = await getDocs(collection(db, 'users'));
      const courseSnapshot = await getDocs(collection(db, 'courses'));

      let teachers = 0, students = 0;
      const activesByDay = {};

      userSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.role === 'Teacher') teachers++;
        else if (data.role === 'Student') students++;

        if (data.lastLogin) {
          const loginDate = new Date(data.lastLogin);
          const day = loginDate.toLocaleDateString('en-US', { weekday: 'short' });
          activesByDay[day] = (activesByDay[day] || 0) + 1;
        }
      });

      const actives = Object.entries(activesByDay).map(([day, count]) => ({
        day,
        count
      }));

      setTeacherCount(teachers);
      setStudentCount(students);
      setCourseCount(courseSnapshot.size);
      setActiveUsers(actives);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 w-full md:ml-64 px-6 py-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Admin Analytics Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-indigo-600">👩‍🏫 Total Teachers</h3>
            <p className="text-4xl font-bold mt-2">{teacherCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-cyan-500">
            <h3 className="text-xl font-semibold text-cyan-600">🎓 Total Students</h3>
            <p className="text-4xl font-bold mt-2">{studentCount}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-semibold text-purple-600">📚 Total Courses</h3>
            <p className="text-4xl font-bold mt-2">{courseCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart for Role Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4">🧑‍🤝‍🧑 Role Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={[
                    { name: 'Teachers', value: teacherCount },
                    { name: 'Students', value: studentCount }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart for Active Users */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-4">📅 User Login Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#06b6d4" name="Logins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;