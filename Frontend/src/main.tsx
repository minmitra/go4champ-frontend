import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'
import { AuthentiProvider } from './context/AuthentiContext.tsx'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthentiProvider>
        <App />
      </AuthentiProvider>
    </HashRouter>
  </React.StrictMode>
);
