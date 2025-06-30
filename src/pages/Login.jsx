import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Pic from '../assets/Learning.png';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from '../context/LoadingContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();

  const firebaseErrors = {
    'auth/invalid-email': 'The email address is badly formatted.',
    'auth/user-disabled': 'This user account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'The password is incorrect.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/popup-closed-by-user': 'Google sign-in popup was closed before completing.',
    'auth/popup-blocked': 'Popup blocked. Please allow popups in your browser.',
    'auth/account-exists-with-different-credential': 'This email is already linked with another sign-in method.',
    'auth/unauthorized-domain': 'Unauthorized domain. Check Firebase auth settings.',
    'auth/internal-error': 'Internal server error. Please try again later.',
    'auth/operation-not-allowed': 'This authentication method is not enabled.',
    'auth/invalid-credential': 'Invalid credentials provided.',
    'auth/invalid-password': 'The password must be at least 6 characters.',
    'auth/missing-email': 'Please enter an email address.',
    'auth/missing-password': 'Please enter a password.',
  };

  const getFirebaseErrorMessage = (code) => {
    return firebaseErrors[code] || 'An unexpected error occurred.';
  };

  // ✅ REDIRECT + UPDATE lastLogin
  const redirectToDashboard = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    // ✅ Update lastLogin
    await updateDoc(userRef, {
      lastLogin: new Date().toISOString(),
    });

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
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await redirectToDashboard(userCredential.user);
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await redirectToDashboard(userCredential.user);
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-neutral-100 px-4 py-10">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar newestOnTop />

      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10">
        <div className="bg-blue-200 p-6 md:p-10 flex flex-col justify-center items-center text-center">
          <img src={Pic} alt="Teacher and Student" className="w-full max-w-[300px] md:max-w-[360px] mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">Welcome Back!</h2>
          <p className="text-blue-600 text-sm md:text-base">Learn something new every day ✨</p>
        </div>

        <div className="p-6 md:p-10 flex flex-col justify-center">
          <h3 className="text-xl md:text-3xl font-bold text-blue-800 mb-6 text-center md:text-left">
            Login to Your Account
          </h3>

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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              {loading ? 'Logging in...' : 'Login with Email'}
            </button>
          </form>

          <div className="my-4 flex items-center justify-center">
            <span className="h-px bg-gray-300 w-1/5"></span>
            <span className="mx-2 text-sm text-gray-400">or</span>
            <span className="h-px bg-gray-300 w-1/5"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
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
