
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // CRITICAL: This imports Tailwind

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    // Removed StrictMode to prevent double-effect execution causing mock API rate limits
    <App />
  )
} else {
  console.error("Root element not found");
}
