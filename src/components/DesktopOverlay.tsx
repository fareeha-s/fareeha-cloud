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
  // Add state for 'shipped by' intro animation
  const [showShippedBy, setShowShippedBy] = useState(true);

  // Hide 'shipped by' after 3 seconds on first visit
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowShippedBy(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Add function to handle video links
  const handleVideoLink = (url: string) => {
    setVideoUrl(url);
  };

  // Function to close video player
  const closeVideoPlayer = () => {
    setVideoUrl(null);
  };

  const contentBeforeLoveList = `\
<span style="font-size: clamp(20px, 4vw, 24px); font-weight: 500; line-height: 1.3;">Hey, I\'m Fareeha ✨</span>

I love watching people light up around each other - my compass seems to keep pointing that way.

I\'m with an AI lab exploring a new class of infrastructure for agent builders. I also built <a href="https://kineship.com" target="_blank" rel="noopener noreferrer" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation()">Kineship</a>, a social layer for workouts.

In Autumn 2026, I'll be producing a fashion show. It\'s ambitious. More news to come.

<span style="font-weight: bold;">previous projects:</span>
▹ systems design for boutique wellness spaces <a href="https://silicon-divan-443.notion.site/Retention-System-Design-for-Boutique-Fitness-1f7a4827ee3380599df9c1afc31689f1" target="_blank" rel="noopener noreferrer" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation()">(infra mapping, product integration)</a>
▹ social design in health & community <span style="color: rgba(255, 255, 255, 0.65);"> (</span><a href="https://fareeha-s.github.io/Tessel/" target="_blank" rel="noopener noreferrer" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation()">tessel</a><span style="color: rgba(255, 255, 255, 0.65);">, <a href="https://impact.ventureforcanada.ca/2023/programs/fellowship-alumni" target="_blank" rel="noopener noreferrer" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation()">vfc</a><span style="color: rgba(255, 255, 255, 0.65);">, </span><a href="javascript:void(0)" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation(); document.handleVideoLink = function(url) { window.desktopHandleVideoLink(url) }; window.desktopHandleVideoLink('https://youtu.be/VMxSzVREUgY');">h&s gala</a><span style="color: rgba(255, 255, 255, 0.65);">, </span><a href="javascript:void(0)" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation(); document.handleVideoLink = function(url) { window.desktopHandleVideoLink(url) }; window.desktopHandleVideoLink('https://youtu.be/vXCGUXAQfOs?si=JUGWTpF-NB_2DE3a');">dc fashion show</a><span style="color: rgba(255, 255, 255, 0.65);"></span>)</span>
▹ winning team, healthcare innovation <span style="color: rgba(255, 255, 255, 0.65);"> (</span><a href="https://silicon-divan-443.notion.site/MedBridge-235a4827ee33804b8a05c087946d7a80" target="_blank" rel="noopener noreferrer" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation()">mit bc x harvard med</a><span style="color: rgba(255, 255, 255, 0.65);">)</span>
▹ policy work on the ethical implications of AI on youth <span style="color: rgba(255, 255, 255, 0.65);"> (</span><a href="javascript:void(0)" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation(); document.handleVideoLink = function(url) { window.desktopHandleVideoLink(url) }; window.desktopHandleVideoLink('https://www.youtube.com/watch?v=6vqmUHDibTI&t=600s');">united nations x mbc</a><span style="color: rgba(255, 255, 255, 0.65);">)</span>
▹ ice/breakers (<a href="https://www.producthunt.com/products/icebreakers-2?launch=icebreakers-b45694ac-4bea-4ec9-870f-67a447107f26" target="_blank" rel="noopener noreferrer" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation()">#3 on ProductHunt</a>)

If this feels like your kind of world, I\'d love to <a href="mailto:fareeha@kineship.com" class="custom-pink-link custom-pink-link--desktop-overlay" onclick="event.stopPropagation()">hear from you.</a>
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
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-8 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AppBackground isLoaded={isLoaded} />
      
      <div className="relative w-full max-w-4xl mx-auto my-auto">
        <motion.h2 
          className="absolute top-[-24px] right-9 text-[18px] font-semibold text-white z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.9, ease: [0.25, 0.8, 0.25, 1] } }}
          style={{ 
            textShadow: '0px 1px 1px rgba(0, 0, 0, 0.3)' 
          }}
        >
          <span className="flex items-center">
            <a href="https://github.com/fareeha-s" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); window.open('https://github.com/fareeha-s', '_blank'); }} style={{ cursor: 'pointer' }} className="github-link inline-block relative group">
              <img 
                src="./icons/hosts/fareeha.jpg" 
                alt="Fareeha" 
                className="rounded-full w-12 h-12 object-cover border border-white/20" 
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
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                style={{
                  stroke: 'white', 
                  strokeWidth: 2.5, 
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  zIndex: 99999,
                  pointerEvents: 'none' // Allow clicks to pass through to the <a> tag
                }}
              >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
            </a>
          </span>
        </motion.h2>

        <motion.div
          className="relative w-full max-w-4xl mx-auto bg-white/8 border border-white/20 rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 overflow-y-auto max-h-[85vh] z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
          }}
        >
          <div
            className="text-base sm:text-lg leading-relaxed text-white/90 prose prose-invert max-w-none lora-note-content font-medium"
            style={{ whiteSpace: 'pre-line', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}
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
          style={{ marginTop: 'clamp(1em, 2vh, 1.5em)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <span
            onClick={onClose}
            style={{ 
              opacity: 0.7, 
              fontWeight: 'normal', 
              fontSize: 'clamp(0.8em, 1.5vw, 0.9em)',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease, transform 0.2s ease'
            }}
            className="flex items-center justify-center hover:opacity-70 active:opacity-90"
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0.5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Click here to turn this site into an app.
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