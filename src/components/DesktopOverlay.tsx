import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppBackground from './AppBackground';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

// Add VideoPlayerOverlay component for in-screen video playback
const VideoPlayerOverlay = ({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) => {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) return null;

  // Calculate embedUrl
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&showinfo=1&playsinline=1`;

  // Create a portal to render directly to body
  return ReactDOM.createPortal(
    <motion.div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="w-full h-full flex items-center justify-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-8 right-8 z-10 p-3 bg-black/70 hover:bg-black/90 rounded-full text-white/80 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X size={28} />
        </button>
        <iframe
          className="w-full h-full max-h-screen"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>,
    document.body
  );
};

interface DesktopOverlayProps {
  onClose: () => void;
}

const DesktopOverlay: React.FC<DesktopOverlayProps> = ({ onClose }) => {
  const isLoaded = true;
  // Add state for video URL
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Add function to handle video links
  const handleVideoLink = (url: string) => {
    setVideoUrl(url);
  };

  // Function to close video player
  const closeVideoPlayer = () => {
    setVideoUrl(null);
  };

  const contentBeforeLoveList = `\
<span style="font-size: 24px; font-weight: 500; line-height: 1.3;">Hey, I\'m Fareeha ✨</span>

I love watching people light up around each other - my compass seems to keep pointing that way.

I\'m building <a href="https://kineship.com" target="_blank" rel="noopener noreferrer" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation()" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">Kineship</a>, a social layer for workouts. The north star is to design tech that <a href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.717164/full" target="_blank" rel="noopener noreferrer" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation()" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">centres human longevity</a>.

<span style="font-weight: bold;">in line with that:</span>
▹ early experience designer at <span style="color: rgba(255, 255, 255, 0.65);">[stealth]</span> <a href="https://www.hf0.com/" target="_blank" rel="noopener noreferrer" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation()" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">($1M pre-seed, HF0)</a>
▹ social design in health & community <span style="color: rgba(255, 255, 255, 0.65);">(</span><a href="https://fareeha-s.github.io/Tessel/" target="_blank" rel="noopener noreferrer" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation()" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">tessel</a><span style="color: rgba(255, 255, 255, 0.65);">, </span><a href="javascript:void(0)" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation(); document.handleVideoLink = function(url) { window.desktopHandleVideoLink(url) }; window.desktopHandleVideoLink('https://youtu.be/VMxSzVREUgY');" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">h&s gala</a><span style="color: rgba(255, 255, 255, 0.65);">, </span><a href="javascript:void(0)" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation(); document.handleVideoLink = function(url) { window.desktopHandleVideoLink(url) }; window.desktopHandleVideoLink('https://youtu.be/vXCGUXAQfOs?si=JUGWTpF-NB_2DE3a');" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">dc fashion show</a><span style="color: rgba(255, 255, 255, 0.65);">, </span><a href="https://impact.ventureforcanada.ca/2023/programs/fellowship-alumni" target="_blank" rel="noopener noreferrer" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation()" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">vfc</a><span style="color: rgba(255, 255, 255, 0.65);">)</span>
▹ winning team, healthcare innovation <span style="color: rgba(255, 255, 255, 0.65);">(</span><a href="javascript:void(0)" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation(); document.handleVideoLink = function(url) { window.desktopHandleVideoLink(url) }; window.desktopHandleVideoLink('https://youtu.be/u6_jdJ7YRXM?si=svadyVmXGiPOjPVR');" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">mit bc x harvard med</a><span style="color: rgba(255, 255, 255, 0.65);">)</span>

If this feels like your kind of world, I\'d love to <a href="mailto:fareeha@kineship.com" style="color: #FFE7EA; text-decoration: none; transition: all 0.15s ease-in-out; text-shadow: 0 0 0.8px rgba(255, 255, 255, 0.6); cursor: pointer; font-size: 1.05em;" onclick="event.stopPropagation()" onmouseover="this.style.color='#fff1f4'; this.style.textShadow='0 0 1.2px rgba(255, 255, 255, 0.8)'; this.style.transform='scale(1.02)'; this.style.display='inline-block';" onmouseout="this.style.color='#FFE7EA'; this.style.textShadow='0 0 0.8px rgba(255, 255, 255, 0.6)'; this.style.transform='scale(1)'; this.style.display='inline-block';">hear from you.</a>
`;

  const contentAfterLoveList = ``;

  // Make handleVideoLink available globally within the component's lifecycle
  React.useEffect(() => {
    // Expose the handleVideoLink function globally
    window.desktopHandleVideoLink = handleVideoLink;
    
    // Clean up when component unmounts
    return () => {
      delete window.desktopHandleVideoLink;
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-8 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AppBackground isLoaded={isLoaded} />
      
      <div className="relative w-full max-w-3xl mx-auto" style={{ marginTop: '-10rem' }}>
        <motion.h2 
          className="absolute top-[-18px] right-5 text-[18px] font-semibold text-white z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.9, ease: [0.25, 0.8, 0.25, 1] } }}
          style={{ 
            textShadow: '0px 1px 1px rgba(0, 0, 0, 0.3)' 
          }}
        >
          <span className="flex items-center">
            <a href="https://github.com/fareeha-s" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); window.open('https://github.com/fareeha-s', '_blank'); }} style={{ cursor: 'pointer', marginLeft: '6px' }} className="github-link inline-block relative group">
              <img 
                src="./icons/hosts/fareeha.jpg" 
                alt="Fareeha" 
                className="rounded-full w-8 h-8 object-cover border border-white/20" 
                style={{ 
                  zIndex: 10002,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.2) inset',
                  backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  transform: 'translateZ(0)',
                  transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.97) translateZ(0)';
                  e.currentTarget.style.boxShadow = '0 0px 1px rgba(0,0,0,0.1), 0 0 1px rgba(255,255,255,0.1) inset';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'translateZ(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.2) inset';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateZ(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2), 0 0 1px rgba(255,255,255,0.3) inset';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateZ(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.2) inset';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              />
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  cursor: 'pointer',
                  zIndex: 10000,
                  top: ' -4px',
                  right: ' -4px',
                  opacity: 1,
                  transition: 'none'
                }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  window.open('https://github.com/fareeha-s', '_blank');
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.9)';
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.65)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.45)';
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.65)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.45)';
                }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ stroke: 'white', strokeWidth: 2.5 }}>
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </div>
            </a>
          </span>
        </motion.h2>

        <motion.div
          className="relative w-full max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl shadow-lg p-12 overflow-y-auto max-h-[90vh] z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div
            className="text-lg leading-relaxed text-white/90 prose prose-invert max-w-none lora-note-content font-medium"
            style={{ whiteSpace: 'pre-line', fontSize: '1.15rem' }}
          >
            {/* Render content before list */}
            <div dangerouslySetInnerHTML={{ __html: contentBeforeLoveList }} />

            {/* Render content after list (now empty) */}
            {contentAfterLoveList && (
                 <div
                    style={{ marginTop: '1.5em' }}
                    dangerouslySetInnerHTML={{ __html: contentAfterLoveList }}
                />
            )}
          </div>
        </motion.div>

        {/* 'Fold this screen' text moved outside and below the main content container */}
        <motion.div 
          style={{ marginTop: '1.5em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <span
            onClick={onClose}
            style={{ 
              opacity: 0.4, 
              fontWeight: 'normal', 
              fontSize: '0.8em',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease, transform 0.2s ease'
            }}
            className="flex items-center justify-center hover:opacity-70 active:opacity-90"
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0.4';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            fold this page in horizontally to view more content.
          </span>
        </motion.div>
      </div>

      {/* Video player overlay */}
      <AnimatePresence>
        {videoUrl && (
          <VideoPlayerOverlay 
            videoUrl={videoUrl} 
            onClose={closeVideoPlayer} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add type declaration for global window properties
declare global {
  interface Window {
    desktopHandleVideoLink?: (url: string) => void;
  }
}

export default DesktopOverlay; 