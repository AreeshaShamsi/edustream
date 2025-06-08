import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Pic from '../assets/Learning.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Helper to redirect based on role
  const redirectToDashboard = async (user) => {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      if (role === 'Teacher') {
        navigate('/teacher-dashboard');
      } else if (role === 'Student') {
        navigate('/student-dashboard');
      } else {
        navigate('/basic-info');
      }
    } else {
      navigate('/basic-info');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await redirectToDashboard(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await redirectToDashboard(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-neutral-100 px-4 py-10">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-blue-200 p-6 md:p-10 flex flex-col justify-center items-center text-center">
          <img
            src={Pic}
            alt="Teacher and Student"
            className="w-full max-w-[300px] md:max-w-[360px] mb-6"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">Welcome Back!</h2>
          <p className="text-blue-600 text-sm md:text-base">Learn something new every day ✨</p>
        </div>

        <div className="p-6 md:p-10 flex flex-col justify-center">
          <h3 className="text-xl md:text-3xl font-bold text-blue-800 mb-6 text-center md:text-left">
            Login to Your Account
          </h3>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              Login with Email
            </button>
          </form>

          <div className="my-4 flex items-center justify-center">
            <span className="h-px bg-gray-300 w-1/5"></span>
            <span className="mx-2 text-sm text-gray-400">or</span>
            <span className="h-px bg-gray-300 w-1/5"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
