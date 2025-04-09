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
    'StickyNote': <StickyNote className={`w-6 h-6 ${iconColors['StickyNote']}`} strokeWidth={1.5} />,
    'AtSign': <AtSign className={`w-6 h-6 ${iconColors['AtSign']}`} strokeWidth={1.5} />,
    'PartyPopper': <PartyPopper className={`w-6 h-6 ${iconColors['PartyPopper']}`} strokeWidth={1.5} />,
    'Partiful': <img src="/icons/partiful.png" alt="Partiful" className="w-6 h-6" />,
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
        className={`w-[55px] h-[55px] bg-white/15 backdrop-blur-sm border border-white/20 rounded-[12px] flex items-center justify-center shadow-sm will-change-transform`}
        whileHover={{ boxShadow: "0 0 10px 0 rgba(255, 255, 255, 0.1)" }}
        transition={springTransition}
      >
        {iconMap[icon] || <div className="w-6 h-6 text-white">?</div>}
      </motion.div>
      {showLabel && (
        <span className="text-[11px] text-white font-normal mt-[5px] tracking-wide text-center">{displayName}</span>
      )}
    </motion.div>
  );
});