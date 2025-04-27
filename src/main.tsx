import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configure framer-motion for iOS-like rendering
if (typeof window !== 'undefined') {
  // Remove 60fps cap for smoother animations on high refresh rate displays
  // This will use the device's refresh rate for optimal smoothness
  window.requestAnimationFrame = function() {
    const originalRAF = window.requestAnimationFrame;
    return function(callback: FrameRequestCallback) {
      return originalRAF.call(window, callback);
    };
  }();
}

// Enable concurrent mode rendering for improved performance
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
