import React, { useState, useEffect, useRef } from 'react';
import type { AppScreenProps as BaseAppScreenProps } from '../types'; 
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Lock } from 'lucide-react';
import { createTactileEffect } from '../App';
import { notes, NoteItem } from '../data/notes';
import ReactDOM from 'react-dom';

// Declare the global window property for TypeScript
declare global {
  interface Window {
    noteScreenBackHandler?: () => boolean;
    initialNoteId?: number | null;
    initialEventId?: number | null;
    isNoteDetailView: boolean; 
    setIsNoteDetailView: (value: boolean) => void; 
    isViewingNoteDetail?: boolean;
    openNoteWithId?: (noteId: number) => void;
    openEventWithId?: (eventId: number) => void;
    handleAppClick?: (appId: string) => void;
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

// Use the imported BaseAppScreenProps directly
export const NotesScreen: React.FC<BaseAppScreenProps> = ({ 
  onClose, 
  onNavigate, 
  initialNoteId, 
  initialEventId, // Even if unused here, keep props consistent
  isNoteDetailView, // Destructure from BaseAppScreenProps (optional)
  setIsNoteDetailView // Destructure from BaseAppScreenProps (optional)
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const chevronControls = useAnimation();
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [isNoteReady, setIsNoteReady] = useState<boolean>(false);
  const [preloadedNote, setPreloadedNote] = useState<NoteItem | null>(null);
  const [widgetNoteId, setWidgetNoteId] = useState<number | null>(null);
  // Removed swipe state and note index state
  
  // Add state for video player
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Add state to track if Kineship note was opened from Hello World note
  const [openedFromHelloWorld, setOpenedFromHelloWorld] = useState<boolean>(false);
  
  // Track if this is the first time viewing hello world note directly - unused but kept for future use
  const [, setIsFirstViewOfHelloWorld] = useState<boolean>(false);
  
  // Create a ref to use for directly setting the window property
  const isViewingDetailRef = useRef(false);
  
  // Removed pagination dots state
  
  // Removed mobile device detection state
  // const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // Create a ref for the note content container
  const noteContentRef = useRef<HTMLDivElement>(null);
  
  // Only open hello world note on initial page load
  useEffect(() => {
    // Start with initializing state to prevent flash of notes list
    setIsInitializing(true);
    setIsNoteReady(false);
    
    // Only auto-open a note detail when explicitly signaled
    if (typeof window !== 'undefined' && window.openNoteDirectly && window.initialNoteId) {
      // Find the note with the specified ID
      const noteToOpen = notes.find(note => note.id === window.initialNoteId);
      if (noteToOpen) {
        // Preload the note content first
        setPreloadedNote(noteToOpen);
        
        // Open the note directly in detail view
        console.log('Opening note directly in detail view:', noteToOpen.id);
        setSelectedNote(noteToOpen);
        setIsViewingDetail(true);
        
        // Mark the hello world note as viewed since users always see it first
        if (noteToOpen.id === 1) { // Hello world note ID is 1
          markNoteAsViewed(1);
        }
        
        // Reset the openNoteDirectly flag to avoid reopening on component re-renders
        window.openNoteDirectly = false;
        
        // Use a longer delay to ensure everything is fully rendered
        setTimeout(() => {
          setIsNoteReady(true);
          setIsInitializing(false);
        }, 150);
      }
    } else {
      // Default to listing all notes
      setIsNoteReady(true);
      setIsInitializing(false);
    }
    // Clear any pending open flags
    window.initialNoteId = undefined;
    window.openNoteDirectly = false;

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
  
    // Function to update the container state when viewing details
    const setIsViewingDetail = (value: boolean) => {
      isViewingDetailRef.current = value;
      window.isViewingNoteDetail = value;
      console.log('Setting isViewingNoteDetail via function:', value);
      
      if (setIsNoteDetailView) { // Check if prop exists
        setIsNoteDetailView(value);
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

  // Back handler with special case for Kineship to hello world navigation
  useEffect(() => {
    const handleAppBackClick = () => {
      if (selectedNote) {
        // Immediately clean up UI elements that might cause the grey box
        try {
          // Clean up any UI artifacts
          const mainContainer = document.querySelector('.main-container');
          if (mainContainer) {
            // Keep portrait-container class since both views use it now
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
          
          // Removed backdrop blur cleanup code as we no longer use blur effects
        } catch (e) {
          console.error('Error cleaning up UI:', e);
        }
        
        // Set flag to false BEFORE state changes for immediate effect
        setIsViewingDetail(false);
        window.isViewingNoteDetail = false;
        
        // Special case: If we're viewing Kineship note (id: 2) and it was opened from Hello World
        // Check if we opened Kineship from Hello World
        const openedFromHelloWorldFlag = localStorage.getItem('openedKineshipFromHelloWorld') === 'true';
        
        if (selectedNote.id === 2 && openedFromHelloWorldFlag) {
          // Go back to Hello World note instead of notes list
          console.log('Going back to Hello World note from Kineship');
          setTimeout(() => {
            const helloWorldNote = notes.find(note => note.id === 1);
            if (helloWorldNote) {
              setSelectedNote(helloWorldNote);
              setIsViewingDetail(true);
              window.isViewingNoteDetail = true;
              // Clear the flag
              localStorage.removeItem('openedKineshipFromHelloWorld');
            } else {
              // Fallback if hello world note not found
              setSelectedNote(null);
            }
            createTactileEffect();
          }, 400);
        } else {
          // Normal case - go back to notes list
          setTimeout(() => {
            setSelectedNote(null);
            createTactileEffect();
          }, 400);
        }
        
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
  const noteToOpen = notes.find(note => note.id === noteId);
  if (noteToOpen) {
    // Special case for Kineship from Hello World
    if (noteId === 2 && selectedNote?.id === 1) {
      setOpenedFromHelloWorld(true);
      localStorage.setItem('openedKineshipFromHelloWorld', 'true');
    }
    // Always set detail mode BEFORE setting selected note
    setIsViewingDetail(true);
    setSelectedNote(noteToOpen);
    markNoteAsViewed(noteId);
    createTactileEffect();
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
    // Check if this is the hello world note
    const isHelloWorldNote = selectedNote?.id === 1;
    
    // Reset widgetNoteId when closing a note
    // This ensures that if the user goes back to home and clicks the same note
    // from the widget again, the orb will reappear
    if (selectedNote && widgetNoteId === selectedNote.id) {
      setWidgetNoteId(null);
    }
    
    // Clean up any UI artifacts that might be causing the grey screen
    try {
      // Remove any overlay elements that might be causing the grey box
      const overlays = document.querySelectorAll('.tactile-effect, .swipe-effect');
      overlays.forEach(overlay => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      });
      
      // Reset backdrop filters that might be causing the grey screen
      const blurElements = document.querySelectorAll('.backdrop-blur-lg, .backdrop-blur-md, .backdrop-blur-sm');
      blurElements.forEach(el => {
        (el as HTMLElement).style.backdropFilter = 'none';
        // Use setAttribute for vendor prefixed properties to avoid TypeScript errors
        (el as HTMLElement).setAttribute('style', '-webkit-backdrop-filter: none');
      });
    } catch (e) {
      console.error('Error cleaning up UI:', e);
    }
    
    // Set flag to false BEFORE state changes for immediate effect
    setIsViewingDetail(false);
    if (setIsNoteDetailView) { // Check if prop exists
      setIsNoteDetailView(false);
    }
    
    // For hello world note, go to home with buttery-smooth animation
    if (isHelloWorldNote && typeof window !== 'undefined') {
      // Small delay to ensure the note closing animation starts
      setTimeout(() => {
        setSelectedNote(null);
        
        // Enhanced timing for smoother transition
        setTimeout(() => {
          // This will close the notes app and go to home
          if (window.handleAppClick) {
            window.handleAppClick('home');
          }
        }, 200); // Increased for smoother transition
      }, 80); // Slightly increased for better timing
      return;
    }
    
    // For other notes, use enhanced buttery-smooth animation
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
      }
      createTactileEffect();
    }, 120); // Optimized timing for buttery-smooth transitions
  };

  // Enhanced animation variants for buttery-smooth transitions
  const chevronVariants = {
    initial: { x: 0 },
    hover: { x: 3, transition: { repeat: 0, duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } }
  };

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Helper function to determine if a note should have a pulsing dot
  const shouldShowPulsingDot = (noteId: number) => {
    // First, check if the note is locked - never show pulsing dot for locked notes
    const noteItem = notes.find(note => note.id === noteId);
    if (noteItem?.locked) {
      return false;
    }

    // ONLY show pulsing dot if the note was accessed through the widget
    // and hide it only while actually viewing the note
    if (widgetNoteId !== null && widgetNoteId === noteId) {
      // Only hide the dot if this note is currently being viewed
      // This ensures the dot appears again after going back to home screen
      // and clicking on the same note from the widget
      if (selectedNote && selectedNote.id === noteId) {
        return false;
      }
      return true;
    }
    
    // For all other cases, don't show pulsing dot
    return false;
  };

  // Add function to mark note as viewed
  const markNoteAsViewed = (noteId: number) => {
    const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
    if (!viewedNotes.includes(noteId)) {
      viewedNotes.push(noteId);
      localStorage.setItem('viewedNotes', JSON.stringify(viewedNotes));
    }
  };

  // Animation variants for beautiful entrance with minimal delay
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05, // Small delay to ensure container is visible first
        duration: 0.1 // Very quick container fade-in
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 }, // Only fade out
    show: { 
      opacity: 1, 
      transition: {
        type: "spring",
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    }
  };

  const handleNoteClick = (note: NoteItem) => {
    if (note.locked) return; // Prevent opening locked notes
    // Mark the note as viewed immediately
    markNoteAsViewed(note.id);
    
    // Preload the note content first
    setPreloadedNote(note);
    
    // Hide the note content initially until everything is ready
    setIsNoteReady(false);
    
    // Set flag to true BEFORE state changes for immediate effect
    setIsViewingDetail(true);
    console.log('Click handler: Setting isViewingNoteDetail to true');
    if (setIsNoteDetailView) { // Check if prop exists
      setIsNoteDetailView(true);
    }
    
    // Find the index of the note in the combined array
    const allNotesArray = [...pinnedNotes, ...allNotes];
    const noteIndex = allNotesArray.findIndex(n => n.id === note.id);
    setCurrentNoteIndex(noteIndex);
    
    createTactileEffect();
    
    // If this was the note highlighted from widget, clear the widget ID
    // This ensures that if the user goes back to home and clicks the same note
    // from the widget again, the orb will reappear
    if (widgetNoteId === note.id) {
      setWidgetNoteId(null);
    }
    
    // Set the selected note immediately
    setSelectedNote(note);
    
    // Use a slightly longer delay to allow frame transition to start
    setTimeout(() => {
      setIsNoteReady(true);
    }, 50); // Reduced delay, animation has its own delay
  };

  // Add function to handle video links
  const handleVideoLink = (url: string) => {
    setVideoUrl(url);
  };

  // Function to close video player
  const closeVideoPlayer = () => {
    setVideoUrl(null);
  };

  // Removed swipe-to-next-note functionality
  
  // Removed swipe-to-prev-note functionality

  // Removed createTactileEffect function (no longer needed)

  // Removed swipe handler function

  return (
    <div 
      className="h-full w-full" 
      style={{
        display: "block",
        position: "relative"
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (selectedNote) {
          // Don't close the note here automatically on background click
          // closeNote(); 
        }
        handleInteraction();
      }}
      onTouchStart={handleInteraction}
    >
      <AnimatePresence mode="wait">
        {selectedNote ? (
          <motion.div 
            key="note-detail"
            className="flex flex-col h-full w-full overflow-hidden" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the note
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ 
              duration: 0.25, 
              ease: "easeInOut"
            }}
            style={{
              display: "block",
              width: "290px",
              height: "390px",
              aspectRatio: "3/4",
              cursor: 'auto' // Always use default cursor for web users
            }}
          >
            <div 
              className="h-full w-full rounded-lg relative"
              style={{ 
                touchAction: 'pan-y',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                // Removed backdrop blur effects
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
                
                {/* Removed pagination dots UI */}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          !isInitializing && (
            <motion.div 
              key="note-list"
              className="flex flex-col h-full w-full overflow-hidden" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.25, ease: "easeInOut" }} 
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
          )
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