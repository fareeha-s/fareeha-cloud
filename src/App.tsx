import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AppIcon } from './components/AppIcon';
import { NotesScreen } from './screens/NotesScreen';
import { SocialsScreen } from './screens/SocialsScreen';
import { EventScreen } from './screens/EventScreen';
import type { AppIcon as AppIconType } from './types';
import { ChevronLeft, StickyNote } from 'lucide-react';
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
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = daysOfWeek[dateObj.getDay()];
  
  // Special cases for today and yesterday
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  
  // For all other dates, simply return the 3-letter day
  return dayOfWeek;
};

function App() {
  // Set 'notes' as the default active app to land directly on the hello world note
  const [activeApp, setActiveApp] = useState<string | null>('notes');
  const appsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // We're using window.isFirstTimeOpeningApp instead of a state variable
  
  // Set up the hello world note to open by default
  useEffect(() => {
    if (activeApp === 'notes') {
      // Find the hello world note
      const helloWorldNote = notes.find(note => note.title.includes("hello world"));
      if (helloWorldNote) {
        // Set the initialNoteId to the hello world note's ID
        window.initialNoteId = helloWorldNote.id;
        // Set flag to open note directly in detail view
        window.openNoteDirectly = true;
        // Set a flag to track if this is the first time opening the app
        (window as any).isFirstTimeOpeningApp = localStorage.getItem('hasVisitedBefore') !== 'true';
        // Mark that the user has visited before
        localStorage.setItem('hasVisitedBefore', 'true');
      }
    }
  }, []);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [appPosition, setAppPosition] = useState<AnimationPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAppElement, setCurrentAppElement] = useState<HTMLElement | null>(null);
  const [windowHeight, setWindowHeight] = useState('100vh');
  const [, setIsAppleDevice] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHighPerformanceDevice, setIsHighPerformanceDevice] = useState(false);
  const [recentTracks] = useState<SpotifyTrack[]>([]);
  const [currentWidgetIndex, setCurrentWidgetIndex] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isWidgetHovered, setIsWidgetHovered] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [hasShownFirstDisplay, setHasShownFirstDisplay] = useState(false);
  const [lastManualNavigation, setLastManualNavigation] = useState<number | null>(null);
  // Add state to detect if user is on a mobile device
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // Detect if user is on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobileDevice(isMobile);
    };
    
    checkIfMobile();
    
    // Also check on resize in case of device orientation changes
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
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
  
  // Always select the "hello world!" note when the site opens
  const selectedNote = useMemo(() => {
    // Filter out locked notes to ensure we never select a locked note
    const unlockNotes = notes.filter(note => !note.locked);
    
    // Always show the "hello world" note with compass emoji
    return unlockNotes.find(note => note.title.includes("hello world")) || unlockNotes[0];
  }, []);
  
  // Select events based on visit history
  const selectedEvent = useMemo(() => {
    // Sort all events by date (most recent first)
    const sortedEvents = [...events].sort((a, b) => {
      // Parse dates (assuming DD/MM/YY format)
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      
      // Compare dates (most recent first)
      if (yearB !== yearA) return yearB - yearA;
      if (monthB !== monthA) return monthB - monthA;
      return dayB - dayA;
    });
    
    // Take only the 6 most recent events
    const recentEvents = sortedEvents.slice(0, 6);
    
    if (isFirstVisit) {
      // For first visit - show the most recent upcoming event
      const upcomingEvents = recentEvents.filter(event => event.timeframe === 'upcoming');
      return upcomingEvents[0] || recentEvents[0];
    } else {
      // For subsequent visits - show random events from the 6 most recent
      const randomIndex = Math.floor(Math.random() * recentEvents.length);
      return recentEvents[randomIndex];
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
      timestampLabel: 'latest events',
      progress: 25,
      iconBgColor: 'bg-[#FF4081]/20'
    }
  ];
  
  // Update progress when tracks change
  useEffect(() => {
    if (recentTracks.length > 0) {
      // Unused variable removed
      // const newProgress = Math.floor(Math.random() * 80) + 10;
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
    
    // Optimize loading sequence - reduce initial delay to 50ms
    const initialTimer = setTimeout(() => {
      setIsLoaded(true);
      // Reduce secondary delay to 300ms
      const fullLoadTimer = setTimeout(() => {
        // Force recompute height to ensure proper display
        setHeight();
      }, 300); // Reduced from 600ms
      return () => clearTimeout(fullLoadTimer);
    }, 50); // Reduced from 100ms
    
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
      
      /* Widget animation classes for music widget - actually used in the components */
      .music-widget-bg-animation {
        animation: music-widget-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: music-widget-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      @keyframes music-widget-bg-fade {
        0% { background-color: rgba(255, 255, 255, 0.03); }
        50% { background-color: rgba(255, 255, 255, 0.05); }
        100% { background-color: rgba(255, 255, 255, 0.07); }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Create a mapping from app IDs to handleAppClick (for use with inline links)
  useEffect(() => {
    // Make handleAppClick available to the window object for links in notes
    window.handleAppClick = (appId: string) => {
      console.log('App link clicked:', appId);
      // Special case: if appId is 'home', go to home screen
      if (appId === 'home') {
        setActiveApp(null);
        return;
      }
      handleAppClick(appId);
    };
    
    return () => {
      // Clean up
      delete (window as any).handleAppClick;
    };
  }, []);  // Empty dependency array ensures this only runs once
  
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
      // If this is the first time opening the app and we're viewing the hello world note,
      // go to home screen instead of staying in notes app
      if ((window as any).isFirstTimeOpeningApp) {
        (window as any).isFirstTimeOpeningApp = false; // Reset the flag
        setActiveApp(null); // Go to home screen
        return;
      }
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
    (activeApp === 'partiful' ? 'partifolio 🎉' : 
     activeApp === 'notes' ? 'notes ✧' :
     activeApp === 'socials' ? 'socials ✨' :
     apps.find(app => app.id === activeApp)?.name) 
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
    // Don't allow widget clicks during animations
    if (isAnimating) return;
    
    // Create tactile feedback for the widget interaction
    createWidgetSwipeFeedback();
    
    // Map widget types to app IDs
    let appId: string | null = null;
    
    // Determine which app to open based on widget type
    if (widgetType === 'workout') {
      // Special case for workout widget to navigate directly to the kineship note detail view
      window.initialNoteId = 2; // ID of the kineship note
      window.openNoteDirectly = true; // Signal to open this note directly in detail view
      // Set widgetNoteId to make the pulsing orb appear
      (window as any).widgetNoteId = 2;
      appId = 'notes';
    } else if (widgetType === 'notes') {
      // Set widgetNoteId to the hello world note to make the pulsing orb appear
      window.initialNoteId = 1; // ID of the hello world note
      (window as any).widgetNoteId = 1;
      appId = 'notes';
    } else if (widgetType === 'socials') {
      appId = 'socials';
    } else if (widgetType === 'partiful') {
      appId = 'partiful';
    }
    
    // If we have a valid app ID, open it with animation
    if (appId) {
      // Get the app element from the ref map
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
    }
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
      {/* Background Wrapper - Simplified with single image and fallback */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {/* Single beautiful background image with fallback */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#131518] to-[#1d1c21]"
          style={{ 
            opacity: 1,
          }}
        >
          {/* Subtle bokeh effect overlay */}
        <div 
            className="absolute inset-0 opacity-30"
          style={{ 
              backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.02) 0%, transparent 30%), radial-gradient(circle at 45% 80%, rgba(180,180,200,0.02) 0%, transparent 40%)',
              mixBlendMode: 'screen'
          }}
        ></div>
        
          {/* Background image that loads on top of the gradient */}
          <img 
            src="./optimized/background.webp" 
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          style={{ 
              opacity: isLoaded ? 0.9 : 0,
              transition: 'opacity 1s ease',
            }}
            onError={(e) => {
              // If webp fails, try jpg
              const img = e.target as HTMLImageElement;
              img.onerror = null; // Prevent infinite error loop
              img.src = './background.jpg';
            }}
          />
        
          {/* Subtle overlay for better text contrast */}
        <div 
            className="absolute inset-0 bg-black/20"
          style={{
              opacity: isLoaded ? 0.5 : 0,
              transition: 'opacity 1s ease',
          }}
        ></div>
        </div>
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
          className="absolute top-[-30px] w-full flex justify-center items-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? '0' : '-10px'})`,
            transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.1s",
            height: "30px",
            pointerEvents: "none"
          }}
        >
          {activeApp ? (
            <motion.h2 
              className="text-[18px] font-normal text-right fixed"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              style={{ 
                top: '8px',
                right: '25px',
                zIndex: 9999,
                color: '#ffffff'
              }}
            >
              <span className="flex items-center">
                {activeAppName}
              </span>
            </motion.h2>
          ) : (
            /* Home screen title with enhanced styling */
            <motion.h2 
              className="text-[18px] font-normal text-right fixed"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              style={{ 
                top: '8px',
                right: '25px',
                zIndex: 9999,
                color: '#ffffff'
              }}
            >
              <span className="flex items-center">
                {isFirstVisit && <span style={{ fontSize: "0.65em", color: "rgba(255, 255, 255, 0.5)", marginRight: "4px", animation: "fadeOut 2.5s ease-in forwards 3s", display: "inline-block", transform: "translateY(2px)" }}>shipped by</span>}
                fareeha
                <a href="https://github.com/fareeha-s" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); window.open('https://github.com/fareeha-s', '_blank'); }} style={{ cursor: 'pointer' }} className="github-link">
                  <img 
                    src="./icons/hosts/fareeha.jpg" 
                    alt="Fareeha" 
                    className="ml-1 rounded-full w-6 h-6 object-cover border border-white/20 hover:border-white/50 transition-all duration-300" 
                    style={{ zIndex: 9999 }}
                  />
                </a>
              </span>
            </motion.h2>
          )}
        </div>
        
        {/* Main container - with glass solid effect instead of blur */}
        <motion.div 
          className={`w-[290px] aspect-square rounded-[24px] overflow-hidden shadow-xl relative z-20 will-change-transform glass-solid main-container ${
            activeApp ? 'glass-solid-shine' : ''
          } ${activeApp === 'partiful' && typeof window !== 'undefined' && window.isViewingEventDetail ? 'portrait-container expanded' : ''} ${activeApp === 'notes' && typeof window !== 'undefined' && window.isViewingNoteDetail ? 'portrait-container expanded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (activeApp && !isAnimating) handleClose();
          }}
          style={(() => {
            // Debug log for rendering
            if (activeApp === 'partiful') {
              console.log('App.tsx rendering - isViewingEventDetail:', typeof window !== 'undefined' ? window.isViewingEventDetail : 'undefined');
            }
            if (activeApp === 'notes') {
              console.log('App.tsx rendering - isViewingNoteDetail:', typeof window !== 'undefined' ? window.isViewingNoteDetail : 'undefined');
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
            if (activeApp === 'notes' && typeof window !== 'undefined' && window.isViewingNoteDetail) {
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
                  // Implement a direct, simpler swipe detection system for mobile devices only
                  onTouchStart={(e) => {
                    if (isMobileDevice) {
                    setSwipeStartX(e.touches[0].clientX);
                    setSwipeDirection(null);
                    setIsSwiping(true);
                    }
                  }}
                  onTouchMove={(e) => {
                    if (isMobileDevice && swipeStartX !== null) {
                    const currentX = e.touches[0].clientX;
                    const diff = currentX - swipeStartX;
                    
                    // Set direction once we have a clear movement
                    if (Math.abs(diff) > 10) {
                      const newDirection = diff > 0 ? 'right' : 'left';
                      if (swipeDirection !== newDirection) {
                        setSwipeDirection(newDirection);
                        }
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (isMobileDevice && swipeStartX !== null && swipeDirection !== null) {
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
                    }
                  }}
                  // Remove mouse-based swipes for desktop completely
                  onMouseDown={undefined}
                  onMouseMove={undefined}
                  onMouseUp={undefined}
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
                  cursor: 'pointer' // Always use pointer cursor for web users
                }}
              >
                <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 shadow-md ${widgets[currentWidgetIndex].iconBgColor} overflow-hidden border border-white/10`}>
                      {widgets[currentWidgetIndex].type === 'workout' && (
                        <img 
                          src="./icons/apps/kineship.png" 
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
                          src="./icons/apps/partiful.png" 
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
                        <p className="text-[14px] text-white/70 text-sharp ml-1 flex-shrink-0" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', fontWeight: 350 }}>
                          {widgets[currentWidgetIndex].type === 'notes' 
                            ? getRelativeDate(selectedNote.date) // Show 3-letter day for notes in the top right
                            : widgets[currentWidgetIndex].timestamp}
                      </p>
                    </div>
                      <p className="text-[14px] text-white/60 font-normal text-sharp" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', fontWeight: 300 }}>
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
                          <p className="text-[14px] text-white/70 font-normal whitespace-nowrap pr-2 text-sharp" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', textShadow: 'none' }}>
                            {widgets[currentWidgetIndex].subtitle}
                          </p>
                        )}
                  </div>
                  </div>
                    
                    {/* Content preview area - consistent height across all widgets */}
                    <div className={`${widgets[currentWidgetIndex].type === 'notes' ? 'min-h-[2.8em]' : 'min-h-[2.8em]'} mb-1`}>
                      {/* Apply consistent styling to all widget content */}
                      <p className="text-white/65 font-normal px-1 text-sharp overflow-hidden" style={{ 
                        WebkitFontSmoothing: 'antialiased', 
                        MozOsxFontSmoothing: 'grayscale', 
                        textShadow: 'none',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.3',
                        letterSpacing: '0.01em',
                        fontWeight: 350,
                        marginTop: widgets[currentWidgetIndex].type === 'notes' ? '-8px' : '-2px',
                        marginBottom: widgets[currentWidgetIndex].type === 'notes' ? '6px' : '6px',
                        paddingBottom: widgets[currentWidgetIndex].type === 'notes' ? '0px' : '0px',
                        maxWidth: '100%',
                        fontSize: '12px'
                      }}>
                        {widgets[currentWidgetIndex].type === 'notes' 
                          ? (selectedNote.title.includes("hello world") 
                              ? "my north star: designing tech that centres human longevity..."
                              : selectedNote.title.includes("kineship") 
                                ? "the kineship app shares your workout calendar with your circles..."
                                : (selectedNote.content && selectedNote.content.endsWith('...') 
                                    ? selectedNote.content 
                                    : (selectedNote.content || '') + '...'))
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
              transition={{ 
                x: { duration: 0.3, delay: 4.5 },
                opacity: { 
                  duration: 2.5,
                  delay: 1.5 
                }
              }}
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