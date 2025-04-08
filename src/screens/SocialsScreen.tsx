import React from 'react';
import type { AppScreenProps } from '../types';
import { motion, useReducedMotion } from 'framer-motion';
import { AtSign, Instagram, Clock } from 'lucide-react';
import { createTactileEffect } from '../App';

type SocialApp = {
  name: string;
  icon: React.ReactNode;
  url: string;
  position: number;
};

export const SocialsScreen: React.FC<AppScreenProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  
  const socials: SocialApp[] = [
    {
      name: "instagram",
      icon: <Instagram className="w-7 h-7 text-white" strokeWidth={1.5} />,
      url: "https://instagram.com/fareehasala",
      position: 1
    },
    {
      name: "retro",
      icon: <Clock className="w-7 h-7 text-white" strokeWidth={1.5} />,
      url: "https://retro.app",
      position: 2
    },
    {
      name: "email",
      icon: <AtSign className="w-7 h-7 text-white" strokeWidth={1.5} />,
      url: "mailto:fareeha_s@icloud.com",
      position: 3
    }
  ];

  // Apple-like spring animation
  const springTransition = {
    type: "spring",
    damping: 30,
    stiffness: 400,
    mass: 0.8,
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.8 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    }
  };

  return (
    <div className="h-full py-6 px-5" onClick={(e) => e.stopPropagation()}>
      {/* iPhone-style grid container with 3 columns */}
      <motion.div 
        className="grid grid-cols-3 gap-x-5 mt-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {socials.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              ...springTransition,
              duration: prefersReducedMotion ? 0 : undefined
            }}
            className="flex flex-col items-center will-change-transform hardware-accelerated"
            onClick={(e) => {
              e.stopPropagation();
              createTactileEffect();
            }}
            variants={itemVariants}
            style={{ 
              willChange: 'transform, opacity'
            }}
          >
            <motion.div
              className="w-[55px] h-[55px] rounded-[12px] bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              whileHover={{ boxShadow: "0 0 10px 0 rgba(255, 255, 255, 0.15)" }}
              transition={springTransition}
            >
              {social.icon}
            </motion.div>
            <span className="text-[11px] text-white font-normal mt-[5px] tracking-wide">{social.name}</span>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};