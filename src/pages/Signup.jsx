import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Pic from '../assets/Learning.png';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/basic-info');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/basic-info');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-neutral-100 px-4 py-10">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side Image + Intro */}
        <div className="bg-blue-200 p-6 sm:p-10 flex flex-col justify-center items-center text-center">
          <img src={Pic} alt="Learning" className="w-full max-w-[280px] sm:max-w-[340px] mb-6" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mb-2">Join the Learning!</h2>
          <p className="text-blue-600 text-sm sm:text-base">Create your account and start growing ✨</p>
        </div>

        {/* Right Side Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-6 text-center md:text-left">
            Create Your Account
          </h3>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleEmailSignup} className="space-y-5">
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
              Sign Up with Email
            </button>
          </form>

          <div className="my-4 flex items-center justify-center">
            <span className="h-px bg-gray-300 w-1/5"></span>
            <span className="mx-2 text-sm text-gray-400">or</span>
            <span className="h-px bg-gray-300 w-1/5"></span>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 font-semibold hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
