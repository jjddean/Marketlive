import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// main.tsx should be the "Entry Point" only.
// All Provider logic has been moved to App.tsx to avoid 
// the "Duplicate declaration" and "Router context" errors.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)