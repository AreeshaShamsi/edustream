import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import React from 'react';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    signOut(auth).then(() => {
      navigate('/');
    });
  }, [navigate]);

  return <div className="p-8 text-center text-lg">Logging out...</div>;
};

export default Logout;