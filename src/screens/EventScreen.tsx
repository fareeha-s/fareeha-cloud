import React, { useState, useEffect } from 'react';
import type { AppScreenProps } from '../types';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import { createTactileEffect } from '../App';
import { PartifulEvent } from '../components/PartifulEvent';
import { ChevronRight } from 'lucide-react';

// Declare the global window property for TypeScript
declare global {
  interface Window {
    noteScreenBackHandler?: () => boolean;
    eventScreenBackHandler?: () => boolean;
  }
}

type EventItem = {
  id: number;
  title: string;
  date: string;
  clickable: boolean;
  timeframe: 'upcoming' | 'past';
};

export const EventScreen: React.FC<AppScreenProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  const [showPartiful, setShowPartiful] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const chevronControls = useAnimation();
  
  // Add a special handler for the main App's back button
  useEffect(() => {
    // If we are showing Partiful and the App's back button is clicked,
    // we should go back to the event list first instead of closing the app
    const handleAppBackClick = () => {
      if (showPartiful) {
        setShowPartiful(false);
        createTactileEffect();
        return true; // Event was handled
      }
      return false; // Let App handle the default behavior
    };
    
    // Add this handler to window to be accessible by the App component
    window.eventScreenBackHandler = handleAppBackClick;
    
    // Clean up
    return () => {
      // @ts-ignore
      delete window.eventScreenBackHandler;
    };
  }, [showPartiful]);
  
  // Run a subtle animation sequence on first render for mobile users
  useEffect(() => {
    if (!hasInteracted && !prefersReducedMotion) {
      // Subtle chevron pulse animation for the first event
      const pulseAnimation = async () => {
        await chevronControls.start({
          x: [0, 3, 0],
          opacity: [0.5, 0.8, 0.5],
          transition: { duration: 1.4, ease: "easeInOut", times: [0, 0.5, 1] }
        });
        
        // Wait a bit then do it again, more subtly
        setTimeout(async () => {
          await chevronControls.start({
            x: [0, 2, 0],
            opacity: [0.5, 0.7, 0.5],
            transition: { duration: 1, ease: "easeInOut", times: [0, 0.5, 1] }
          });
        }, 3000);
      };
      
      pulseAnimation();
    }
  }, [chevronControls, prefersReducedMotion, hasInteracted]);
  
  const events: EventItem[] = [
    {
      id: 1,
      title: "mental static",
      date: "31/03/25",
      clickable: true,
      timeframe: 'upcoming'
    },
    {
      id: 2,
      title: "strawberry hour",
      date: "15/05/25",
      clickable: false,
      timeframe: 'upcoming'
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
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
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

  // Subtle chevron animation variants
  const chevronVariants = {
    initial: { x: 0 },
    hover: { x: 2, transition: { repeat: 0, duration: 0.3 } }
  };

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  if (showPartiful) {
    return (
      <div 
        className="h-full w-full overflow-hidden" 
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <PartifulEvent 
          onBack={() => {
            setShowPartiful(false);
            createTactileEffect();
          }}
        />
      </div>
    );
  }

  // Filter events by timeframe
  const upcomingEvents = events.filter(event => event.timeframe === '');
  const pastEvents = events.filter(event => event.timeframe === 'past');

  return (
    <div 
      className="h-full w-full" 
      onClick={(e) => {
        e.stopPropagation();
        handleInteraction();
      }}
      onTouchStart={handleInteraction}
    >
      <motion.div 
        className="h-full overflow-y-auto scrollbar-subtle"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="space-y-4 p-6">
          {/* Upcoming events section */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                Previous 30 Days
              </h2>
              <div className="space-y-1">
                {upcomingEvents.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    variants={itemVariants}
                    className={`flex cursor-pointer group px-1 py-1 rounded-md ${!event.clickable ? 'opacity-60' : ''} ${event.clickable ? 'hover:bg-white/5 active:bg-white/10' : ''} relative`}
                    onClick={(e) => {
                      if (event.clickable) {
                        e.stopPropagation();
                        createTactileEffect();
                        setShowPartiful(true);
                      }
                    }}
                    whileHover={event.clickable ? { scale: 1.01 } : {}}
                    whileTap={event.clickable ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-5 h-5 flex-shrink-0 flex items-start justify-center pt-0.5 text-white/50">
                      <motion.div
                        variants={chevronVariants}
                        initial="initial"
                        whileHover="hover"
                        animate={index === 0 && !hasInteracted ? chevronControls : undefined}
                      >
                        <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                      </motion.div>
                    </div>
                    <div className="ml-1 flex-1 flex justify-between">
                      <div className="flex-1 pr-3">
                        <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 self-start">
                        <span className="text-xs text-white/40 whitespace-nowrap pt-0.5">
                          {event.date}
                        </span>
                      </div>
                    </div>
                    {event.clickable && !hasInteracted && index === 0 && (
                      <div className="absolute right-3" style={{ position: 'absolute', width: '10px', height: '10px' }}>
                        <motion.div 
                          className="w-2 h-2 rounded-full bg-white/70" 
                          initial={{ opacity: 0.7 }}
                          animate={{ 
                            opacity: [0.5, 0.9, 0.5],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            repeatType: "reverse", 
                            duration: 1.5,
                            repeatDelay: 1
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past events section (if any added later) */}
          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                Past Events
              </h2>
              <div className="space-y-1">
                {pastEvents.map(event => (
                  <motion.div 
                    key={event.id}
                    variants={itemVariants}
                    className="flex cursor-pointer group px-1 py-1 rounded-md opacity-60"
                  >
                    <div className="w-5 h-5 flex-shrink-0 flex items-start justify-center pt-0.5 text-white/50">
                      <ChevronRight size={16} />
                    </div>
                    <div className="ml-1 flex-1 flex justify-between">
                      <div className="flex-1 pr-3">
                        <h3 className="text-sm font-normal text-white/90 break-words">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 self-start">
                        <span className="text-xs text-white/40 whitespace-nowrap pt-0.5">
                          {event.date}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};