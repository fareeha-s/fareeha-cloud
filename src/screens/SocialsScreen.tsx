import React, { useState, useEffect } from 'react';
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
  const [randomizedSocials, setRandomizedSocials] = useState<SocialApp[]>([]);
  
  const socials: SocialApp[] = [
    {
      name: "strava",
      icon: "./icons/apps/strava.png",
      url: "https://strava.app.link/PzFPfOvKpSb",
      position: 1,
      isCustomIcon: true
    },
    {
      name: "instagram",
      icon: "./icons/apps/instagram.png",
      url: "https://instagram.com/fareehasala",
      position: 2,
      isCustomIcon: true
    },
    {
      name: "email",
      icon: <Send className="w-7 h-7 text-white/90" strokeWidth={1.5} />,
      url: "mailto:fareeha_s@icloud.com",
      position: 3,
      customStyles: "bg-white/15 backdrop-blur-lg border border-white/20"
    },
    {
      name: "empty1",
      icon: null,
      url: "#",
      position: 4
    },
    {
      name: "empty2",
      icon: null,
      url: "#",
      position: 5
    },
    {
      name: "kineship",
      icon: "./icons/apps/kineship.png",
      url: "https://kineship.com",
      position: 6,
      isCustomIcon: true
    },
    {
      name: "retro",
      icon: "./icons/apps/retro.jpg",
      url: "https://retro.app/@fareeha",
      position: 7,
      isCustomIcon: true
    },
    {
      name: "airbuds",
      icon: "./icons/apps/airbuds.png",
      url: "https://i.airbuds.fm/fareehas/pC4Nm0VR4i",
      position: 8,
      isCustomIcon: true
    },
    {
      name: "corner",
      icon: "./icons/apps/corner.jpg",
      url: "https://www.corner.inc/fareeha",
      position: 9,
      isCustomIcon: true
    }
  ];

  // Track whether this is the first render
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Randomize social app positions after the first render
  useEffect(() => {
    // Skip randomization on first render to show aesthetic default layout
    if (isFirstRender) {
      setIsFirstRender(false);
      setRandomizedSocials([...socials]);
      return;
    }

    // Create a copy of the socials array
    let socialsCopy = [...socials];
    
    // Find and remove the fixed position apps (email and corner)
    const emailApp = socialsCopy.find(app => app.name === "email");
    const cornerApp = socialsCopy.find(app => app.name === "corner");
    socialsCopy = socialsCopy.filter(app => app.name !== "email" && app.name !== "corner");
    
    // Determine corner position for Corner app
    const cornerPositions = [1, 3, 7, 9];
    let availableCorners = cornerPositions.filter(pos => pos !== 3); // Remove position 3 as it's reserved for email
    const randomCornerPosition = availableCorners[Math.floor(Math.random() * availableCorners.length)];
    
    // Create an array of available positions (excluding the chosen corner position and email position)
    const availablePositions = [1, 2, 4, 5, 6, 7, 8, 9].filter(
      pos => pos !== 3 && pos !== randomCornerPosition
    );
    
    // Shuffle the available positions
    const shuffledPositions = [...availablePositions].sort(() => Math.random() - 0.5);
    
    // Assign new random positions to each app
    socialsCopy.forEach((app, index) => {
      app.position = shuffledPositions[index];
    });
    
    // Add back the fixed position apps
    if (emailApp) socialsCopy.push(emailApp);
    if (cornerApp) {
      cornerApp.position = randomCornerPosition;
      socialsCopy.push(cornerApp);
    }
    
    // Sort by position to ensure correct rendering order
    socialsCopy.sort((a, b) => a.position - b.position);
    
    // Update state with randomized socials
    setRandomizedSocials(socialsCopy);
  }, [isFirstRender]); // Only depend on isFirstRender

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
        {(randomizedSocials.length > 0 ? randomizedSocials : socials).map((social, index) => {
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