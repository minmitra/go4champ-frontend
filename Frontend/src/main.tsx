import { createRoot } from 'react-dom/client'
import './styles/index.css';
 import './styles/common.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthentiProvider } from './context/AuthentiContext.tsx'
import React from 'react'
import './i18n';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthentiProvider>
        <App />
      </AuthentiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
 