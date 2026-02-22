import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './routes/AppRoutes';
import './styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppRoutes />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '1rem',
          },
          success: {
            icon: '🎉',
            style: {
              background: '#10b981',
            },
          },
          error: {
            icon: '❌',
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </HelmetProvider>
  </React.StrictMode>
);