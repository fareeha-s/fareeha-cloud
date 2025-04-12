import React from 'react';
import type { AppScreenProps } from '../types';
import { motion, useReducedMotion } from 'framer-motion';
import { Send } from 'lucide-react';
import { createTactileEffect } from '../App';

type SocialApp = {
  name: string;
  icon: React.ReactNode | string;
  url: string;
  position: number;
  isCustomIcon?: boolean;
  customStyles?: string;
};

export const SocialsScreen: React.FC<AppScreenProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  
  const socials: SocialApp[] = [
    {
      name: "instagram",
      icon: "/icons/apps/instagram.png",
      url: "https://instagram.com/fareehasala",
      position: 1,
      isCustomIcon: true
    },
    {
      name: "empty1",
      icon: null,
      url: "#",
      position: 2
    },
    {
      name: "email",
      icon: <Send className="w-7 h-7 text-white/90" strokeWidth={1.5} />,
      url: "mailto:fareeha_s@icloud.com",
      position: 3,
      customStyles: "bg-white/15 backdrop-blur-lg border border-white/20"
    },
    {
      name: "retro",
      icon: "/icons/apps/retro.jpg",
      url: "https://retro.app/@fareeha",
      position: 4,
      isCustomIcon: true
    },
    {
      name: "kineship",
      icon: "/icons/apps/kineship.svg",
      url: "https://kineship.com",
      position: 5,
      isCustomIcon: true
    },
    {
      name: "empty3",
      icon: null,
      url: "#",
      position: 6
    },
    {
      name: "corner",
      icon: "/icons/apps/corner.jpg",
      url: "https://www.corner.inc/fareeha",
      position: 7,
      isCustomIcon: true
    },
    {
      name: "airbuds",
      icon: "/icons/apps/airbuds.png",
      url: "https://i.airbuds.fm/fareehas/pC4Nm0VR4i",
      position: 8,
      isCustomIcon: true
    },
    {
      name: "strava",
      icon: "/icons/apps/strava.png",
      url: "https://strava.app.link/PzFPfOvKpSb",
      position: 9,
      isCustomIcon: true
    }
  ];

  // Reorder socials to ensure icons are in correct positions
  socials.sort((a, b) => a.position - b.position);

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
        staggerChildren: 0,
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
        stiffness: 350,
        damping: 25,
        duration: 0.25
      }
    }
  };

  // Common shadow style for all icons
  const iconShadowStyle = "shadow-lg hover:shadow-xl transition-shadow";
  
  // Common 3D effect style for all icons
  const icon3DStyle = "transform transition-transform will-change-transform";

  return (
    <motion.div 
      className="flex flex-col justify-center items-center h-full w-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-6 mx-auto">
        {socials.map((social, index) => {
          // If there's no icon, render a placeholder div instead of a link
          if (!social.icon) {
            return (
              <motion.div
                key={index}
                className="w-[60px] h-[60px]" // Just takes space but not interactive
                variants={itemVariants}
              />
            );
          }
          
          // For items with icons, render the clickable links
          return (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={{
                ...springTransition,
                duration: prefersReducedMotion ? 0 : undefined
              }}
              className="flex items-center justify-center will-change-transform"
              onClick={(e) => {
                e.stopPropagation();
                createTactileEffect();
              }}
              variants={itemVariants}
              style={{ 
                willChange: 'transform, opacity'
              }}
            >
              {social.customStyles ? (
                <motion.div
                  className={`w-[60px] h-[60px] rounded-[14px] flex items-center justify-center ${social.customStyles} ${iconShadowStyle} ${icon3DStyle}`}
                  whileHover={{ 
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(255, 255, 255, 0.1) inset" 
                  }}
                  transition={springTransition}
                >
                  {social.icon}
                </motion.div>
              ) : social.isCustomIcon ? (
                <motion.div
                  className={`w-[60px] h-[60px] rounded-[14px] overflow-hidden border border-white/20 ${iconShadowStyle} ${icon3DStyle}`}
                  whileHover={{ 
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(255, 255, 255, 0.1) inset" 
                  }}
                  transition={springTransition}
                >
                  <img 
                    src={social.icon as string} 
                    alt={social.name} 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              ) : (
                <motion.div
                  className={`w-[60px] h-[60px] rounded-[14px] bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center ${iconShadowStyle} ${icon3DStyle}`}
                  whileHover={{ 
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(255, 255, 255, 0.1) inset" 
                  }}
                  transition={springTransition}
                >
                  {social.icon}
                </motion.div>
              )}
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};