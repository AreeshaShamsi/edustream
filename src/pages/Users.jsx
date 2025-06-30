import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { FaTrash, FaBan, FaCheckCircle } from 'react-icons/fa';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log("🔥 All users from Firestore:", users); // Debug output

      setAllUsers(users); // Show all users for now
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRestrict = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isRestricted: !currentStatus,
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error updating restriction status:', error);
    }
  };

  const renderUserCard = (user) => (
    <div
      key={user.id}
      className="p-4 bg-white rounded shadow flex justify-between items-center"
    >
      <div>
        <h4 className="font-semibold text-lg">{user.name || user.fullName || 'Unknown'}</h4>
        <p className="text-gray-500 text-sm">{user.email || 'No email'}</p>
        <p className="text-xs text-gray-400">Role: {user.role || 'Not specified'}</p>
        <p className="text-xs text-gray-400">Status: {user.isRestricted ? 'Restricted' : 'Active'}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleRestrict(user.id, user.isRestricted)}
          className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
            user.isRestricted ? 'bg-green-500' : 'bg-yellow-500'
          } text-white`}
        >
          {user.isRestricted ? <FaCheckCircle /> : <FaBan />}
          {user.isRestricted ? 'Unblock' : 'Restrict'}
        </button>

        <button
          onClick={() => handleDelete(user.id)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded flex items-center gap-1"
        >
          <FaTrash />
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 mt-4">
      <h1 className="text-3xl font-bold text-gray-800">All Users</h1>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : allUsers.length > 0 ? (
        <div className="space-y-3">
          {allUsers.map(renderUserCard)}
        </div>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default Users;
