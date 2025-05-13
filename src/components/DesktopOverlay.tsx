import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppBackground from './AppBackground';

// Remove NoteItem import and note prop from interface
interface DesktopOverlayProps {}

const DesktopOverlay: React.FC<DesktopOverlayProps> = () => { // Remove note prop from signature
  const isLoaded = true;

  // Updated links: softer blush color (#FFF0F0), no semibold, font-medium weight
  const contentBeforeLoveList = `\
<span style="font-size: 24px; font-weight: 500; line-height: 1.3;">Hey, I\'m Fareeha ✨</span>

I love watching people light up around each other - my compass seems to keep pointing that way.

I\'m building <a href="https://kineship.com" target="_blank" rel="noopener noreferrer" style="color: #FFE7EA; font-weight: normal; text-decoration: underline; text-decoration-color: rgba(255, 255, 255, 0.1);" class="hover:decoration-[rgba(255,255,255,0.4)] transition-all" onclick="event.stopPropagation()">Kineship</a>, a social layer for workouts. The north star is to design tech that <a href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.717164/full" target="_blank" rel="noopener noreferrer" style="color: #FFE7EA; font-weight: normal; text-decoration: underline; text-decoration-color: rgba(255, 255, 255, 0.1);" class="hover:decoration-[rgba(255,255,255,0.4)] transition-all" onclick="event.stopPropagation()">centres human longevity</a>.

If this feels like your kind of world, I\'d love to <a href="mailto:fareeha@kineship.com" style="color: #FFE7EA; font-weight: normal; text-decoration: underline; text-decoration-color: rgba(255, 255, 255, 0.1);" class="hover:decoration-[rgba(255,255,255,0.4)] transition-all" onclick="event.stopPropagation()">hear from you.</a>
`;

  const contentAfterLoveList = ``; // This is now empty

  return (
    <div className="fixed inset-0 flex items-center justify-center p-8">
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
            style={{ opacity: 0.4, fontWeight: 'normal', fontSize: '0.8em' }} 
            className="flex items-center justify-center"
          >
            Fold this site in horizontally to switch to app mode.
          </span>
        </motion.div>

      </div>
    </div>
  );
};

export default DesktopOverlay; 