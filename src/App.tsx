import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AppIcon } from './components/AppIcon';
import { NotesScreen } from './screens/NotesScreen';
import { SocialsScreen } from './screens/SocialsScreen';
import { EventScreen } from './screens/EventScreen';
import type { AppIcon as AppIconType } from './types';
import { ChevronLeft, StickyNote } from 'lucide-react';
// Removed unused imports

// Import shared notes data
import { notes } from './data/notes';
// Import shared events data
import { events } from './data/events';
// Import the NoteItem type
import { NoteItem } from './data/notes';
// Import the DesktopOverlay component
import DesktopOverlay from './components/DesktopOverlay';
// Import the AppBackground component
import AppBackground from './components/AppBackground';

// Global tactile effect function for better performance
export const createTactileEffect = () => {
  if (typeof window !== 'undefined') {
    // Check if an effect is already in progress
    // if (document.querySelector('.tactile-effect')) return; // Keep check commented out for now
    
    // Attempt haptic feedback first (if supported)
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(1); // Lightest vibration
    }

    /* Temporarily disable visual feedback:
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
    */
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
interface WidgetData {
  type: 'notes' | 'partiful' | 'workout';
  title: string;
  subtitle: string;
  timestamp: string;
  timestampLabel: string;
  progress: number;
  iconBgColor: string;
  eventId?: number;
  attendees?: number;
  noteId?: number; // Add noteId here
}

// Simplified tactile effect for widget swipes
const createWidgetSwipeFeedback = () => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(3); // Subtle vibration feedback
  }
};

// Format date to relative terms with three-letter day abbreviations
const getRelativeDate = (dateStr: string) => {
  // Add check for empty date string
  if (!dateStr) {
    return ''; // Return empty string if date is missing
  }

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
  // Determine initial state based on window properties
  const shouldOpenNoteInitially = typeof window !== 'undefined' && !!window.initialNoteId;
  
  // State for desktop overlay
  const [isDesktop, setIsDesktop] = useState(false);
  const [showDesktopOverlay, setShowDesktopOverlay] = useState(true); // New state for controlling overlay visibility

  // Set 'notes' as the default active app and set up to open hello world note
  const [activeApp, setActiveApp] = useState<string | null>('notes');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const appsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [contentReady, setContentReady] = useState(false);
  
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [appPosition, setAppPosition] = useState<AnimationPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAppElement, setCurrentAppElement] = useState<HTMLElement | null>(null);
  const [windowHeight, setWindowHeight] = useState('100vh');
  const [, setIsAppleDevice] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHighPerformanceDevice, setIsHighPerformanceDevice] = useState(false);
  const [isNoteDetailView, setIsNoteDetailView] = useState(false);
  const [isEventDetailView, setIsEventDetailView] = useState(false); // Add state for event detail view
  const [initialEventIdForScreen, setInitialEventIdForScreen] = useState<number | null>(null); // State for event ID
  const [initialNoteIdForScreen, setInitialNoteIdForScreen] = useState<number | null>(null); // State for direct note ID
  const [widgetNote, setWidgetNote] = useState(notes[0]); // State for direct note ID
  
  // Add useEffect for desktop detection
  useEffect(() => {
    const checkDesktop = () => {
      // Prefer capability-based detection (desktop-like input), with a width fallback.
      // This avoids false negatives when the browser window is narrower than an arbitrary breakpoint.
      const hasHoverFinePointer =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      const isWideEnough = window.innerWidth >= 900;

      // Treat as desktop if you have desktop input (mouse/trackpad), regardless of width.
      // This ensures the overlay always shows on laptops, even when window is narrow.
      setIsDesktop(hasHoverFinePointer);
    };

    checkDesktop(); // Initial check
    window.addEventListener('resize', checkDesktop); // Check on resize

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Add an effect to preload all content and prevent flashes
  useEffect(() => {
    // Use Promise.all to track both image and font loading
    const fontReady = document.fonts.ready;
    
    // Function to preload the background image
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    };
    
    // Wait for both fonts and background image to load
    Promise.all([
      fontReady,
      preloadImage('/images/background.webp')
    ])
    .then(() => {
      // Once everything is loaded, mark content as ready
      setTimeout(() => {
        setIsLoaded(true);
        document.body.classList.add('content-loaded');
      }, 50); // Small delay to ensure styles apply
    })
    .catch((err) => {
      console.error('Resource loading error:', err);
      // Even if there's an error, still show content after a delay
      setTimeout(() => {
        setIsLoaded(true);
        document.body.classList.add('content-loaded');
      }, 100);
    });
    
    // Clean up not necessary for this effect
  }, []);
  
  const [recentTracks] = useState<SpotifyTrack[]>([]);
  const [currentWidgetIndex, setCurrentWidgetIndex] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isWidgetHovered, setIsWidgetHovered] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Handle widget navigation (prev/next)
  const handleWidgetNavigation = (direction: 'prev' | 'next') => {
    // Create tactile feedback for better UX
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(3); // Subtle vibration
    }
    
    // Update the widget index based on direction
    setCurrentWidgetIndex(prevIndex => {
      if (direction === 'prev') {
        // Go to previous widget, loop to end if at beginning
        return prevIndex === 0 ? widgets.length - 1 : prevIndex - 1;
      } else {
        // Go to next widget, loop to beginning if at end
        return prevIndex === widgets.length - 1 ? 0 : prevIndex + 1;
      }
    });
  };
  
  const widgetRef = useRef<HTMLDivElement>(null);
  const [hasShownFirstDisplay, setHasShownFirstDisplay] = useState(false);
  const [lastManualNavigation, setLastManualNavigation] = useState<number | null>(null);
  // Add state to detect if user is on a mobile device
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  // Track if home has been seen in this session
  const [hasSeenHomeSession, setHasSeenHomeSession] = useState(false);
  const [arrowDismissed, setArrowDismissed] = useState(false);
  
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
  
  // Show "shipped by" UI the first time user lands on the home page
  useEffect(() => {
    if (activeApp === null && !hasSeenHomeSession) {
      setHasSeenHomeSession(true);
      setHasShownFirstDisplay(false);
      // Hide after 3s
      const timer = setTimeout(() => setHasShownFirstDisplay(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeApp, hasSeenHomeSession]);
  
  // Dismiss arrow badge once user leaves home (after first home visit)
  useEffect(() => {
    if (hasSeenHomeSession && activeApp !== null && !arrowDismissed) {
      setArrowDismissed(true);
    }
  }, [activeApp, hasSeenHomeSession, arrowDismissed]);
  
  // Open hello world note on page load (only on mobile, never on desktop)
  useEffect(() => {
    // Skip auto-opening on desktop entirely
    if (isDesktop) {
      return;
    }
    
    // Always open the hello world note on mobile page load
    setTimeout(() => {
      // Set up the necessary window properties for the notes app
      window.initialNoteId = 1; // ID of the hello world note
      window.openNoteDirectly = true; // Signal to open this note directly in detail view
      (window as any).widgetNoteId = 1;
      (window as any).isFirstTimeOpeningApp = true;
      
      // Set the state that will be passed as a prop to NotesScreen
      setInitialNoteIdForScreen(1);
      // Trigger the app click to open notes
      handleAppClick('notes');

      // Set isFirstVisit to true only during this initial setup
      setIsFirstVisit(true);
      // Immediately plan to set it to false after this initial setup completes
      // Use another timeout to ensure it happens after the initial actions
      setTimeout(() => {
        setIsFirstVisit(false);
      }, 0); 

    }, 10); // Minimal timeout to ensure component is ready
  }, [isDesktop, showDesktopOverlay]);
  
  // Select a random unlocked note for the widget display
  const selectedNote = useMemo(() => {
    // Filter out locked notes to ensure we never select a locked note
    const unlockNotes = notes.filter(note => !note.locked);
    
    // For first-time visitors, show the hello world note
    if (isFirstVisit) {
      return unlockNotes.find(note => note.title.includes("hello world")) || unlockNotes[0];
    }
    
    // For returning visitors, show a random unlocked note
    // Use a deterministic but seemingly random selection based on the date
    // This ensures the note changes periodically but stays consistent within a day
    const today = new Date();
    const dateKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const noteIndex = dateKey % unlockNotes.length;
    
    return unlockNotes[noteIndex];
  }, [isFirstVisit]);
  
  // Select events based on visit history
  // Removed useMemo for selectedEvent to allow refresh on home navigation
  // const selectedEvent = useMemo(() => { ... }, [isFirstVisit]);

  // Function to select a random note for the widget
  const selectRandomNote = () => {
    // Filter out locked notes
    const availableNotes = notes.filter(note => !note.locked);
    if (availableNotes.length === 0) return selectedNote;
    
    // Select a random note from available notes
    const randomIndex = Math.floor(Math.random() * availableNotes.length);
    return availableNotes[randomIndex];
  };

  // Update the widget note periodically
  useEffect(() => {
    // Select a random note initially
    setWidgetNote(selectRandomNote());
    
    // Update the random note every 30 seconds
    const interval = setInterval(() => {
      setWidgetNote(selectRandomNote());
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Update the selectedNote/Event based on the currentWidgetIndex
  useEffect(() => {
    // No action needed here, we're now using the widget array directly
  }, [currentWidgetIndex]); // Use a variable for clarity

  // Add state for the event displayed in the widget
  const [widgetEvent, setWidgetEvent] = useState(events[0]); // Initialize with default

  // Function to select the event for the widget based on visit history
  const selectEventForWidget = () => {
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
  };

  // Set initial widget event on mount
  useEffect(() => {
    setWidgetEvent(selectEventForWidget());
  }, []); // Run once on mount

  // Update widget event when returning to home screen
  const prevActiveAppRef = useRef<string | null>();
  useEffect(() => {
    // Check if app was just closed (previous state wasn't null, current is null)
    if (prevActiveAppRef.current !== null && activeApp === null) {
      // Re-select event when returning home
      setWidgetEvent(selectEventForWidget());
      // Re-select note when returning home
      setWidgetNote(selectRandomNote());
    }
    // Update the ref *after* the check
    prevActiveAppRef.current = activeApp;
  }, [activeApp, isFirstVisit]); // isFirstVisit needed as selectEventForWidget depends on it

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
      title: widgetNote.title,
      subtitle: '', // Keep subtitle empty for cleaner look
      timestamp: getRelativeDate(widgetNote.date),
      timestampLabel: 'notes',
      progress: 65,
      iconBgColor: 'bg-[#FF8A5B]/20',
      noteId: widgetNote.id // Use the randomly selected note's ID
    },
    {
      type: 'partiful',
      title: widgetEvent.title, // Use widgetEvent state
      subtitle: '', // Keep subtitle empty or define as needed
      timestamp: getRelativeDate(widgetEvent.date), // Use widgetEvent state
      timestampLabel: (() => {
        try {
          const [day, month, year] = widgetEvent.date.split('/').map(Number); // Use widgetEvent state
          // Assuming YY format, adjust for the correct century (e.g., 20xx)
          const eventDate = new Date(2000 + year, month - 1, day);
          
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to start of today

          return eventDate >= today ? 'upcoming' : 'recent';
        } catch (e) {
          console.error("Error parsing event date:", widgetEvent.date, e); // Use widgetEvent state
          return 'Event'; // Fallback label
        }
      })(), // Calculate based on date comparison
      progress: 0, // Set progress if applicable, otherwise 0
      iconBgColor: 'bg-[#FF4081]/20', // Partiful color
      eventId: widgetEvent.id, // Use widgetEvent state
      attendees: widgetEvent.attendees // Use widgetEvent state
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
    
    // Optimize loading sequence - apply immediate background color
    // Set background color immediately to prevent flash
    document.documentElement.style.backgroundColor = '#131518';
    document.body.style.backgroundColor = '#131518';
    
    // Set loaded state immediately to prevent white flash
    setIsLoaded(true);
    
    // Use a very short timeout to ensure the dark background is applied before any rendering
    const initialTimer = setTimeout(() => {
      // Force recompute height to ensure proper display
      setHeight();
    }, 10); // Very short delay
    
    return () => {
      window.removeEventListener('resize', setHeight);
      window.removeEventListener('orientationchange', setHeight);
      window.removeEventListener('touchmove', () => setHeight());
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      clearTimeout(initialTimer);
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

  // Function to handle opening a specific note with enhanced transitions
  const handleOpenNote = (noteId: string) => {
    // Clear any existing transition artifacts first
    const overlays = document.querySelectorAll('.tactile-effect, .swipe-effect');
    overlays.forEach(overlay => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    });
    
    // Ensure we're starting fresh
    document.body.classList.remove('backdrop-blur');
    
    setSelectedNoteId(noteId);
    setSelectedScreen('notes');
    setIsOpen(true);
    
    // Set this to track that the note was opened from the widget
    // Used to determine whether to show the pulsing dots
    localStorage.setItem('widgetNoteId', noteId);
  };

  // Handle app closing with proper animation - enhanced for elegant roll-up
  const handleClose = () => {
    console.log(`handleClose called. isAnimating: ${isAnimating}`); // DEBUG
    if (isAnimating) return;

    // Set detail view state to false first for potentially needed state coordination
    if (activeApp === 'notes' && isNoteDetailView) {
      setIsNoteDetailView(false);
    }
    if (activeApp === 'partiful' && isEventDetailView) {
      setIsEventDetailView(false);
    }
    
    // Clean up any UI artifacts that might be causing the grey screen
    try {
      // Remove any overlay elements
      const overlays = document.querySelectorAll('.tactile-effect, .swipe-effect');
      overlays.forEach(overlay => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      });
      
      // Ensure smooth scrolling to top before closing
      const contentElements = document.querySelectorAll('.overflow-y-auto');
      contentElements.forEach(el => {
        if (el instanceof HTMLElement && el.scrollTop > 0) {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      
      // If we're in a note detail view, first transition back to square shape
      if ((activeApp === 'notes' && window.isViewingNoteDetail) || 
          (activeApp === 'partiful' && window.isViewingEventDetail)) {
        // First update the window flag to trigger shape animation
        if (activeApp === 'notes') {
          window.isViewingNoteDetail = false;
        } else if (activeApp === 'partiful') {
          window.isViewingEventDetail = false;
        }
        
        // Give the shape animation time to complete before closing
        setTimeout(() => {
          setIsOpen(false);
          setTimeout(() => {
            setSelectedScreen(null);
            setSelectedNoteId(null);
          }, 400); // Increased timeout for smoother transition
        }, 250); // Wait for shape transition to complete
      } else {
        // Standard closing animation if not in detail view
        setIsOpen(false);
        setTimeout(() => {
          setSelectedScreen(null);
          setSelectedNoteId(null);
        }, 400); // Increased timeout for smoother transition
      }
    } catch (e) {
      console.error('Error cleaning up UI:', e);
    }
    
    // Check if there's a specific screen back handler active
    // This allows screens like NotesScreen or EventScreen to handle internal navigation
    if (activeApp === 'notes' && window.noteScreenBackHandler && window.noteScreenBackHandler()) {
      // If the screen handler returns true, it handled the back action
      return; 
    }
    else if (activeApp === 'partiful' && window.eventScreenBackHandler && window.eventScreenBackHandler()) {
      // If the EventScreen handler returns true, it handled the back action (e.g., hiding Partiful detail)
      return; 
    }
    setIsAnimating(true);
    
    // Start closing animation with enhanced buttery-smooth transitions
    setTimeout(() => {
      setActiveApp(null);
      setAppPosition(null);
      setClonedAppIcon({
        app: null,
        rect: null
      });
      setInitialEventIdForScreen(null); // Reset event ID state on close
      setInitialNoteIdForScreen(null); // Reset note ID state on close
      
      // Reset animation state after animation completes with longer duration for smoother feel
      setTimeout(() => {
        setIsAnimating(false);
      }, 350); // Increased for smoother transition
    }, 10); // Reduced delay from 60ms to 10ms
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

  // Define handleNavigate matching the type signature expected by AppScreenProps
  const handleNavigate = (target: string, options?: { noteId?: number; eventId?: number }) => {
    console.log(`Navigating to ${target} with options:`, options);
    // Set the target screen as active
    setActiveApp(target);
    // Potentially handle options like setting initialNoteId/initialEventId state here if needed
    if (options?.noteId) {
      // Convert number to string if selectedNoteId expects a string
      setSelectedNoteId(String(options.noteId)); 
    }
    // TODO: Add state for selectedEventId if needed and handle options.eventId
  };

  const ActiveComponent = activeApp ? apps.find(app => app.id === activeApp)?.component : null;
  
  // Get the display name for the active app, with a special case for partiful to show as parti-folio
  const activeAppName = activeApp ? 
    (activeApp === 'partiful' ? 'partifolio 🎉' : 
     activeApp === 'notes' ? 'notes 🖇️' :
     activeApp === 'socials' ? 'socials ✨' :
     apps.find(app => app.id === activeApp)?.name) 
    : null;
  
  // Enhanced iOS app opening animation timing for buttery-smooth transitions
  const appOpeningTransition = {
    type: "spring",
    stiffness: 300, // Slightly reduced for smoother motion
    damping: 30,   // Slightly reduced for more natural bounce
    mass: 1.0,     // Reduced mass for lighter feel
    duration: 0.4  // Slightly longer for more luxurious feel
  };

  // Handle navigation between apps
  const handleNextWidget = () => {
    setCurrentWidgetIndex((prevIndex) => {
      return (prevIndex + 1) % widgets.length;
    });
    createWidgetSwipeFeedback();
  };

  const viewportHeightPx =
    typeof windowHeight === 'string' && windowHeight.endsWith('px')
      ? parseInt(windowHeight, 10)
      : typeof window !== 'undefined'
        ? window.innerHeight
        : 0;

  const mobileOpenHeightPx = Math.max(450, Math.min(viewportHeightPx - 220, 620));

  const desktopFrameSizePx = 340;
  const desktopOpenHeightPx = Math.round(desktopFrameSizePx * (4 / 3));
  const frameSizePx = isMobileDevice ? 290 : desktopFrameSizePx;

  // Framer Motion variants for the main container frame animation
  const frameVariants = {
    closed: { // Square state
      width: `${frameSizePx}px`,
      height: `${frameSizePx}px`,
      aspectRatio: '1/1',
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
    open: { // Rectangle state (Note Detail)
      width: `${frameSizePx}px`,
      height: isMobileDevice ? `${mobileOpenHeightPx}px` : `${desktopOpenHeightPx}px`,
      aspectRatio: '3/4',
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  // Sync the showDesktopOverlay when isDesktop changes
  useEffect(() => {
    if (isDesktop) {
      setShowDesktopOverlay(true);
    }
  }, [isDesktop]);

  // Close desktop overlay and return to home
  const handleCloseDesktopOverlay = () => {
    setShowDesktopOverlay(false);
    setActiveApp(null); // ensure we land on home, not a note
    setInitialNoteIdForScreen(null);
  };

  // Conditional rendering based on desktop view
  if (isDesktop && showDesktopOverlay) { // Show desktop overlay only if both conditions are true
    return (
      <AnimatePresence mode="wait">
        <motion.div key="desktop-overlay">
          <DesktopOverlay onClose={handleCloseDesktopOverlay} /> {/* Pass onClose prop */}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen"
      style={{ backgroundColor: '#131518' }} 
    >
      {/* Use the AppBackground component here */}
      <AppBackground isLoaded={isLoaded} />

      <AnimatePresence>
        {activeApp && (
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-black/10 z-[5]" // Position behind content (z-10) but above background (z-0)
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={(e) => {
              console.log('Backdrop clicked.'); // DEBUG
              // Prevent click-through if already animating
              if (isAnimating) {
                e.stopPropagation();
                return;
              }
              handleClose();
            }}
          />
        )}
      </AnimatePresence>

      <div 
        className="absolute flex flex-col items-center will-change-transform z-10"
        ref={mainContainerRef}
        // ADD stopPropagation to prevent clicks here closing the app
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          WebkitTransform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          transition: "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          top: '38%', // Moved up from 45% to 38% to shift the entire site upward
          left: '50%',
          marginLeft: `-${Math.round(frameSizePx / 2)}px`,
          marginTop: `-${Math.round(frameSizePx / 2 + 25)}px`,
        }}
      >
        {/* App name above the container - restoring correct parent styles */}
        <div 
          className="absolute top-[-30px] w-full flex justify-center items-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? '0' : '-10px'})`,
            transition: "opacity 0.9s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.9s cubic-bezier(0.25, 0.8, 0.25, 1)",
            transitionDelay: "0.1s",
            height: "30px",
            pointerEvents: "none"
          }}
        >
          {activeApp ? (
            <motion.h2 
              className="text-[18px] font-semibold text-right fixed" // Keep this semi-bold
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  duration: 0.9,
                  ease: [0.25, 0.8, 0.25, 1] // Enhanced easing for buttery-smooth transitions
                }
              }}
              style={{ 
                top: '10px', // Nudge up
                right: '22px', // Nudge right
                zIndex: 10001, // Keep increased zIndex
                color: '#ffffff',
                textShadow: '0px 1px 1px rgba(0, 0, 0, 0.3)' // Added subtle iOS-like text shadow
              }}
            >
              <span className="flex items-center">
                {activeAppName}
              </span>
            </motion.h2>
          ) : (
            /* Home screen title with enhanced styling */
            <motion.h2 
              className="text-[18px] font-semibold text-right fixed" // Keep this semi-bold
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  duration: 0.9,
                  ease: [0.25, 0.8, 0.25, 1] // Enhanced easing for buttery-smooth transitions
                }
              }}
              style={{ 
                top: '10px', // Nudge up
                right: '22px', // Nudge right
                zIndex: 10001, // Keep increased zIndex
                color: '#ffffff',
                textShadow: '0px 1px 1px rgba(0, 0, 0, 0.3)' // Added subtle iOS-like text shadow
              }}
            >
              <span className="flex items-center">
                <span
                  className="mr-1.5 text-[12px] font-light italic text-white/50"
                  style={{ opacity: (hasSeenHomeSession && !hasShownFirstDisplay) ? 1 : 0, transition: 'opacity 2.5s linear' }}
                >
                  shipped by
                </span>
                <span>Fareeha</span>
                {/* Profile picture - always visible */}
                <a href="https://github.com/fareeha-s" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); window.open('https://github.com/fareeha-s', '_blank'); }} style={{ cursor: 'pointer', marginLeft: '6px' }} className="github-link inline-block relative group">
                  <img 
                    src="./icons/hosts/fareeha.jpg" 
                    alt="Fareeha" 
                    className="rounded-full w-6 h-6 object-cover border border-white/20" 
                    style={{ 
                      zIndex: 10002,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.2) inset',
                      backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                      transform: 'translateZ(0)',
                      transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.97) translateZ(0)';
                      e.currentTarget.style.boxShadow = '0 0px 1px rgba(0,0,0,0.1), 0 0 1px rgba(255,255,255,0.1) inset';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'translateZ(0)';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.2) inset';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) translateZ(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2), 0 0 1px rgba(255,255,255,0.3) inset';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateZ(0)';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.2) inset';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  />
                  <svg 
                    width="10" 
                    height="10" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg" 
                    style={{
                      stroke: 'white', 
                      strokeWidth: 2.5, 
                      position: 'absolute',
                      top: '-1px',
                      right: '-1px',
                      zIndex: 10003, // Ensure it's above the image but respects parent context
                      pointerEvents: 'none', // Allow clicks to pass through to the <a> tag
                      opacity: hasSeenHomeSession && activeApp === null && !arrowDismissed ? 1 : 0,
                      transition: 'opacity 1s ease-in-out', // Keep original opacity transition
                    }}
                  >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                </a>
              </span>
            </motion.h2>
          )}
        </div>
        
        {/* Main container - with glass solid effect instead of blur */}
        <motion.div 
          className={`overflow-hidden shadow-xl relative z-20 will-change-transform glass-solid main-container border border-white/10 ${ // Added border classes
            // Restore shine effect
            activeApp ? 'glass-solid-shine' : ''
          } ${isNoteDetailView || isEventDetailView ? 'portrait-container expanded' : ''}`}
          variants={frameVariants}
          initial="closed"
          animate={(isNoteDetailView && activeApp === 'notes') || (activeApp === 'partiful') ? 'open' : 'closed'} // Control animation state - partiful always uses open/tall frame
          style={{
            borderRadius: '24px',
            backgroundColor: 'transparent', // Revert back to transparent
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon in center during expansion */}
          <motion.div
            className="absolute flex items-center justify-center"
            initial={{
              width: `${frameSizePx}px`,
              height: `${frameSizePx}px`,
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
            <div className={`bg-gradient-to-br ${clonedAppIcon?.app?.color || 'from-gray-700 to-gray-900'} h-full w-full rounded-[12px] flex items-center justify-center`}>
              {clonedAppIcon?.app?.icon === 'Partiful' ? (
                <img src="./icons/apps/partiful.png" alt="Partiful" className="w-6 h-6" />
              ) : (
                <AppIcon
                  icon={clonedAppIcon?.app?.icon ?? ''}
                  name=""
                  color={clonedAppIcon?.app?.color || 'from-gray-700 to-gray-900'}
                  onClick={() => {}}
                  showLabel={false}
                />
              )}
            </div>
          </motion.div>
          
          {/* Home Screen Layer - Always present */}
          <div 
            className={`absolute inset-0 z-10 ${activeApp ? 'pointer-events-none' : ''}`}
            style={{
              opacity: activeApp ? 0 : 1,
              transition: 'opacity 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
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
                    className={clonedAppIcon?.app?.id === app.id && activeApp ? 'invisible' : ''}
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
                  className={`w-full aspect-square mt-auto rounded-[16px] overflow-hidden shadow-sm mb-1 will-change-transform ${isLoaded ? 'music-widget-bg-animation' : ''}`}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '14px',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
                    touchAction: 'none', 
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    // aspectRatio: '1/1' // This is handled by the aspect-square Tailwind class
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.5, // Slightly longer for smoother feel
                    ease: [0.25, 0.8, 0.25, 1] // Enhanced cubic-bezier for buttery-smooth transitions
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!widgets[currentWidgetIndex]) return;
                    
                    const currentWidget = widgets[currentWidgetIndex]; // Use a variable for clarity

                    if (currentWidget.type === 'notes') {
                      console.log('Notes widget clicked. Data:', currentWidget);
                      // Set the ID and then open the app
                      if (typeof currentWidget.noteId === 'number') {
                        setInitialNoteIdForScreen(currentWidget.noteId);
                      }
                      handleAppClick('notes'); // Open the Notes app screen
                    } else if (currentWidget.type === 'partiful') {
                      // Set the ID *before* opening the app
                      if (typeof currentWidget.eventId === 'number') {
                        setInitialEventIdForScreen(currentWidget.eventId);
                      }
                      // Now open the app (EventScreen)
                      handleAppClick('partiful');
                    } else if (currentWidget.type === 'workout') {
                      // Set Kineship note ID (2) and then open the app
                      setInitialNoteIdForScreen(2);
                      handleAppClick('notes'); 
                    }
                  }}
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
                      setIsSwiping(true);
                      setSwipeDirection(null);
                      // Prevent default to avoid scrolling conflicts
                      e.preventDefault();
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
                          // Add haptic feedback when direction changes
                          createSwipeHapticFeedback('light');
                        }
                      }
                      
                      // Prevent default to avoid scrolling conflicts
                      e.preventDefault();
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (isMobileDevice && swipeStartX !== null) {
                      const endX = e.changedTouches[0].clientX;
                      const diff = endX - swipeStartX;
                      
                      if (Math.abs(diff) > 50) { // Minimum swipe distance
                        if (swipeDirection === 'right') {
                          handleWidgetNavigation('prev');
                          createSwipeHapticFeedback('medium');
                        } else if (swipeDirection === 'left') {
                          handleWidgetNavigation('next');
                          createSwipeHapticFeedback('medium');
                        }
                        
                        // Record the time of manual navigation for swipe
                        setLastManualNavigation(Date.now());
                      } else {
                        // If it's a small swipe (more like a tap), handle as a click
                        if (Math.abs(diff) < 10) {
                          const currentWidget = widgets[currentWidgetIndex];
                          
                          if (currentWidget.type === 'notes') {
                            console.log('Notes widget clicked. Data:', currentWidget);
                            // Set the ID and then open the app
                            if (typeof currentWidget.noteId === 'number') {
                              setInitialNoteIdForScreen(currentWidget.noteId);
                              handleAppClick('notes');
                            }
                          } else if (currentWidget.type === 'partiful' && currentWidget.eventId) {
                            setInitialEventIdForScreen(currentWidget.eventId);
                            handleAppClick('partiful');
                          } else if (currentWidget.type === 'workout') {
                            // Set Kineship note ID (2) and then open the app
                            setInitialNoteIdForScreen(2);
                            handleAppClick('notes');
                            localStorage.setItem('openedKineshipFromWidget', 'true');
                            setTimeout(() => {
                              // Use setTimeout to ensure the NotesScreen component is mounted
                              // before we try to open a specific note
                            }, 50); // Small delay
                          }
                        }
                      }
                      
                      setSwipeStartX(null);
                      setSwipeDirection(null);
                      setIsSwiping(false);
                    }
                  }}
                  // Remove mouse-based swipes for desktop completely
                  onMouseDown={undefined}
                  onMouseMove={undefined}
                  onMouseUp={undefined}
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
                          {widgets[currentWidgetIndex].title}
                        </h3>
                        {/* Show timestamp for all widgets, including notes */}
                        <p className="text-[14px] text-white/70 text-sharp ml-1 flex-shrink-0" style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', fontWeight: 350 }}>
                          {widgets[currentWidgetIndex].type === 'notes' 
                            ? getRelativeDate(widgetNote.date) // Consistently use widgetNote for date display
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
                            `${widgets[currentWidgetIndex].attendees} approved` :
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
                          ? (widgetNote.title.includes("hello world")
                              ? "my north star: designing tech that centres human longevity..."
                              : widgetNote.title.includes("kineship")
                                ? "the kineship app shares your workout calendar with your circles..."
                                : (widgetNote.content && widgetNote.content.endsWith('...')
                                    ? widgetNote.content
                                    : (widgetNote.content || '') + '...'))
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
          {appPosition && clonedAppIcon?.app && !activeApp && (
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
              transition={clonedAppIcon?.app?.id === 'partiful' 
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
                <div className={`bg-gradient-to-br ${clonedAppIcon?.app?.color || 'from-gray-700 to-gray-900'} h-full w-full rounded-[12px] flex items-center justify-center`}>
                  {clonedAppIcon?.app?.icon === 'Partiful' ? (
                    <img src="./icons/apps/partiful.png" alt="Partiful" className="w-6 h-6" />
                  ) : (
                    <AppIcon
                      icon={clonedAppIcon?.app?.icon ?? ''}
                      name=""
                      color={clonedAppIcon?.app?.color || 'from-gray-700 to-gray-900'}
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
            >
              <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
                {ActiveComponent && (
                  <ActiveComponent
                    key={activeApp} // Use activeApp as key
                    // Pass all possible props defined in the updated AppScreenProps
                    onClose={handleClose}
                    onNavigate={handleNavigate} // Use the new dedicated handler
                    initialNoteId={initialNoteIdForScreen} // Pass state directly
                    initialEventId={initialEventIdForScreen} // Pass state directly
                    isNoteDetailView={isNoteDetailView} // NotesScreen will use this
                    setIsNoteDetailView={setIsNoteDetailView} // NotesScreen will use this
                    isEventDetailView={isEventDetailView} // EventScreen will use this
                    setIsEventDetailView={setIsEventDetailView} // EventScreen will use this
                  />
                )}
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
    </div>
  );
}

export default App;