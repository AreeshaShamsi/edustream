// src/context/LoadingContext.jsx
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 z-[9999] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
