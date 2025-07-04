import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { LoadingProvider } from './context/LoadingContext';

createRoot(document.getElementById('root')).render(
   
  <StrictMode>
    <LoadingProvider>
    <App />
    </LoadingProvider>
  </StrictMode>,
)
