import React, { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion, PanInfo } from 'framer-motion';
import { AppIcon } from './components/AppIcon';
import { NotesScreen } from './screens/NotesScreen';
import { SocialsScreen } from './screens/SocialsScreen';
import { EventScreen } from './screens/EventScreen';
import type { AppIcon as AppIconType } from './types';
import { Music, ChevronLeft, ChevronRight, StickyNote, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { getSession } from 'next-auth/react';

// Import shared notes data
import { notes } from './data/notes';
// Import shared events data
import { events } from './data/events';

// Global tactile effect function for better performance
export const createTactileEffect = () => {
  if (typeof window !== 'undefined') {
    // Check if an effect is already in progress
    if (document.querySelector('.tactile-effect')) return;
    
    requestAnimationFrame(() => {
      const element = document.createElement('div');
      element.className = 'fixed inset-0 bg-white/5 pointer-events-none z-50 tactile-effect';
      element.style.willChange = 'opacity';
      document.body.appendChild(element);
      
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Fade out smoothly
          element.style.transition = 'opacity 60ms ease';
          element.style.opacity = '0';
          
          setTimeout(() => {
            if (document.body.contains(element)) {
              document.body.removeChild(element);
            }
          }, 60);
        }, 20);
      });
    });
  }
};

// Haptic feedback function specifically for widget swiping
export const createSwipeHapticFeedback = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window !== 'undefined') {
    // Attempt to use native haptic feedback if available
    if (window.navigator && window.navigator.vibrate) {
      switch (intensity) {
        case 'light':
          window.navigator.vibrate(2);
          break;
        case 'medium':
          window.navigator.vibrate(5);
          break;
        case 'heavy':
          window.navigator.vibrate(8);
          break;
      }
    }
    
    // Also create a visual feedback (more subtle than tactile effect)
    requestAnimationFrame(() => {
      const element = document.createElement('div');
      element.className = 'fixed inset-0 bg-white/3 pointer-events-none z-50 swipe-effect';
      element.style.willChange = 'opacity';
      document.body.appendChild(element);
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          element.style.transition = 'opacity 40ms ease';
          element.style.opacity = '0';
          
          setTimeout(() => {
            if (document.body.contains(element)) {
              document.body.removeChild(element);
            }
          }, 40);
        }, 10);
      });
    });
  }
};

// Animation coordinates for Apple-like expansion
interface AnimationPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Define a proper type for Spotify tracks
type SpotifyTrack = {
  track: {
    name: string;
    artists: Array<{ name: string }>;
    album?: {
      name: string;
      images?: Array<{ url: string }>;
    };
    duration_ms: number;
    external_urls?: {
      spotify: string;
    };
  };
  played_at: string;
};

// Define types for our various widgets
type WidgetData = {
  type: 'notes' | 'partiful' | 'workout';
  title: string;
  subtitle: string;
  timestamp: string;
  timestampLabel: string;
  progress: number;
  iconBgColor: string;
};

// Simplified tactile effect for widget swipes
const createWidgetSwipeFeedback = () => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(3); // Subtle vibration feedback
  }
};

// Format date to relative terms with three-letter day abbreviations
const getRelativeDate = (dateStr: string) => {
  // Get current date
  const now = new Date();
  const today = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}`;
  
  // Get yesterday's date
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = `${String(yesterdayDate.getDate()).padStart(2, '0')}/${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}/${String(yesterdayDate.getFullYear()).slice(-2)}`;
  
  // Parse the provided date to get the day of week
  const [day, month, year] = dateStr.split('/').map(Number);
  const dateObj = new Date(2000 + year, month - 1, day);
  
  // Get day of week with 3-letter abbreviation
  const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayOfWeek = daysOfWeek[dateObj.getDay()];
  
  // Special cases for today and yesterday
  if (dateStr === today) return 'today';
  if (dateStr === yesterday) return 'yesterday';
  
  // For all other dates, simply return the 3-letter day
  return dayOfWeek;
};

function App() {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const appsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [appPosition, setAppPosition] = useState<AnimationPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAppElement, setCurrentAppElement] = useState<HTMLElement | null>(null);
  const [windowHeight, setWindowHeight] = useState('100vh');
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHighPerformanceDevice, setIsHighPerformanceDevice] = useState(false);
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([]);
  const [currentWidgetIndex, setCurrentWidgetIndex] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isWidgetHovered, setIsWidgetHovered] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [hasShownFirstDisplay, setHasShownFirstDisplay] = useState(false);
  const [lastManualNavigation, setLastManualNavigation] = useState<number | null>(null);
  
  // Check if this is the first visit
  useEffect(() => {
    // Check localStorage for previous visits
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      setIsFirstVisit(false);
    } else {
      // Mark as visited for future
      localStorage.setItem('hasVisitedBefore', 'true');
      setIsFirstVisit(true);
    }
  }, []);
  
  // Select notes based on visit history
  const selectedNote = useMemo(() => {
    // For first visit - show the "who am i again?" note
    if (isFirstVisit) {
      return notes.find(note => note.title.includes("who am i again")) || notes[0];
    } 
    // For subsequent visits - show random notes
    else {
      const randomIndex = Math.floor(Math.random() * notes.length);
      return notes[randomIndex];
    }
  }, [isFirstVisit]);
  
  // Select events based on visit history
  const selectedEvent = useMemo(() => {
    if (isFirstVisit) {
      // For first visit - show the most recent upcoming event
      const upcomingEvents = events.filter(event => event.timeframe === 'upcoming');
      return upcomingEvents[0] || events[0];
    } else {
      // For subsequent visits - show random events
      const randomIndex = Math.floor(Math.random() * events.length);
      return events[randomIndex];
    }
  }, [isFirstVisit]);
  
  // Use real notes data for the widgets
  const widgets: WidgetData[] = [
    {
      type: 'workout',
      title: 'barry\'s - lift x run',
      subtitle: '',
      timestamp: (() => {
        // Calculate date from two days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        // Format as DD/MM/YY to match getRelativeDate's expected format
        const day = String(twoDaysAgo.getDate()).padStart(2, '0');
        const month = String(twoDaysAgo.getMonth() + 1).padStart(2, '0');
        const year = String(twoDaysAgo.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;
        return getRelativeDate(formattedDate);
      })(),
      timestampLabel: 'kineship',
      progress: 80,
      iconBgColor: 'bg-[#62BE9C]/20'
    },
    {
      type: 'notes',
      title: selectedNote.title,
      subtitle: '',
      timestamp: getRelativeDate(selectedNote.date),
      timestampLabel: 'Last edited',
      progress: 65,
      iconBgColor: 'bg-[#FF8A5B]/20'
    },
    {
      type: 'partiful',
      title: selectedEvent.title,
      subtitle: '',
      timestamp: getRelativeDate(selectedEvent.date),
      timestampLabel: 'latest event',
      progress: 25,
      iconBgColor: 'bg-[#FF4081]/20'
    }
  ];
  
  // Update progress when tracks change
  useEffect(() => {
    if (recentTracks.length > 0) {
      const newProgress = Math.floor(Math.random() * 80) + 10;
      // setProgressPercent(newProgress);
    }
  }, [recentTracks]);
  
  // Rotate widgets every 8 seconds (longer to give more time to read)
  useEffect(() => {
    if (!prefersReducedMotion && !isWidgetHovered && !isSwiping) {
      // Use 1 second for the first display after page load, 6 seconds for all others
      const interval = !hasShownFirstDisplay ? 1000 : 5000;
      
      // Set up the interval
      const rotationInterval = setInterval(() => {
        // Check if we should pause rotation due to recent manual navigation
        const now = Date.now();
        if (lastManualNavigation && now - lastManualNavigation < 5000) {
          return; // Skip this rotation cycle if manual navigation was recent
        }
        
        setCurrentWidgetIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % widgets.length;
          return nextIndex;
        });
        
        // Mark that we've shown the first display
        if (!hasShownFirstDisplay) {
          setHasShownFirstDisplay(true);
        }
      }, interval);
      
      return () => clearInterval(rotationInterval);
    }
  }, [widgets.length, prefersReducedMotion, isWidgetHovered, hasShownFirstDisplay, lastManualNavigation, isSwiping]);
  
  // Detect device performance
  useEffect(() => {
    // Check if the device has been classified as high-performance by the script in index.html
    const isHighPerf = document.documentElement.classList.contains('high-performance-device');
    setIsHighPerformanceDevice(isHighPerf);
    
    // Also check for iPads and other larger screen tablets which typically have better performance
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /ipad/.test(userAgent) || 
                    (window.innerWidth >= 768 && /android/.test(userAgent)) ||
                    (/macintosh/.test(userAgent) && navigator.maxTouchPoints > 1);
    
    if (isTablet) {
      setIsHighPerformanceDevice(true);
    }
  }, []);
  
  // Set body to prevent scrolling and get actual window height
  useEffect(() => {
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Set the actual window height for mobile browsers where 100vh can be inconsistent
    const setHeight = () => {
      const vh = window.innerHeight;
      setWindowHeight(`${vh}px`);
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
      
      // Add additional handling for mobile devices to ensure full height
      document.body.style.height = `${vh}px`;
      document.documentElement.style.height = `${vh}px`;
    };
    
    // Set initial height
    setHeight();
    
    // Detect Apple devices
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh/.test(userAgent);
    setIsAppleDevice(isApple);
    
    // Update on resize
    window.addEventListener('resize', setHeight);
    window.addEventListener('orientationchange', setHeight);
    
    // Additional event for mobile browsers
    window.addEventListener('touchmove', () => setHeight(), { passive: true });
    
    // Optimize loading sequence - reduce initial delay to 100ms
    const initialTimer = setTimeout(() => {
      setIsLoaded(true);
      // Reduce secondary delay to 600ms
      const fullLoadTimer = setTimeout(() => {
        // setFullyLoaded(true);
        // Force recompute height to ensure proper display
        setHeight();
      }, 600); // Reduced from 1200ms
      return () => clearTimeout(fullLoadTimer);
    }, 100); // Reduced from 500ms
    
    return () => {
      window.removeEventListener('resize', setHeight);
      window.removeEventListener('orientationchange', setHeight);
      window.removeEventListener('touchmove', () => setHeight());
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      clearTimeout(initialTimer);
    };
  }, []);
  
  // Inject critical styles for proper mobile rendering
  useEffect(() => {
    // Create and inject critical styles to ensure proper rendering on mobile
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Force hardware acceleration */
      .will-change-transform {
        will-change: transform;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
      
      /* Ensure full height on mobile devices */
      html, body, #root {
        height: 100% !important;
        height: -webkit-fill-available !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        position: fixed !important;
        overflow: hidden !important;
        font-family: var(--font-sans) !important;
      }
      
      /* Fix for mobile browsers and notches */
      @supports (-webkit-touch-callout: none) {
        .h-screen, #root, body, html {
          height: -webkit-fill-available !important;
        }
      }
      
      /* Force entire page container */
      #root {
        position: fixed !important;
        inset: 0 !important;
        overflow: hidden !important;
        font-family: var(--font-sans) !important;
      }
      
      /* Viewport height fix for mobile browsers */
      @media screen and (max-width: 768px) {
        body, html, #root, .h-screen {
          height: 100% !important;
          min-height: 100% !important;
          max-height: 100% !important;
          font-family: var(--font-sans) !important;
        }
      }
      
      /* Keyframe animations for blur and background */
      @keyframes app-container-blur {
        0% { backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
        20% { backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
        40% { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
        60% { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        80% { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        100% { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
      }
      
      @keyframes app-container-blur-active {
        0% { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        100% { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      }
      
      @keyframes app-container-bg-fade {
        0% { background-color: rgba(0, 0, 0, 0.02); }
        25% { background-color: rgba(0, 0, 0, 0.05); }
        50% { background-color: rgba(0, 0, 0, 0.08); }
        75% { background-color: rgba(0, 0, 0, 0.12); }
        100% { background-color: rgba(0, 0, 0, 0.15); }
      }
      
      @keyframes app-container-bg-active {
        0% { background-color: rgba(0, 0, 0, 0.15); }
        100% { background-color: rgba(0, 0, 0, 0.3); }
      }
      
      /* Animation classes */
      .app-container-blur-animation {
        animation: app-container-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .app-container-blur-active-animation {
        animation: app-container-blur-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-blur-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .app-container-bg-animation {
        animation: app-container-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .app-container-bg-active-animation {
        animation: app-container-bg-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-bg-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      /* Music widget animations */
      @keyframes music-widget-blur {
        0% { backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
        50% { backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
        100% { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
      }
      
      @keyframes music-widget-bg-fade {
        0% { background-color: rgba(255, 255, 255, 0.03); }
        50% { background-color: rgba(255, 255, 255, 0.05); }
        100% { background-color: rgba(255, 255, 255, 0.07); }
      }
      
      .music-widget-blur-animation {
        animation: music-widget-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: music-widget-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .music-widget-bg-animation {
        animation: music-widget-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: music-widget-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // For icon masking/cloning during animation
  const [clonedAppIcon, setClonedAppIcon] = useState<{
    app: AppIconType | null;
    rect: DOMRect | null;
  }>({
    app: null,
    rect: null
  });

  const apps: AppIconType[] = [
    { id: 'notes', name: 'notes', icon: 'StickyNote', color: '', component: NotesScreen },
    { id: 'socials', name: 'socials', icon: 'AtSign', color: '', component: SocialsScreen },
    { id: 'partiful', name: 'partiful', icon: 'Partiful', color: '', component: EventScreen },
  ];

  // Handle app closing with proper animation
  const handleClose = () => {
    if (isAnimating) return;
    
    // Check if there's a specific screen back handler active
    // This allows screens like NotesScreen to handle internal navigation
    if (activeApp === 'notes' && window.noteScreenBackHandler && window.noteScreenBackHandler()) {
      return; // If the screen handler returns true, it handled the back action
    }
    
    // Check for event screen handler (partiful)
    if (activeApp === 'partiful' && window.eventScreenBackHandler && window.eventScreenBackHandler()) {
      return; // If the event screen handler returns true, it handled the back action
    }
    
    setIsAnimating(true);
    
    // Start closing animation
    setTimeout(() => {
      setActiveApp(null);
      setAppPosition(null);
      setClonedAppIcon({
        app: null,
        rect: null
      });
      // Reset animation state only after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 250);
    }, 50);
  };

  // True Apple-style app opening animation
  const handleAppClick = (appId: string) => {
    if (isAnimating) return;
    
    const appElement = appsRef.current.get(appId);
    const containerElement = mainContainerRef.current;
    
    if (!appElement || !containerElement) return;
    
    setIsAnimating(true);
    
    // Get app's absolute position
    const appRect = appElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();
    
    // Find the selected app
    const selectedApp = apps.find(app => app.id === appId) || null;
    
    // Store the app's position relative to the container
    setAppPosition({
      x: appRect.left - containerRect.left + (appRect.width / 2),
      y: appRect.top - containerRect.top + (appRect.height / 2),
      width: appRect.width,
      height: appRect.height
    });
    
    // Store a clone of the app icon for animation
    setClonedAppIcon({
      app: selectedApp,
      rect: appRect
    });
    
    // Set the current app element for scale calculations
    setCurrentAppElement(appElement);
    
    // Small delay to ensure animation settings are in place
    setTimeout(() => {
      setActiveApp(appId);
    }, 10);
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const ActiveComponent = activeApp ? apps.find(app => app.id === activeApp)?.component : null;
  
  // Get the display name for the active app, with a special case for partiful to show as parti-folio
  const activeAppName = activeApp ? 
    (activeApp === 'partiful' ? 'partifolio 🎉' : apps.find(app => app.id === activeApp)?.name) 
    : null;
  
  // Precise iOS app opening animation timing
  const appOpeningTransition = {
    type: "spring",
    stiffness: 350,
    damping: 35,
    mass: 1.2,
    duration: 0.3
  };

  // Handle navigation between apps
  const handleWidgetClick = (widgetType: string) => {
    // Special case for workout widget to navigate to kineship.com
    if (widgetType === 'workout') {
      // Remove the link to kineship.com
      // window.open('https://kineship.com', '_blank');
      // Simply navigate to the app screen instead
      handleAppClick(widgetType);
      return;
    }
    
    // Special case for notes widget to open the notes list
    if (widgetType === 'notes') {
      // Set up global variable to tell NotesScreen which note to highlight
      window.initialNoteId = selectedNote.id;
      handleAppClick(widgetType);
      return;
    }
    
    // Special case for partiful widget to open the specific event
    if (widgetType === 'partiful') {
      // Set up global variable to tell EventScreen which event to open
      window.initialEventId = selectedEvent.id;
    }
    
    // Navigate to the appropriate app screen for other widget types
    handleAppClick(widgetType);
  };

  // Function to handle swipe navigation - simpler approach
  const handlePrevWidget = () => {
    setCurrentWidgetIndex((prevIndex) => {
      return (prevIndex - 1 + widgets.length) % widgets.length;
    });
    createWidgetSwipeFeedback();
  };
  
  const handleNextWidget = () => {
    setCurrentWidgetIndex((prevIndex) => {
      return (prevIndex + 1) % widgets.length;
    });
    createWidgetSwipeFeedback();
  };

  return (
    <motion.div 
      className="h-screen w-screen fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{
        height: windowHeight,
        width: '100%',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={activeApp && !isAnimating ? handleClose : undefined}
      drag={false}
    >
      {/* Background Wrapper - Ensures full coverage */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Soft blur orbs */}
        <div 
          className="absolute top-[-25vh] right-[10vw] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-r from-[#88a5a3] to-[#b3c1bd] blur-[140px] will-change-transform" 
          style={{ 
            transform: 'translateZ(0)', 
            WebkitTransform: 'translateZ(0)',
            opacity: isLoaded ? 0.38 : 0,
            transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
        <div 
          className="absolute bottom-[-20vh] left-[-5vw] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#bad0c5] to-[#98aeae] blur-[120px] will-change-transform" 
          style={{ 
            transform: 'translateZ(0)', 
            WebkitTransform: 'translateZ(0)',
            opacity: isLoaded ? 0.3 : 0,
            transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
        
        {/* Simplified gradient overlays - more Safari friendly */}
        <div 
          className="absolute top-[20vh] left-[10vw] w-[35vw] h-[35vw] rounded-full bg-[#a0d8ef]/10 blur-[100px]" 
          style={{ 
            opacity: isLoaded ? 0.25 : 0,
            transition: 'opacity 1.2s ease'
          }}
        ></div>
        <div 
          className="absolute bottom-[25vh] right-[5vw] w-[30vw] h-[30vw] rounded-full bg-[#d4a5e5]/10 blur-[80px]" 
          style={{ 
            opacity: isLoaded ? 0.2 : 0,
            transition: 'opacity 1.2s ease'
          }}
        ></div>
        
        {/* Subtle grid overlay for depth - extends to all edges */}
        <div 
          className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA0KSIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMwek0wIDMwaDMwdjMwSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')]" 
          style={{
            opacity: isLoaded ? (isHighPerformanceDevice ? 0.12 : 0.08) : 0,
            transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
        
        {/* Additional subtle top gradient to enhance the Dynamic Island effect */}
        <div 
          className="absolute top-0 left-0 right-0 h-[15vh] bg-gradient-to-b from-[#0a0c10]/40 to-transparent" 
          style={{ 
            opacity: isLoaded ? 0.4 : 0,
            transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
      </div>

      <div 
        className="absolute flex flex-col items-center will-change-transform z-10"
        ref={mainContainerRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          WebkitTransform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          top: '45%',
          left: '50%',
          marginLeft: '-145px', // Half of the container width (290px/2)
          marginTop: '-170px',
        }}
      >
        {/* App name above the container - returning to original position */}
        <div 
          className="absolute top-[-60px] w-full flex justify-center items-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? '0' : '-10px'})`,
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.1s",
            height: "60px",
            pointerEvents: "none"
          }}
        >
          {activeApp ? (
            <motion.h2 
              className="text-xl text-white font-medium tracking-wide text-shadow-sm"
              initial={{ y: 0 }}
              animate={{ 
                y: [0, 10, 0],
                opacity: [1, 0.96, 1],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 4,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }
              }}
              style={{ 
                textShadow: '0 0 6px rgba(255, 255, 255, 0.2)',
                filter: 'drop-shadow(0 1px 1px rgba(255, 255, 255, 0.08))',
                position: 'relative',
                top: '2px'
              }}
            >
              {activeAppName}
              <motion.span 
                className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent to-white/5 opacity-0"
                animate={{
                  opacity: [0, 0.15, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                    repeatType: "reverse",
                    delay: 0.5
                  }
                }}
              />
            </motion.h2>
          ) : (
            /* Home screen title with enhanced styling */
            <motion.h2 
              className="text-2xl text-white font-medium tracking-wide text-right relative z-30 pointer-events-auto"
              initial={{ y: 0 }}
              animate={{ 
                y: [0, 12, 0],
                opacity: [1, 0.92, 1],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 5,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }
              }}
              style={{ 
                position: 'absolute',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.1))',
                bottom: '0',
                zIndex: 30,
                letterSpacing: '0.02em',
                right: '0'
              }}
            >
              <span className="relative inline-block">
                hi, it's fareeha 🫶
                <motion.span 
                  className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent to-white/5 opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                      repeatType: "reverse",
                      delay: 0.5
                    }
                  }}
                />
              </span>
            </motion.h2>
          )}
        </div>
        
        {/* Main container - with glass solid effect instead of blur */}
        <motion.div 
          className={`w-[290px] aspect-square rounded-[24px] overflow-hidden shadow-xl relative z-20 will-change-transform glass-solid main-container ${
            activeApp ? 'glass-solid-shine' : ''
          } ${activeApp === 'partiful' && typeof window !== 'undefined' && window.isViewingEventDetail ? 'portrait-container' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (activeApp && !isAnimating) handleClose();
          }}
          style={(() => {
            // Debug log for rendering
            if (activeApp === 'partiful') {
              console.log('App.tsx rendering - isViewingEventDetail:', typeof window !== 'undefined' ? window.isViewingEventDetail : 'undefined');
            }
            
            // We need to ensure that when in event detail view, the portrait styles are applied
            // This is a more reliable approach since window properties might be unreliable
            if (activeApp === 'partiful' && typeof window !== 'undefined' && window.isViewingEventDetail) {
              return {
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(255, 255, 255, 0.15) inset',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                opacity: 1,
                aspectRatio: '3/4',
                height: '390px',
                width: '290px',
              };
            }
            
            return {
              boxShadow: activeApp ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(255, 255, 255, 0.15) inset' : '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.12) inset',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              opacity: 1,
            };
          })()}
        >
          {/* Light reflection effects */}
          <div 
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] opacity-[0.03] rounded-full z-10 pointer-events-none" 
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
              transform: "rotate(-15deg)"
            }}
          />
          <div 
            className="absolute bottom-[5%] right-[5%] w-[30%] h-[30%] opacity-[0.12] rounded-full z-10 pointer-events-none" 
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
              transform: "rotate(15deg)"
            }}
          />
          
          {/* Edge highlights - diagonal light streaks */}
          <div 
            className="absolute top-[-5%] left-[-20%] w-[40%] h-[10%] opacity-[0.02] z-10 pointer-events-none" 
            style={{
              background: "linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
              transform: "rotate(35deg)",
              borderRadius: "50%"
            }}
          />
          
          {/* Bottom edge highlight - now lighter */}
          <div 
            className="absolute bottom-[0%] left-[5%] right-[5%] h-[10%] opacity-[0.08] z-10 pointer-events-none" 
            style={{
              background: "linear-gradient(to top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: "50%",
              filter: "blur(2px)"
            }}
          />
          
          {/* Home Screen Layer - Always present */}
          <div 
            className={`absolute inset-0 z-10 ${activeApp ? 'pointer-events-none' : ''}`}
            style={{
              opacity: activeApp ? 0 : 1,
              transition: 'opacity 0.2s ease-out',
            }}
          >
            <div className="h-full flex flex-col pt-5 px-5 pb-5 will-change-transform" style={{ opacity: 1.1 }}>
              {/* App icons */}
              <div className="grid grid-cols-3 gap-y-5 gap-x-4 mb-6 mt-2">
                {apps.map((app) => (
                  <AppIcon
                    key={app.id}
                    icon={app.icon}
                    name={app.name}
                    color={app.color}
                    onClick={() => !isAnimating && handleAppClick(app.id)}
                    ref={(el) => {
                      if (el) appsRef.current.set(app.id, el);
                    }}
                    className={clonedAppIcon.app?.id === app.id && activeApp ? 'invisible' : ''}
                  />
                ))}
              </div>
              
              {/* Empty space to push widget down */}
              <div className="flex-grow"></div>
              
              {/* Rotating Widget */}
              <AnimatePresence mode="wait">
              <motion.div 
                  ref={widgetRef}
                  key={`widget-${currentWidgetIndex}`}
                  className={`w-full mt-auto rounded-[16px] overflow-hidden shadow-sm mb-1 will-change-transform ${isLoaded ? 'music-widget-bg-animation' : ''}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.32, 0.72, 0, 1] // Apple's default cubic-bezier easing
                  }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                  onClick={() => handleWidgetClick(widgets[currentWidgetIndex].type)}
                  onMouseEnter={() => setIsWidgetHovered(true)}
                  onMouseLeave={(e) => {
                    setIsWidgetHovered(false);
                    // Also handle swipe-related cleanup
                    setSwipeStartX(null);
                    setSwipeDirection(null);
                  }}
                  // Implement a direct, simpler swipe detection system
                  onTouchStart={(e) => {
                    setSwipeStartX(e.touches[0].clientX);
                    setSwipeDirection(null);
                    setIsSwiping(true);
                  }}
                  onTouchMove={(e) => {
                    if (swipeStartX === null) return;
                    
                    const currentX = e.touches[0].clientX;
                    const diff = currentX - swipeStartX;
                    
                    // Set direction once we have a clear movement
                    if (Math.abs(diff) > 10) {
                      const newDirection = diff > 0 ? 'right' : 'left';
                      if (swipeDirection !== newDirection) {
                        setSwipeDirection(newDirection);
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (swipeStartX === null || swipeDirection === null) return;
                    
                    const endX = e.changedTouches[0].clientX;
                    const diff = endX - swipeStartX;
                    
                    if (Math.abs(diff) > 50) { // Minimum swipe distance
                      if (swipeDirection === 'right') {
                        handlePrevWidget();
                      } else {
                        handleNextWidget();
                      }
                    }
                    
                    setSwipeStartX(null);
                    setSwipeDirection(null);
                    setIsSwiping(false);
                    
                    // Record the time of manual navigation for swipe
                    setLastManualNavigation(Date.now());
                  }}
                  // Also handle mouse-based swipes for desktop
                  onMouseDown={(e) => {
                    setSwipeStartX(e.clientX);
                    setSwipeDirection(null);
                    setIsSwiping(true);
                  }}
                  onMouseMove={(e) => {
                    if (swipeStartX === null) return;
                    
                    const diff = e.clientX - swipeStartX;
                    
                    // Set direction once we have a clear movement
                    if (Math.abs(diff) > 10) {
                      const newDirection = diff > 0 ? 'right' : 'left';
                      if (swipeDirection !== newDirection) {
                        setSwipeDirection(newDirection);
                      }
                    }
                  }}
                  onMouseUp={(e) => {
                    if (swipeStartX === null || swipeDirection === null) return;
                    
                    const diff = e.clientX - swipeStartX;
                    
                    if (Math.abs(diff) > 50) { // Minimum swipe distance
                      if (swipeDirection === 'right') {
                        handlePrevWidget();
                      } else {
                        handleNextWidget();
                      }
                    }
                    
                    setSwipeStartX(null);
                    setSwipeDirection(null);
                    setIsSwiping(false);
                    
                    // Record the time of manual navigation for swipe
                    setLastManualNavigation(Date.now());
                  }}
                  onMouseLeave={(e) => {
                    // If mouse leaves while swiping, reset the state
                    if (swipeStartX !== null) {
                      setSwipeStartX(null);
                      setSwipeDirection(null);
                      setIsSwiping(false);
                    }
                  }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '14px',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
                    touchAction: 'pan-y', // Allow vertical scrolling but handle horizontal swipes
                    cursor: swipeStartX !== null ? (swipeDirection === 'right' ? 'w-resize' : swipeDirection === 'left' ? 'e-resize' : 'grab') : 'pointer' 
                }}
              >
                <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 shadow-md ${widgets[currentWidgetIndex].iconBgColor} overflow-hidden border border-white/10`}>
                      {widgets[currentWidgetIndex].type === 'workout' && (
                        <img 
                          src="/icons/apps/kineship.png" 
                          alt="Kineship" 
                          className="w-full h-full object-cover" 
                          style={{ borderRadius: '0.375rem' }}
                        />
                      )}
                      {widgets[currentWidgetIndex].type === 'notes' && (
                        <StickyNote size={20} className="text-white" strokeWidth={1.5} />
                      )}
                      {widgets[currentWidgetIndex].type === 'partiful' && (
                        <img 
                          src="/icons/apps/partiful.png" 
                          alt="Partiful" 
                          className="w-6 h-6 object-contain" 
                        />
                    )}
                  </div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-medium text-white text-sharp truncate mr-2" style={{ 
                          WebkitFontSmoothing: 'antialiased', 
                          MozOsxFontSmoothing: 'grayscale',
                          fontWeight: 400,
                          maxWidth: widgets[currentWidgetIndex].type === 'notes' ? '100%' : 'calc(100% - 45px)'
                        }}>
                          {widgets[currentWidgetIndex].type === 'workout' ? 'barry\'s - lift x run' : 
                           widgets[currentWidgetIndex].type === 'notes' ? selectedNote.title : 
                           selectedEvent.title}
                        </h3>
                        {/* Show timestamp for all widgets, including notes */}
                        <p className="text-[12px] text-white/70 text-sharp ml-1 flex-shrink-0" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', fontWeight: 350 }}>
                          {widgets[currentWidgetIndex].type === 'notes' 
                            ? getRelativeDate(selectedNote.date) // Show 3-letter day for notes in the top right
                            : widgets[currentWidgetIndex].timestamp}
                      </p>
                    </div>
                      <p className="text-[12px] text-white/60 font-normal text-sharp" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', fontWeight: 300 }}>
                        {widgets[currentWidgetIndex].type === 'notes' ? 
                          'notes' : // Show "notes" in the subtitle position
                          widgets[currentWidgetIndex].timestampLabel}
                    </p>
                  </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center max-w-[80%] min-w-0 overflow-hidden">
                        {/* Show title for all widgets in the same format */}
                        <p className="text-[14px] text-white/70 font-medium truncate pr-2 text-sharp leading-tight w-full" style={{ 
                          WebkitFontSmoothing: 'antialiased', 
                          MozOsxFontSmoothing: 'grayscale', 
                          textShadow: 'none', 
                          fontWeight: 400,
                          letterSpacing: '0.01em'
                        }}>
                          {widgets[currentWidgetIndex].type === 'notes' ? 
                            '' : // Remove duplicate title for notes widget
                            widgets[currentWidgetIndex].type === 'partiful' ?
                            `${selectedEvent.attendees} approved` :
                            'with megan, sam'}
                        </p>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        {/* Workout circles */}
                        {widgets[currentWidgetIndex].type === 'workout' && (
                          <div className="flex -space-x-1">
                            <div className="inline-block h-6 w-6 rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#62BE9C]/60 to-[#62BE9C]/30 shadow-md z-30 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                            </div>
                            <div className="inline-block h-6 w-6 rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#62BE9C]/50 to-[#62BE9C]/20 shadow-md z-20 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></div>
                            </div>
                            <div className="inline-block h-6 w-6 rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#62BE9C]/40 to-[#62BE9C]/10 shadow-md z-10 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            </div>
                          </div>
                        )}
                        {/* Partiful attendee circles */}
                        {widgets[currentWidgetIndex].type === 'partiful' && (
                          <div className="flex -space-x-1">
                            <div className="inline-block h-6 w-6 rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#FF4081]/60 to-[#FF4081]/30 shadow-md z-10 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                            </div>
                            <div className="inline-block h-6 w-6 rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#FF4081]/50 to-[#FF4081]/20 shadow-md z-20 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></div>
                            </div>
                            <div className="inline-block h-6 w-6 rounded-full ring-1 ring-white/20 bg-gradient-to-br from-[#FF4081]/40 to-[#FF4081]/10 shadow-md z-30 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            </div>
                          </div>
                        )}
                        {/* Notes icon - removed circles, using just a single note icon instead */}
                        {widgets[currentWidgetIndex].type === 'notes' && (
                          <div className="flex items-center">
                            {/* Removed the circle with the note icon */}
                          </div>
                        )}
                        {/* Only show subtitle if it exists */}
                        {widgets[currentWidgetIndex].subtitle && (
                          <p className="text-[12px] text-white/70 font-normal whitespace-nowrap pr-2 text-sharp" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', textShadow: 'none' }}>
                            {widgets[currentWidgetIndex].subtitle}
                          </p>
                        )}
                  </div>
                  </div>
                    
                    {/* Content preview area - consistent height across all widgets */}
                    <div className={`${widgets[currentWidgetIndex].type === 'notes' ? 'min-h-[3.0em]' : 'min-h-[3.0em]'} mb-2`}>
                      {/* Apply consistent styling to all widget content */}
                      <p className="text-white/65 font-normal px-1 text-sharp leading-relaxed overflow-hidden" style={{ 
                        WebkitFontSmoothing: 'antialiased', 
                        MozOsxFontSmoothing: 'grayscale', 
                        textShadow: 'none',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        letterSpacing: '0.01em',
                        lineHeight: '1.45',
                        fontWeight: 350,
                        marginTop: widgets[currentWidgetIndex].type === 'notes' ? '-6px' : '0px',
                        marginBottom: widgets[currentWidgetIndex].type === 'notes' ? '6px' : '8px',
                        paddingBottom: widgets[currentWidgetIndex].type === 'notes' ? '8px' : '8px',
                        maxWidth: '100%',
                        fontSize: '12px'
                      }}>
                        {widgets[currentWidgetIndex].type === 'notes' 
                          ? selectedNote.content 
                          : widgets[currentWidgetIndex].type === 'partiful'
                            ? '' // Empty content for partiful as requested
                            : '' // Empty content for workout
                        }
                      </p>
                    </div>
                </div>
              </motion.div>
              </AnimatePresence>
              
              {/* Indicator Dots */}
              <div className="flex items-center justify-center mt-3 space-x-2">
                {widgets.map((_, index) => (
                  <div
                    key={`indicator-${index}`}
                    onClick={() => {
                      // Record the time of manual navigation
                      setLastManualNavigation(Date.now());
                      
                      // Apply smooth transition between widgets when dots are clicked
                      const direction = index > currentWidgetIndex ? 1 : -1;
                      
                      // Create a smoother transition by animating through each widget
                      const animateToIndex = () => {
                        if (currentWidgetIndex !== index) {
                          setCurrentWidgetIndex(prev => {
                            const next = prev + direction;
                            // Handle wrapping around the ends
                            if (next < 0) return widgets.length - 1;
                            if (next >= widgets.length) return 0;
                            return next;
                          });
                        }
                      };
                      
                      // Start the transition
                      animateToIndex();
                    }}
                  >
                    <div 
                      className={`h-[6px] w-[6px] rounded-full ${
                        currentWidgetIndex === index ? 'bg-white' : 'bg-white/40'
                      }`}
                      style={{
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Expanding App Icon Animation */}
          {appPosition && clonedAppIcon.app && !activeApp && (
            <motion.div
              className="absolute rounded-[12px] bg-black/35 backdrop-blur-2xl z-20 overflow-hidden"
              initial={{
                width: appPosition.width,
                height: appPosition.height,
                x: appPosition.x - appPosition.width/2,
                y: appPosition.y - appPosition.height/2,
                borderRadius: 12,
              }}
              animate={{
                width: '100%',
                height: '100%',
                x: 0,
                y: 0,
                borderRadius: 24,
              }}
              transition={clonedAppIcon.app?.id === 'partiful' 
                ? { type: "spring", stiffness: 300, damping: 40, mass: 1.3, duration: 0.4 } 
                : appOpeningTransition}
            >
              {/* Icon in center during expansion */}
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{
                  width: appPosition.width,
                  height: appPosition.height,
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ duration: 0.15, delay: 0.1 }}
              >
                <div className={`bg-gradient-to-br ${clonedAppIcon.app.color} h-full w-full rounded-[12px] flex items-center justify-center`}>
                  {clonedAppIcon.app.icon === 'Partiful' ? (
                    <img src="./icons/apps/partiful.png" alt="Partiful" className="w-6 h-6" />
                  ) : (
                    <AppIcon
                      icon={clonedAppIcon.app.icon}
                      name=""
                      color={clonedAppIcon.app.color}
                      onClick={() => {}}
                      showLabel={false}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* App Content Layer - For all apps */}
          {activeApp && ActiveComponent && (
            <div 
              className="absolute inset-0 z-30 overflow-hidden flex items-center justify-center"
              style={{ 
                opacity: activeApp ? 1 : 0,
                transition: 'opacity 0.15s ease-in',
                transitionDelay: '0.1s'
              }}
            >
              <AnimatePresence mode="wait">
                <ActiveComponent key={activeApp} />
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        
        {/* Navigation arrows - positioned absolutely to not affect container positioning */}
        {activeApp && (
          <div 
            className="absolute w-full mt-4 px-1"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              pointerEvents: "auto",
              bottom: '-50px',
              right: '0',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            {/* Back button - always goes back to home - moved to right side for thumb navigation */}
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              onClick={!isAnimating ? handleClose : undefined}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={28} className="text-white" strokeWidth={1.5} />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default App;