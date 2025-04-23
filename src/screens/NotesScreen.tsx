import React, { useState, useEffect, useRef } from 'react';
import type { AppScreenProps } from '../types';
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Lock } from 'lucide-react';
import { createTactileEffect } from '../App';
import { notes, NoteItem } from '../data/notes';
import ReactDOM from 'react-dom';

// Declare the global window property for TypeScript
declare global {
  interface Window {
    noteScreenBackHandler?: () => boolean;
    initialNoteId?: number;
    isViewingNoteDetail?: boolean;
    openNoteWithId?: (noteId: number) => void;
    openEventWithId?: (eventId: number) => void;
    handleAppClick?: (appId: string) => void;
    initialEventId?: number;
    handleVideoLink?: (url: string) => void;
    openNoteDirectly?: boolean;
  }
}

// Custom Pin icon component
const PinIcon = () => (
  <svg 
    width="10" 
    height="10" 
    viewBox="0 0 24 24" 
    className="text-white/50 mr-1.5"
    style={{ marginTop: "-1px" }}
  >
    <path 
      d="M9 4v6l-2 4v2h10v-2l-2-4V4" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M12 16v5" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M8 4h8" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Add a Video Player component with Portal
const VideoPlayerOverlay = ({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) => {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) return null;

  // Calculate embedUrl
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&showinfo=1&playsinline=1`;

  // Create a portal to render directly to body
  return ReactDOM.createPortal(
    <motion.div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="w-full h-full flex items-center justify-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-8 right-8 z-10 p-3 bg-black/70 hover:bg-black/90 rounded-full text-white/80 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X size={28} />
        </button>
        <iframe
          className="w-full h-full max-h-screen"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export const NotesScreen: React.FC<AppScreenProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const chevronControls = useAnimation();
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [widgetNoteId, setWidgetNoteId] = useState<number | null>(null);
  // Add state for tracking current note index and swipe
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  
  // Add state for video player
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Add state to track if Kineship note was opened from Hello World note
  const [openedFromHelloWorld, setOpenedFromHelloWorld] = useState<boolean>(false);
  
  // Track if this is the first time viewing hello world note directly - unused but kept for future use
  const [, setIsFirstViewOfHelloWorld] = useState<boolean>(false);
  
  // Create a ref to use for directly setting the window property
  const isViewingDetailRef = useRef(false);
  
  // Replace isAtBottom with showDots for pagination timing
  const [showDots, setShowDots] = useState(false);
  
  // Add state to detect if user is on a mobile device
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // Create a ref for the note content container
  const noteContentRef = useRef<HTMLDivElement>(null);
  
  // Only open hello world note on initial page load
  useEffect(() => {
    // Check for the openNoteDirectly flag to open note in detail view directly
    if (typeof window !== 'undefined' && window.openNoteDirectly && window.initialNoteId) {
      // Find the note with the specified ID
      const noteToOpen = notes.find(note => note.id === window.initialNoteId);
      if (noteToOpen) {
        // Open the note directly in detail view
        console.log('Opening note directly in detail view:', noteToOpen.id);
        setSelectedNote(noteToOpen);
        setIsViewingDetail(true);
        // Set the current note index for navigation
        const noteIndex = notes.findIndex(note => note.id === noteToOpen.id);
        setCurrentNoteIndex(noteIndex);
        
        // Reset the openNoteDirectly flag to avoid reopening on component re-renders
        window.openNoteDirectly = false;
      }
    }
    
    // Clean up any UI artifacts that might be causing issues
    try {
      // Remove any overlay elements that might be causing the grey box
      const overlays = document.querySelectorAll('.tactile-effect, .swipe-effect');
      overlays.forEach(overlay => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      });
    } catch (e) {
      console.error('Error cleaning up UI:', e);
    }
  }, []);
  
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
  
  // Add effect to check if user has already used swipe
  useEffect(() => {
    // Only check localStorage for mobile devices
    if (isMobileDevice) {
      // Check localStorage for previous swipe interactions
      const hasUsedSwipe = localStorage.getItem('hasUsedNoteSwipe') === 'true';
      if (hasUsedSwipe) {
        // If user has already swiped before, don't show dots
        setShowDots(false);
      }
    } else {
      // Never show dots for non-mobile devices
      setShowDots(false);
    }
  }, [isMobileDevice]);

  // Add effect to show dots when note is opened, if user hasn't swiped before
  useEffect(() => {
    if (selectedNote && isMobileDevice) {
      const hasUsedSwipe = localStorage.getItem('hasUsedNoteSwipe') === 'true';
      
      // Only show dots if user hasn't swiped before and is on mobile
      if (!hasUsedSwipe) {
        setShowDots(true);
      }
    }
  }, [selectedNote, isMobileDevice]);

  // Function to update both the ref and window property
  const setIsViewingDetail = (value: boolean) => {
    isViewingDetailRef.current = value;
    window.isViewingNoteDetail = value;
    console.log('Setting isViewingNoteDetail via function:', value);
    
    // Directly apply the class to the DOM as a fallback mechanism
    try {
      const mainContainer = document.querySelector('.main-container');
      if (mainContainer) {
        if (value) {
          mainContainer.classList.add('portrait-container');
          mainContainer.classList.add('expanded');
          console.log('Directly added portrait-container expanded classes to DOM');
        } else {
          // Force a DOM reflow before removing classes to ensure animation happens
          void (mainContainer as HTMLElement).offsetWidth;
          mainContainer.classList.remove('portrait-container');
          mainContainer.classList.remove('expanded');
          // Add a transient class to control the collapse animation specifically
          mainContainer.classList.add('collapsing');
          // Remove the transient class after animation completes
          setTimeout(() => {
            mainContainer.classList.remove('collapsing');
          }, 500);
          console.log('Directly removed portrait-container expanded classes from DOM');
        }
      }
    } catch (e) {
      console.error('Error directly manipulating DOM:', e);
    }
  };

  // Run a subtle animation sequence on first render
  useEffect(() => {
    if (!hasInteracted && !prefersReducedMotion) {
      // Subtle chevron pulse animation for the first note
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

  // Completely simplified back handler to avoid navigation issues
  useEffect(() => {
    const handleAppBackClick = () => {
      if (selectedNote) {
        // Immediately clean up UI elements that might cause the grey box
        try {
          // Clean up any UI artifacts
          const mainContainer = document.querySelector('.main-container');
          if (mainContainer) {
            mainContainer.classList.remove('portrait-container');
            mainContainer.classList.remove('expanded');
            mainContainer.classList.remove('collapsing');
          }
          
          // Remove any overlay elements
          const overlays = document.querySelectorAll('.tactile-effect, .swipe-effect');
          overlays.forEach(overlay => {
            if (document.body.contains(overlay)) {
              document.body.removeChild(overlay);
            }
          });
        } catch (e) {
          console.error('Error cleaning up UI:', e);
        }
        
        // Set flag to false BEFORE state changes for immediate effect
        setIsViewingDetail(false);
        window.isViewingNoteDetail = false;
        
        // Simply go back to notes list view with no special cases
        setTimeout(() => {
          setSelectedNote(null);
          createTactileEffect();
        }, 50);
        
        return true; // Event was handled
      }
      return false; // Let App handle the default behavior
    };
    
    // Add this handler to window to be accessible by the App component
    window.noteScreenBackHandler = handleAppBackClick;
    
    // Clean up
    return () => {
      // @ts-ignore
      delete window.noteScreenBackHandler;
      // @ts-ignore
      delete window.isViewingNoteDetail;
    };
  }, [selectedNote]);

  // Add effect to ensure the portrait mode is properly maintained
  useEffect(() => {
    // Set the flag to control the container shape
    setIsViewingDetail(selectedNote !== null);
    console.log('Setting isViewingNoteDetail:', selectedNote !== null);
    
    // If a note is selected, ensure the content is scrolled to the top
    if (selectedNote !== null && noteContentRef.current) {
      // Scroll to top immediately
      noteContentRef.current.scrollTop = 0;
      
      // Also add a small delay to ensure scroll happens after rendering
      setTimeout(() => {
        if (noteContentRef.current) {
          noteContentRef.current.scrollTop = 0;
        }
      }, 50);
    }
    
    return () => {
      // Clean up when component unmounts
      setIsViewingDetail(false);
      console.log('Cleanup: Setting isViewingNoteDetail to false');
    };
  }, [selectedNote]);

  // Add effect to check for initialNoteId and also check if we're coming from Hello World
  useEffect(() => {
    // Check if we have an initial note ID to highlight from the widget
    if (window.initialNoteId) {
      setWidgetNoteId(window.initialNoteId);
      
      // Check if this is the hello world note (id: 1) and it's being opened directly
      if (window.initialNoteId === 1 && window.openNoteDirectly) {
        // Check if we've seen the hello world note before
        const hasSeenHelloWorld = localStorage.getItem('hasSeenHelloWorld') === 'true';
        if (!hasSeenHelloWorld) {
          // Mark that this is the first view of hello world
          setIsFirstViewOfHelloWorld(true);
          // Store that we've seen hello world now
          localStorage.setItem('hasSeenHelloWorld', 'true');
        }
      }
      
      // Clear the initialNoteId after using it
      window.initialNoteId = undefined;
    }
    
    // Check if we need to track Kineship being opened from Hello World
    const openedKineshipFromHelloWorld = localStorage.getItem('openedKineshipFromHelloWorld') === 'true';
    if (openedKineshipFromHelloWorld) {
      setOpenedFromHelloWorld(true);
    }
    
    // Set up the openNoteWithId function in the window object
    window.openNoteWithId = (noteId: number) => {
      // Find the note with this ID
      const noteToOpen = notes.find(note => note.id === noteId);
      if (noteToOpen) {
        // Check if this is the Kineship note (id: 2) being opened from Hello World note (id: 1)
        if (noteId === 2 && selectedNote?.id === 1) {
          // Set flag to track that Kineship was opened from Hello World
          setOpenedFromHelloWorld(true);
          localStorage.setItem('openedKineshipFromHelloWorld', 'true');
        }
        
        // Close current note first if one is open
        setIsViewingDetail(false);
        
        // Small delay before opening the new note
        setTimeout(() => {
          setIsViewingDetail(true);
          setSelectedNote(noteToOpen);
          markNoteAsViewed(noteId);
          createTactileEffect();
        }, 150);
      }
    };
    
    // Set up the handleVideoLink function in the window object
    window.handleVideoLink = (url: string) => {
      handleVideoLink(url);
    };
    
    // Clean up
    return () => {
      // @ts-ignore
      delete window.openNoteWithId;
      // @ts-ignore
      delete window.handleVideoLink;
    };
  }, []);

  // Use the shared notes data instead of local state
  
  // Enhanced helper function for more natural date formatting
  const getRelativeDate = (dateStr: string) => {
    // Get current date
    const now = new Date();
    const today = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}`;
    
    // Get yesterday's date
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterday = `${String(yesterdayDate.getDate()).padStart(2, '0')}/${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}/${String(yesterdayDate.getFullYear()).slice(-2)}`;
    
    // Parse the provided date to get the month
    const [, month] = dateStr.split('/').map(Number);
    
    // Special cases for very recent dates
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    
    // For all other dates, just show the month
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[month - 1];
    
    return monthName;
  };

  // New filters for pinned notes and all notes
  const pinnedNotes = notes.filter(note => note.pinned);
  
  // All notes sorted by date (newest first), excluding pinned notes
  const allNotes = notes
    .filter(note => !note.pinned) // Exclude pinned notes
    .sort((a, b) => {
      // Parse dates (assuming DD/MM/YY format)
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      
      // Compare dates in reverse order (newest first)
      if (yearB !== yearA) return yearB - yearA;
      if (monthB !== monthA) return monthB - monthA;
      return dayB - dayA;
    });

  const closeNote = () => {
    // Set flag to false BEFORE state changes for immediate effect
    setIsViewingDetail(false);
    
    // Check if this is the hello world note
    const isHelloWorldNote = selectedNote?.id === 1;
    
    // Reset widgetNoteId when closing a note
    // This ensures that if the user goes back to home and clicks the same note
    // from the widget again, the orb will reappear
    if (selectedNote && widgetNoteId === selectedNote.id) {
      setWidgetNoteId(null);
    }
    
    // Add longer delay before changing React state to ensure animation completes
    setTimeout(() => {
      // Special case: If we're viewing Kineship note (id: 2) that was opened from Hello World note (id: 1),
      // then go back to Hello World note instead of closing
      if (selectedNote?.id === 2 && openedFromHelloWorld) {
        const helloWorldNote = notes.find(note => note.id === 1);
        if (helloWorldNote) {
          setSelectedNote(helloWorldNote);
          // Reset the flag since we're no longer in Kineship opened from Hello World
          setOpenedFromHelloWorld(false);
          localStorage.removeItem('openedKineshipFromHelloWorld');
        } else {
          // Fallback if Hello World note not found
          setSelectedNote(null);
        }
      } else {
        // Normal behavior for other notes
        setSelectedNote(null);
        
        // If this is the hello world note, go to home page
        if (isHelloWorldNote && typeof window !== 'undefined') {
          // Small delay to ensure the note is closed first
          setTimeout(() => {
            // This will close the notes app and go to home
            if (window.handleAppClick) {
              window.handleAppClick('home');
            }
          }, 50);
        }
      }
      createTactileEffect();
    }, 150); // Increased from 50ms to 150ms
  };

  // Animation variants
  const chevronVariants = {
    initial: { x: 0 },
    hover: { x: 2, transition: { repeat: 0, duration: 0.3 } }
  };

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Helper function to determine if a note should have a pulsing dot
  const shouldShowPulsingDot = (noteId: number) => {
    // If user came from widget, highlight that specific note
    // but hide it only while actually viewing the note
    if (widgetNoteId !== null && widgetNoteId === noteId) {
      // Only hide the dot if this note is currently being viewed
      // This ensures the dot appears again after going back to home screen
      // and clicking on the same note from the widget
      if (selectedNote && selectedNote.id === noteId) {
        return false;
      }
      return true;
    }

    // For notes not accessed through widget, check if viewed before
    const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
    if (viewedNotes.includes(noteId)) {
      return false;
    }
    
    // Otherwise, highlight the first note in the list
    return notes.length > 0 && notes[0].id === noteId;
  };

  // Add function to mark note as viewed
  const markNoteAsViewed = (noteId: number) => {
    const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
    if (!viewedNotes.includes(noteId)) {
      viewedNotes.push(noteId);
      localStorage.setItem('viewedNotes', JSON.stringify(viewedNotes));
    }
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02
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

  // Debug effect to monitor isViewingDetailRef changes
  useEffect(() => {
    console.log('selectedNote changed to:', selectedNote !== null);
    console.log('isViewingDetailRef is now:', isViewingDetailRef.current);
    console.log('window.isViewingNoteDetail is now:', window.isViewingNoteDetail);
  }, [selectedNote]);

  const handleNoteClick = (note: NoteItem) => {
    if (note.locked) return; // Prevent opening locked notes
    // Mark the note as viewed immediately
    markNoteAsViewed(note.id);
    
    // Set flag to true BEFORE state changes for immediate effect
    setIsViewingDetail(true);
    console.log('Click handler: Setting isViewingNoteDetail to true');
    setSelectedNote(note);
    
    // Find the index of the note in the combined array
    const allNotesArray = [...pinnedNotes, ...allNotes];
    const noteIndex = allNotesArray.findIndex(n => n.id === note.id);
    setCurrentNoteIndex(noteIndex);
    
    createTactileEffect();
    
    // If this was the note highlighted from widget, clear the widget ID
    // This will ensure the pulsing orb disappears when returning to the list
    if (widgetNoteId === note.id) {
      setWidgetNoteId(null);
    }
  };

  // Add function to handle video links
  const handleVideoLink = (url: string) => {
    setVideoUrl(url);
  };

  // Function to close video player
  const closeVideoPlayer = () => {
    setVideoUrl(null);
  };

  // Function to handle note navigation by swiping
  const navigateToNextNote = () => {
    // Get all notes (both pinned and regular)
    const allNotesArray = [...pinnedNotes, ...allNotes];
    
    // No navigation if we're at the end of the list
    if (currentNoteIndex >= allNotesArray.length - 1) return;
    
    const nextNote = allNotesArray[currentNoteIndex + 1];
    // Don't navigate to locked notes
    if (nextNote.locked) return;
    
    setSelectedNote(nextNote);
    setCurrentNoteIndex(currentNoteIndex + 1);
    markNoteAsViewed(nextNote.id);
    createTactileEffect();
    
    // Hide dots permanently after first swipe
    setShowDots(false);
    localStorage.setItem('hasUsedNoteSwipe', 'true');
  };
  
  const navigateToPrevNote = () => {
    // Get all notes (both pinned and regular)
    const allNotesArray = [...pinnedNotes, ...allNotes];
    
    // No navigation if we're at the beginning of the list
    if (currentNoteIndex <= 0) return;
    
    const prevNote = allNotesArray[currentNoteIndex - 1];
    // Don't navigate to locked notes
    if (prevNote.locked) return;
    
    setSelectedNote(prevNote);
    setCurrentNoteIndex(currentNoteIndex - 1);
    markNoteAsViewed(prevNote.id);
    createTactileEffect();
    
    // Hide dots permanently after first swipe
    setShowDots(false);
    localStorage.setItem('hasUsedNoteSwipe', 'true');
  };

  return (
    <div 
      className="h-full w-full" 
      onClick={(e) => {
        e.stopPropagation();
        if (selectedNote) {
          closeNote();
        }
        handleInteraction();
      }}
      onTouchStart={handleInteraction}
    >
      <AnimatePresence mode="wait">
        {selectedNote ? (
          <motion.div 
            key="note-detail"
            className="h-full w-full" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the note
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // Only add swipe handlers for mobile devices
            onTouchStart={isMobileDevice ? (e) => {
              // Don't initialize swipe if user is interacting with text (potential copy operation)
              if (window.getSelection()?.toString()) {
                return;
              }
              setSwipeStartX(e.touches[0].clientX);
              setSwipeDirection(null);
            } : undefined}
            onTouchMove={isMobileDevice ? (e) => {
              if (swipeStartX === null) return;
              
              // Don't process swipe if user is selecting text
              if (window.getSelection()?.toString()) {
                setSwipeStartX(null);
                return;
              }
              
              const currentX = e.touches[0].clientX;
              const diff = currentX - swipeStartX;
              
              // Check if the note is locked before allowing swipe
              const allNotesArray = [...pinnedNotes, ...allNotes];
              const nextNote = diff < 0 ? allNotesArray[currentNoteIndex + 1] : allNotesArray[currentNoteIndex - 1];
              if (nextNote?.locked) {
                setSwipeStartX(null);
                return;
              }
              
              // Increased threshold for swipe detection to avoid accidental swipes
              if (Math.abs(diff) > 20) {
                const newDirection = diff > 0 ? 'right' : 'left';
                if (swipeDirection !== newDirection) {
                  setSwipeDirection(newDirection);
                }
              }
            } : undefined}
            onTouchEnd={isMobileDevice ? (e) => {
              if (swipeStartX === null || swipeDirection === null) return;
              
              // Don't complete swipe if user has selected text (copy operation)
              if (window.getSelection()?.toString()) {
                setSwipeStartX(null);
                setSwipeDirection(null);
                return;
              }
              
              const endX = e.changedTouches[0].clientX;
              const diff = endX - swipeStartX;
              
              // Check if the note is locked before allowing swipe
              const allNotesArray = [...pinnedNotes, ...allNotes];
              const nextNote = diff > 0 ? allNotesArray[currentNoteIndex - 1] : allNotesArray[currentNoteIndex + 1];
              if (nextNote?.locked) {
                setSwipeStartX(null);
                setSwipeDirection(null);
                return;
              }
              
              // Increased minimum swipe distance for better differentiation
              if (Math.abs(diff) > 80) { // Increased from 50 to 80
                if (swipeDirection === 'right') {
                  navigateToPrevNote(); // Right swipe navigates to previous note
                } else {
                  navigateToNextNote(); // Left swipe navigates to next note
                }
              }
              
              setSwipeStartX(null);
              setSwipeDirection(null);
            } : undefined}
            // Remove mouse-based swipes for desktop completely
            onMouseDown={undefined}
            onMouseMove={undefined}
            onMouseUp={undefined}
            style={{
              cursor: 'auto' // Always use default cursor for web users
            }}
          >
            <div 
              className="h-full w-full rounded-lg backdrop-blur-sm bg-black/10 relative"
              style={{ 
                touchAction: 'pan-y',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                overflow: 'hidden',
                userSelect: 'text' // Explicitly allow text selection
              }}
            >
              {/* Remove left and right edge indicators */}
              
              <motion.div 
                ref={noteContentRef}
                className="h-full w-full overflow-auto scrollbar-subtle relative p-6"
                style={{ 
                  overscrollBehavior: 'contain', // Prevent pull-to-refresh and bounce effects
                  maxHeight: '100%',  // Make sure content stays within the container height
                  touchAction: 'pan-y', // Allow vertical scrolling only
                  pointerEvents: 'auto', // Ensure the component captures all pointer events
                  userSelect: 'text' // Explicitly allow text selection
                }}
              >
                {/* Remove swipe hint animation */}
                
                <motion.div 
                  className="flex flex-col"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div 
                    className="flex flex-col"
                    variants={itemVariants}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-white text-lg font-medium">
                        {selectedNote?.title}
                      </h2>
                      <span className="text-[14px] text-white/60 ml-2 mt-1">
                        {getRelativeDate(selectedNote?.date || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }))}
                      </span>
                    </div>
                    
                    {/* Show full content without preview/expand */}
                    <motion.div 
                      className="text-white/90 text-base leading-relaxed whitespace-pre-line"
                      variants={itemVariants}
                      style={{ 
                        whiteSpace: 'pre-line'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: selectedNote?.content
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
                            // Check if this is an internal note link
                            if (url.startsWith('note:')) {
                              const noteId = parseInt(url.substring(5));
                              // Special case for Kineship note (id: 2) when opened from Hello World note (id: 1)
                              if (noteId === 2 && selectedNote?.id === 1) {
                                return `<a href="javascript:void(0)" class="text-white underline decoration-white/50 hover:decoration-white/90 transition-all" onclick="(function(e) { 
                                  e.stopPropagation(); 
                                  localStorage.setItem('openedKineshipFromHelloWorld', 'true');
                                  window.openNoteWithId(${noteId});
                                })(event)">${text}</a>`;
                              } else {
                                return `<a href="javascript:void(0)" class="text-white underline decoration-white/50 hover:decoration-white/90 transition-all" onclick="(function(e) { 
                                  e.stopPropagation(); 
                                  window.openNoteWithId(${noteId});
                                })(event)">${text}</a>`;
                              }
                            }
                            
                            // Check if this is a video link
                            if (url.startsWith('video:')) {
                              const videoUrl = url.substring(6);
                              return `<a href="javascript:void(0)" class="text-white underline decoration-white/50 hover:decoration-white/90 transition-all" onclick="(function(e) { 
                                e.stopPropagation(); 
                                window.handleVideoLink('${videoUrl}');
                              })(event)">${text}</a>`;
                            }
                            
                            // Check if this is an app link
                            if (url.startsWith('app:')) {
                              const appId = url.substring(4);
                              return `<a href="javascript:void(0)" class="text-white underline decoration-white/50 hover:decoration-white/90 transition-all" onclick="(function(e) { 
                                e.stopPropagation(); 
                                window.handleAppClick('${appId}');
                              })(event)">${text}</a>`;
                            }
                            
                            // External link
                            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-white underline decoration-white/50 hover:decoration-white/90 transition-all" onclick="event.stopPropagation()">${text}</a>`;
                          })
                          .replace(/(__[^_]+__)/g, (_, part) => {
                            // Process underlined sections
                            return `<span class="underline decoration-white/90">${part.slice(2, -2)}</span>`;
                          })
                      }}
                    />
                  </motion.div>
                </motion.div>
                
                {/* Pagination dots - with smooth fade in/out */}
                <AnimatePresence>
                  {showDots && (
                    <motion.div 
                      className="flex items-center justify-center mt-4 mb-2 py-2 space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <div
                        className="h-[6px] w-[6px] rounded-full bg-white/40 transition-all duration-200 cursor-pointer hover:bg-white/60"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToPrevNote();
                        }}
                      />
                      <div className="h-[6px] w-[6px] rounded-full bg-white transition-all duration-200" />
                      <div
                        className="h-[6px] w-[6px] rounded-full bg-white/40 transition-all duration-200 cursor-pointer hover:bg-white/60"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToNextNote();
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="note-list"
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-full overflow-y-auto scrollbar-subtle">
              <div className="space-y-3 p-6">
                {/* Pinned notes section */}
                {pinnedNotes.length > 0 && (
                  <div>
                    <h2 className="text-white/60 text-[14px] font-medium uppercase tracking-wider mb-2 px-2 flex items-center">
                      <PinIcon />
                      Pinned
                    </h2>
                    <div className="space-y-0.5">
                      {pinnedNotes.map((note, index) => (
                        <motion.div 
                          key={`pinned-${note.id}`}
                          className="flex group px-1 py-0.5 rounded-md hover:bg-white/5 active:bg-white/10 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            createTactileEffect();
                            handleNoteClick(note);
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
                              animate={index === 0 && note.title.includes("hello world") && !hasInteracted ? chevronControls : undefined}
                            >
                              <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                            </motion.div>
                          </div>
                          <div className="ml-1 flex-1 flex justify-between items-center">
                            <div className="flex-1 pr-3">
                              <h3 className="text-base font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 flex items-center">
                              <span className={`text-[14px] ${note.locked ? 'text-white/50' : 'text-white/50'} whitespace-nowrap`}>
                                {note.locked ? <Lock size={16} className="text-white/50" /> : getRelativeDate(note.date)}
                              </span>
                            </div>
                          </div>
                          {shouldShowPulsingDot(note.id) && (
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

                {/* All notes section */}
                {allNotes.length > 0 && (
                  <div>
                    <h2 className="text-white/60 text-[14px] font-medium uppercase tracking-wider mb-2 px-2">
                      All
                    </h2>
                    <div className="space-y-0.5">
                      {allNotes.map((note) => (
                        <motion.div 
                          key={`all-${note.id}`}
                          className="flex group px-1 py-0.5 rounded-md relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!note.locked) {
                              createTactileEffect();
                              handleNoteClick(note);
                            }
                          }}
                          whileHover={{ scale: note.locked ? 1 : 1.01 }}
                          whileTap={{ scale: note.locked ? 1 : 0.98 }}
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
                              <h3 className={`text-base font-normal ${note.locked ? 'text-white/60' : 'text-white/90'} break-words transition-colors duration-200`}>
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 flex items-center">
                              <span className={`text-[14px] ${note.locked ? 'text-white/50' : 'text-white/50'} whitespace-nowrap`}>
                                {note.locked ? <Lock size={16} className="text-white/50" /> : getRelativeDate(note.date)}
                              </span>
                            </div>
                          </div>
                          {shouldShowPulsingDot(note.id) && (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video player overlay */}
      <AnimatePresence>
        {videoUrl && (
          <VideoPlayerOverlay 
            videoUrl={videoUrl} 
            onClose={closeVideoPlayer} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};