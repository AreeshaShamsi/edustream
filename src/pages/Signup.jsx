import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import Pic from '../assets/Learning.png';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const firebaseErrors = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };

  const getFirebaseErrorMessage = (code) => {
    return firebaseErrors[code] || 'Something went wrong. Please try again.';
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !phone || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        phone,
        email,
        uid: user.uid,
        role: '',
      });

      navigate('/basic-info');
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName || '',
        phone: '',
        email: user.email,
        uid: user.uid,
        role: '',
      });

      navigate('/basic-info');
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-neutral-100 px-4 py-10">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar newestOnTop />

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section */}
        <div className="bg-blue-200 p-6 md:p-10 flex flex-col justify-center items-center text-center">
          <img src={Pic} alt="Learning" className="w-full max-w-[300px] md:max-w-[360px] mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">Join the Learning!</h2>
          <p className="text-blue-600 text-sm md:text-base">Create your account and start growing ✨</p>
        </div>

        {/* Right Section */}
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <h3 className="text-xl md:text-3xl font-bold text-blue-800 mb-6 text-center md:text-left">
            Create Your Account
          </h3>

          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="1234567890"
                className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-xl font-semibold transition ${
                loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up with Email'}
            </button>
          </form>

          <div className="my-4 flex items-center justify-center">
            <span className="h-px bg-gray-300 w-1/5"></span>
            <span className="mx-2 text-sm text-gray-400">or</span>
            <span className="h-px bg-gray-300 w-1/5"></span>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
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
