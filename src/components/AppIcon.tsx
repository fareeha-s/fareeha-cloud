import { motion, useReducedMotion } from 'framer-motion';
import React, { forwardRef } from 'react';
import { StickyNote, AtSign, PartyPopper } from 'lucide-react';
import { createTactileEffect } from '../App';

interface AppIconProps {
  icon: string;
  name: string;
  color: string;
  onClick: () => void;
  className?: string;
  showLabel?: boolean;
}

export const AppIcon = forwardRef<HTMLDivElement, AppIconProps>(({ 
  icon, 
  name, 
  color, 
  onClick, 
  className = '',
  showLabel = true
}, ref) => {
  const prefersReducedMotion = useReducedMotion();
  
  // iOS 2025 squircle icons with glassy depth (restrained)
  const iconMap: Record<string, React.ReactElement> = {
    'StickyNote': (
      <div className="w-full h-full flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '13px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
        }} />
        <StickyNote className="w-7 h-7 text-white/90 relative z-10" strokeWidth={1.5} />
      </div>
    ),
    'AtSign': (
      <div className="w-full h-full flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '13px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
        }} />
        <AtSign className="w-7 h-7 text-white/90 relative z-10" strokeWidth={1.5} />
      </div>
    ),
    'PartyPopper': (
      <div className="w-full h-full flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '13px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
        }} />
        <PartyPopper className="w-7 h-7 text-white/90 relative z-10" strokeWidth={1.5} />
      </div>
    ),
    'Partiful': (
      <div className="w-full h-full flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '13px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
        }} />
        <img src="./icons/apps/partiful.png" alt="Partiful" className="w-7 h-7 relative z-10 opacity-90" />
      </div>
    ),
  };

  // Apple-like spring animation
  const springTransition = {
    type: "spring",
    damping: 30,
    stiffness: 400,
    mass: 0.8,
    duration: prefersReducedMotion ? 0 : undefined
  };

  // Keep all names on one line
  const displayName = name;

  const handleClick = (e: React.MouseEvent) => {
    // For animation purposes, sometimes we need to prevent clicks
    if (className.includes('invisible')) return;
    
    // Create a quick pulse effect before launching
    createTactileEffect();
    
    // Allow the pulse effect to complete before launching the app
    setTimeout(() => {
      onClick();
    }, 10);
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
      onClick={handleClick}
      className={`flex flex-col items-center will-change-transform hardware-accelerated ${className}`}
      style={{ 
        willChange: 'transform, opacity'
      }}
    >
      <motion.div 
        className={`w-[60px] h-[60px] rounded-[14px] flex items-center justify-center will-change-transform relative overflow-hidden`}
        whileHover={{ scale: 1.05 }}
        transition={springTransition}
        style={{
          aspectRatio: "1/1"
        }}
      >
        {iconMap[icon] || <div className="w-7 h-7 text-white">?</div>}
      </motion.div>
      {showLabel && (
        <span 
          className="text-[14px] mt-[6px] text-center max-w-[70px]" 
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
            fontWeight: 500,
            letterSpacing: '0',
            lineHeight: '1.1',
            color: 'rgba(255, 255, 255, 0.95)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}
        >
          {displayName}
        </span>
      )}
    </motion.div>
  );
});