import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { LibraryProvider } from './context/LibraryContext.jsx';
import { PlayerProvider } from './context/PlayerContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <LibraryProvider>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </LibraryProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
