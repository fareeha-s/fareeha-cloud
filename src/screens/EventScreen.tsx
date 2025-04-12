import React, { useState, useEffect, useRef } from 'react';
import type { AppScreenProps } from '../types';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import { createTactileEffect } from '../App';
import { PartifulEvent } from '../components/PartifulEvent';
import { ChevronRight } from 'lucide-react';
import { events, EventItem } from '../data/events';

// Declare the global window property for TypeScript
declare global {
  interface Window {
    noteScreenBackHandler?: () => boolean;
    eventScreenBackHandler?: () => boolean;
    initialEventId?: number;
    isViewingEventDetail?: boolean; // Add new property to control container shape
  }
}

export const EventScreen: React.FC<AppScreenProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  const [showPartiful, setShowPartiful] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [widgetEventId, setWidgetEventId] = useState<number | null>(null);
  const [defaultHighlightEventId, setDefaultHighlightEventId] = useState<number | null>(null);
  
  // Create a ref to use for directly setting the window property
  const isViewingDetailRef = useRef(false);
  
  // Function to update both the ref and window property
  const setIsViewingDetail = (value: boolean) => {
    isViewingDetailRef.current = value;
    window.isViewingEventDetail = value;
    console.log('Setting isViewingEventDetail via function:', value);
    
    // Directly apply the class to the DOM as a fallback mechanism
    try {
      const mainContainer = document.querySelector('.main-container');
      if (mainContainer) {
        if (value) {
          mainContainer.classList.add('portrait-container');
          console.log('Directly added portrait-container class to DOM');
        } else {
          mainContainer.classList.remove('portrait-container');
          console.log('Directly removed portrait-container class from DOM');
        }
      }
    } catch (e) {
      console.error('Error directly manipulating DOM:', e);
    }
  };

  // Add a special handler for the main App's back button
  useEffect(() => {
    // If we are showing Partiful and the App's back button is clicked,
    // we should go back to the event list first instead of closing the app
    const handleAppBackClick = () => {
      if (showPartiful) {
        // Set flag to false BEFORE state changes for immediate effect
        setIsViewingDetail(false);
        setShowPartiful(false);
        setSelectedEventId(null);
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
      // @ts-ignore
      delete window.isViewingEventDetail;
    };
  }, [showPartiful]);

  // Restore this useEffect to ensure the portrait mode is properly maintained
  useEffect(() => {
    // Set the flag to control the container shape
    setIsViewingDetail(showPartiful);
    console.log('Setting isViewingEventDetail:', showPartiful);
    
    return () => {
      // Clean up when component unmounts
      setIsViewingDetail(false);
      console.log('Cleanup: Setting isViewingEventDetail to false');
    };
  }, [showPartiful]);

  // Check for initial event ID (similar to what we did for notes)
  useEffect(() => {
    // Check if the user came from the widget
    if (window.initialEventId) {
      const eventToOpen = events.find(event => event.id === window.initialEventId);
      if (eventToOpen) {
        setWidgetEventId(eventToOpen.id); // Store the widget event ID
        
        // We no longer automatically open the event detail
        // Just set the widget event ID so the pulsing dot shows up
      }
      // Clear the initialEventId after using it
      window.initialEventId = undefined;
    } else {
      // User didn't come from the widget, so set up the default highlight
      // Sort all events to get the most recent upcoming event as default to highlight
      const sortedEvents = [...events].sort((a, b) => {
        // First prioritize upcoming events
        if (a.timeframe === 'upcoming' && b.timeframe !== 'upcoming') return -1;
        if (a.timeframe !== 'upcoming' && b.timeframe === 'upcoming') return 1;
        
        // Then sort by date (most recent first)
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        
        // Only for upcoming events, sort by date (soonest first)
        if (a.timeframe === 'upcoming' && b.timeframe === 'upcoming') {
          if (yearA !== yearB) return yearA - yearB;
          if (monthA !== monthB) return monthA - monthB;
          return dayA - dayB;
        }
        
        // For past events, sort by date (most recent first)
        if (yearB !== yearA) return yearB - yearA;
        if (monthB !== monthA) return monthB - monthA;
        return dayB - dayA;
      });
      
      // Find the first clickable event to highlight
      const firstClickableEvent = sortedEvents.find(event => event.clickable);
      if (firstClickableEvent) {
        setDefaultHighlightEventId(firstClickableEvent.id);
      } else if (sortedEvents.length > 0) {
        // If no clickable events, just highlight the first one
        setDefaultHighlightEventId(sortedEvents[0].id);
      }
    }
  }, []);
  
  // Simple helper function to format date
  const getRelativeDate = (dateStr: string) => {
    const today = "08/04/25"; // Assume today is 8th April 2025
    if (dateStr === today) return "Today";
    if (dateStr === "07/04/25") return "Yesterday";
    return dateStr;
  };
  
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

  // Helper function to determine if an event should have a pulsing dot
  const shouldShowPulsingDot = (eventId: number) => {
    // If user came from widget, only highlight that specific event
    if (widgetEventId !== null) {
      return widgetEventId === eventId;
    }
    // Otherwise, highlight the default event (first in the list)
    return defaultHighlightEventId === eventId;
  };

  // Debug effect to monitor isViewingDetailRef changes
  useEffect(() => {
    console.log('showPartiful changed to:', showPartiful);
    console.log('isViewingDetailRef is now:', isViewingDetailRef.current);
    console.log('window.isViewingEventDetail is now:', window.isViewingEventDetail);
  }, [showPartiful]);

  if (showPartiful) {
    // Find the selected event or default to the first clickable one
    const selectedEvent = selectedEventId 
      ? events.find(event => event.id === selectedEventId) 
      : events.find(event => event.clickable);
      
    return (
      <div 
        className="h-full w-full overflow-hidden" 
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <PartifulEvent 
          eventData={selectedEvent}
          onBack={() => {
            // Set flag to false BEFORE state changes for immediate effect
            setIsViewingDetail(false);
            setShowPartiful(false);
            setSelectedEventId(null);
            createTactileEffect();
          }}
        />
      </div>
    );
  }

  // Filter events by timeframe
  const upcomingEvents = events.filter(event => event.timeframe === 'upcoming');
  const pastEvents = events.filter(event => event.timeframe === 'past');

  // Get all events for the "All" section, sorted by date (most recent first)
  const allEvents = [...events].sort((a, b) => {
    // Parse dates (assuming DD/MM/YY format)
    const [dayA, monthA, yearA] = a.date.split('/').map(Number);
    const [dayB, monthB, yearB] = b.date.split('/').map(Number);
    
    // Compare dates in reverse order (newest first)
    if (yearB !== yearA) return yearB - yearA;
    if (monthB !== monthA) return monthB - monthA;
    return dayB - dayA;
  });

  // Function to check if an event is within the past month
  const isPastMonth = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const eventDate = new Date(2000 + year, month - 1, day); // Convert YY to 20YY
    
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
    return eventDate >= oneMonthAgo && eventDate <= now;
  };

  // Get events from the past month
  const pastMonthEvents = allEvents.filter(event => isPastMonth(event.date));
  
  // Get all events that are not in the past month section
  const remainingEvents = allEvents.filter(event => !isPastMonth(event.date));

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
        <div className="space-y-3 p-6">
          {/* Past Month section */}
          {pastMonthEvents.length > 0 && (
            <div>
              <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                Past Month
              </h2>
              <div className="space-y-0.5">
                {pastMonthEvents.map((event, index) => (
                  <motion.div 
                    key={`past-month-${event.id}`}
                    className="flex group px-1 py-0.5 rounded-md hover:bg-white/5 active:bg-white/10 relative" 
                    onClick={(e) => {
                      if (event.clickable) {
                        e.stopPropagation();
                        createTactileEffect();
                        // Set flag BEFORE state changes for immediate effect
                        setIsViewingDetail(true);
                        console.log('Click handler: Setting isViewingEventDetail to true');
                        setSelectedEventId(event.id);
                        setShowPartiful(true);
                      }
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-white/50">
                      <motion.div
                        variants={chevronVariants}
                        initial="initial"
                        whileHover="hover"
                      >
                        <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                      </motion.div>
                    </div>
                    <div className="ml-1 flex-1 flex justify-between items-center">
                      <div className="flex-1 pr-3">
                        <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <span className="text-xs text-white/40 whitespace-nowrap">
                          {getRelativeDate(event.date)}
                        </span>
                      </div>
                    </div>
                    {shouldShowPulsingDot(event.id) && (
                      <div 
                        className="absolute -right-1 top-1/3 -translate-y-1/2" 
                      >
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

          {/* All events section */}
          {remainingEvents.length > 0 && (
            <div>
              <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                All
              </h2>
              <div className="space-y-0.5">
                {remainingEvents.map((event, index) => (
                  <motion.div 
                    key={`all-${event.id}`}
                    className="flex group px-1 py-0.5 rounded-md hover:bg-white/5 active:bg-white/10 relative" 
                    onClick={(e) => {
                      if (event.clickable) {
                        e.stopPropagation();
                        createTactileEffect();
                        // Set flag BEFORE state changes for immediate effect
                        setIsViewingDetail(true);
                        console.log('Click handler: Setting isViewingEventDetail to true');
                        setSelectedEventId(event.id);
                        setShowPartiful(true);
                      }
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-white/50">
                      <motion.div
                        variants={chevronVariants}
                        initial="initial"
                        whileHover="hover"
                      >
                        <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                      </motion.div>
                    </div>
                    <div className="ml-1 flex-1 flex justify-between items-center">
                      <div className="flex-1 pr-3">
                        <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <span className="text-xs text-white/40 whitespace-nowrap">
                          {getRelativeDate(event.date)}
                        </span>
                      </div>
                    </div>
                    {shouldShowPulsingDot(event.id) && (
                      <div 
                        className="absolute -right-1 top-1/3 -translate-y-1/2" 
                      >
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
        </div>
      </motion.div>
    </div>
  );
};