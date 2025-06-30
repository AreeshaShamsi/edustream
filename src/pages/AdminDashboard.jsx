import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaUsers, FaChartBar, FaShieldAlt } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  const [adminData, setAdminData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchAdminData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setAdminData({
            name: userDoc.data().name || '',
            email: userDoc.data().email || '',
          });
        }
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminSidebar />

      <main className="flex-1 w-full md:ml-64 px-6 pt-24 md:pt-6 overflow-auto">
        <div className="mb-6 flex justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {adminData.name || 'Admin'}
            </h1>
            <p className="text-gray-500 text-sm">
              {dateString}, {dayName}
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => navigate('/admin-dashboard/users')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-blue-500 cursor-pointer"
          >
            <div className="text-blue-500 text-3xl mb-3">
              <FaUsers />
            </div>
            <h2 className="text-lg font-semibold">Manage Users</h2>
            <p className="text-sm text-gray-500 mt-1">View instructors & students</p>
          </div>

          <div
            onClick={() => navigate('/admin-dashboard/analytics')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-purple-500 cursor-pointer"
          >
            <div className="text-purple-500 text-3xl mb-3">
              <FaChartBar />
            </div>
            <h2 className="text-lg font-semibold">Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">Track platform usage</p>
          </div>

          <div
            onClick={() => navigate('/admin-dashboard/moderation')}
            className="bg-white p-4 rounded-xl shadow hover:shadow-md border-t-4 border-red-500 cursor-pointer"
          >
            <div className="text-red-500 text-3xl mb-3">
              <FaShieldAlt />
            </div>
            <h2 className="text-lg font-semibold">Moderation</h2>
            <p className="text-sm text-gray-500 mt-1">Flag or delete content</p>
          </div>
        </div>

        {/* Nested Page (e.g., Users, Analytics) */}
        <Outlet />

        {/* Admin Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Admin Notes</h3>
            <p className="text-gray-500 text-sm">No important updates at the moment.</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h4 className="text-lg font-semibold">{adminData.name || 'Admin'}</h4>
            <p className="text-sm text-gray-500">{adminData.email}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Total Users:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">--</span>
              </div>
              <div className="flex justify-between">
                <span>Subscriptions:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Flagged Content:</span>
                <span>--</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
