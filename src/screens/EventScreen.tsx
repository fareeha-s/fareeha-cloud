import React, { useState, useEffect, useRef } from 'react';
import type { AppScreenProps } from '../types';
import { motion, useReducedMotion, useAnimation, PanInfo, AnimatePresence } from 'framer-motion';
import { createTactileEffect } from '../App';
import { PartifulEvent } from '../components/PartifulEvent';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  
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

  // Modified to show swipe indicator when user scrolls to bottom of first event
  useEffect(() => {
    if (showPartiful && hasScrolledToBottom) {
      // Check localStorage to see if user has already used swipe
      const hasUsedSwipe = localStorage.getItem('hasUsedEventSwipe') === 'true';
      
      if (!hasUsedSwipe) {
        // Show the swipe indicator if user hasn't swiped before
        setShowSwipeIndicator(true);
      }
    } else {
      // Hide the indicator if not showing Partiful or not scrolled to bottom
      setShowSwipeIndicator(false);
    }
  }, [showPartiful, hasScrolledToBottom]);

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
    
    // Parse the date to get the month
    const [day, month, year] = dateStr.split('/').map(Number);
    
    // Convert month number to month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[month - 1];
    
    return monthName;
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
    // If user came from widget, highlight that specific event
    // but hide it once they've viewed it
    if (widgetEventId !== null && widgetEventId === eventId) {
      if (selectedEventId === eventId) {
        // The event is currently being viewed, so hide the dot
        return false;
      }
      // The event was just clicked from widget but not yet viewed
      return true;
    }

    // For non-widget clicks, check if this event has been viewed before
    const viewedEvents = JSON.parse(localStorage.getItem('viewedEvents') || '[]');
    if (viewedEvents.includes(eventId)) {
      return false;
    }
    
    // Check if this is first time use (no viewed events)
    const isFirstTimeUse = viewedEvents.length === 0;
    
    // If this is first time use, show the orb on the most recent upcoming event (2025 events)
    if (isFirstTimeUse) {
      // Get the top upcoming event or first event if none are upcoming
      const firstTimeUpcomingEvents = events.filter(event => event.timeframe === 'upcoming');
      if (firstTimeUpcomingEvents.length > 0) {
        // Sort by date (closest first, but ensuring 2025 events come before 2024 events)
        const sortedEvents = [...firstTimeUpcomingEvents].sort((a, b) => {
          const [dayA, monthA, yearA] = a.date.split('/').map(Number);
          const [dayB, monthB, yearB] = b.date.split('/').map(Number);
          
          // Convert to full years for proper comparison
          const fullYearA = 2000 + yearA;
          const fullYearB = 2000 + yearB;
          
          // Sort by year first - note we want newest years (e.g. 2025) first
          if (fullYearA !== fullYearB) return fullYearB - fullYearA;
          
          // Then by month
          if (monthA !== monthB) return monthA - monthB;
          
          // Then by day
          return dayA - dayB;
        });
        
        // Show orb on the first upcoming event
        return sortedEvents[0].id === eventId;
      } else if (events.length > 0) {
        // If no upcoming events, show orb on the first event
        return events[0].id === eventId;
      }
    }
    
    return false;
  };

  // Add function to mark event as viewed
  const markEventAsViewed = (eventId: number) => {
    const viewedEvents = JSON.parse(localStorage.getItem('viewedEvents') || '[]');
    if (!viewedEvents.includes(eventId)) {
      viewedEvents.push(eventId);
      localStorage.setItem('viewedEvents', JSON.stringify(viewedEvents));
    }
  };

  // Debug effect to monitor isViewingDetailRef changes
  useEffect(() => {
    console.log('showPartiful changed to:', showPartiful);
    console.log('isViewingDetailRef is now:', isViewingDetailRef.current);
    console.log('window.isViewingEventDetail is now:', window.isViewingEventDetail);
  }, [showPartiful]);

  const handleEventPress = (event: EventItem) => {
    // Mark event as viewed for the pulsing dot
    markEventAsViewed(event.id);
    
    // Check if we need to show partiful data
    if (event.clickable) {
      // Reset scroll state when showing a new event
      setHasScrolledToBottom(false);
      setSelectedEventId(event.id);
      setShowPartiful(true);
      createTactileEffect();
    }
  };

  if (showPartiful) {
    // Find the selected event or default to the first clickable one
    const selectedEvent = selectedEventId 
      ? events.find(event => event.id === selectedEventId) 
      : events.find(event => event.clickable);
    
    // Find the index of the current event
    const currentIndex = selectedEventId 
      ? events.findIndex(event => event.id === selectedEventId)
      : events.findIndex(event => event.clickable);
    
    // Calculate previous and next event indices (ensuring they're clickable)
    const getNextClickableEvent = (startIndex: number, direction: 'next' | 'prev') => {
      const totalEvents = events.length;
      let offset = direction === 'next' ? 1 : -1;
      let index = startIndex;
      
      // Loop through all events to find the next/prev clickable one
      for (let i = 0; i < totalEvents; i++) {
        index = (index + offset + totalEvents) % totalEvents; // Ensure wrap-around
        if (events[index].clickable) {
          return events[index].id;
        }
      }
      
      // If no clickable events found, return the original
      return events[startIndex].id;
    };
    
    const prevEventId = getNextClickableEvent(currentIndex, 'prev');
    const nextEventId = getNextClickableEvent(currentIndex, 'next');
    
    // Handler for swipe navigation
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Determine if the drag was significant enough to trigger navigation
      const dragThreshold = 50; // Minimum drag distance to trigger navigation
      
      if (info.offset.x > dragThreshold) {
        // Swiped right - go to previous event
        markEventAsViewed(prevEventId);
        setSelectedEventId(prevEventId);
        // Reset scroll state for the new event
        setHasScrolledToBottom(false);
        createTactileEffect();
        
        // Hide indicator permanently
        setShowSwipeIndicator(false);
        localStorage.setItem('hasUsedEventSwipe', 'true');
      } else if (info.offset.x < -dragThreshold) {
        // Swiped left - go to next event
        markEventAsViewed(nextEventId);
        setSelectedEventId(nextEventId);
        // Reset scroll state for the new event
        setHasScrolledToBottom(false);
        createTactileEffect();
        
        // Hide indicator permanently
        setShowSwipeIndicator(false);
        localStorage.setItem('hasUsedEventSwipe', 'true');
      }
    };
    
    return (
      <div className="h-full w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedEventId} // Important: This forces a re-render on event change
            className="h-full w-full"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            drag={prefersReducedMotion ? false : "x"}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            dragElastic={0}
            onDragEnd={handleDragEnd}
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
              onScrollToBottom={() => setHasScrolledToBottom(true)}
            />
            
            {/* Swipe indicator overlay - Apple-style */}
            <AnimatePresence>
              {showSwipeIndicator && (
                <motion.div 
                  className="absolute bottom-8 left-0 right-0 pointer-events-none flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-[6px] h-[6px] rounded-full bg-white opacity-40"
                      animate={{ opacity: [0.4, 0.6, 0.4] }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut" 
                      }}
                    />
                    <motion.div 
                      className="w-[6px] h-[6px] rounded-full bg-white" 
                    />
                    <motion.div 
                      className="w-[6px] h-[6px] rounded-full bg-white opacity-40"
                      animate={{ opacity: [0.4, 0.6, 0.4] }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 0.1
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
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
          {/* Partiful Events Explanation */}
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-white/60 text-[14px] px-2">
            Fun little gatherings I've enjoyed planning with friends. Hope this inspires!
            </p>
          </motion.div>
          {/* Past Month section */}
          {pastMonthEvents.length > 0 && (
            <div>
              <h2 className="text-white/60 text-[14px] font-medium uppercase tracking-wider mb-2 px-2">
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
                        handleEventPress(event);
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
                        <h3 className="text-base font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <span className="text-[14px] text-white/50 whitespace-nowrap">
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
              <h2 className="text-white/60 text-[14px] font-medium uppercase tracking-wider mb-2 px-2">
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
                        handleEventPress(event);
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
                        <h3 className="text-base font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <span className="text-[14px] text-white/50 whitespace-nowrap">
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