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
  
  // Create a mapping of icon strings to components with soft accent colors
  const iconColors = {
    'StickyNote': 'text-white',
    'AtSign': 'text-white',
    'PartyPopper': 'text-white',
    'Partiful': 'text-white',
  };

  const iconMap: Record<string, React.ReactElement> = {
    'StickyNote': <StickyNote className={`w-7 h-7 ${iconColors['StickyNote']}`} strokeWidth={1.5} />,
    'AtSign': <AtSign className={`w-7 h-7 ${iconColors['AtSign']}`} strokeWidth={1.5} />,
    'PartyPopper': <PartyPopper className={`w-7 h-7 ${iconColors['PartyPopper']}`} strokeWidth={1.5} />,
    'Partiful': <img src="./icons/apps/partiful.png" alt="Partiful" className="w-7 h-7" />,
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
        className={`w-[60px] h-[60px] rounded-[14px] flex items-center justify-center shadow-sm will-change-transform relative overflow-hidden`}
        whileHover={{ boxShadow: "0 0 10px 0 rgba(255, 255, 255, 0.12)" }}
        transition={springTransition}
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderTopColor: "rgba(255, 255, 255, 0.25)",
          borderLeftColor: "rgba(255, 255, 255, 0.2)",
          borderBottomColor: "rgba(255, 255, 255, 0.08)",
          borderRightColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(255, 255, 255, 0.08) inset",
          aspectRatio: "1/1" /* Ensure perfect square */
        }}
      >
        {/* Bottom highlight */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none" 
          style={{
            background: "linear-gradient(to top, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0) 100%)"
          }}
        />
        {iconMap[icon] || <div className="w-7 h-7 text-white">?</div>}
      </motion.div>
      {showLabel && (
        <span 
          className="text-[11px] text-white mt-[5px] text-center" 
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            letterSpacing: '0.01em',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
            textShadow: '0px 1px 1px rgba(0, 0, 0, 0.3)'
          }}
        >
          {displayName}
        </span>
      )}
    </motion.div>
  );
});