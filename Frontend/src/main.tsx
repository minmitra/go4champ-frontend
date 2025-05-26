import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthentiProvider } from './context/AuthentiContext.tsx'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthentiProvider>
        <App />
      </AuthentiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
