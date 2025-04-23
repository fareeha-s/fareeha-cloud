import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add spotify auth listener
window.addEventListener('message', async (event) => {
  // Check for spotify auth success message
  if (event.data && event.data.type === 'spotify-auth-success') {
    console.log('Spotify auth success!', event.data);
    try {
      // Fetch recently played tracks
      const response = await fetch('/spotify-widget/api/spotify/recently-played');
      const data = await response.json();
      // Store the data in localStorage for the main app to use
      localStorage.setItem('spotifyRecentlyPlayed', JSON.stringify(data));
      
      // Dispatch a custom event that the main app can listen for
      window.dispatchEvent(new CustomEvent('spotify-data-updated'));
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    }
  }
});

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


