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
          onClick={(e) => {
            createTactileEffect();
            e.stopPropagation();
            onClose();
          }}
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
  setIsNoteDetailView, // Destructure from BaseAppScreenProps (optional)
  initialNoteId, // Add the new prop here
  onClose // Destructure onClose prop
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const chevronControls = useAnimation();
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isNoteReady, setIsNoteReady] = useState<boolean>(false);
  const [widgetNoteId, setWidgetNoteId] = useState<number | null>(null);
  
  // Add state for video player
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Track if this is the first time viewing the Hello World note
  const [isFirstViewOfHelloWorld, setIsFirstViewOfHelloWorld] = useState<boolean>(false);
  
  // Track hyperlinked navigation from Hello World to Kineship note
  const [isFromHelloWorldToKineship, setIsFromHelloWorldToKineship] = useState<boolean>(false);
  
  // Create a ref to use for directly setting the window property
  const isViewingDetailRef = useRef(false);
  
  // Create a ref for the note content container
  const noteContentRef = useRef<HTMLDivElement>(null);

  // Add function to mark note as viewed
  const markNoteAsViewed = (noteId: number) => {
    try {
      const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
      if (!viewedNotes.includes(noteId)) {
        viewedNotes.push(noteId);
        localStorage.setItem('viewedNotes', JSON.stringify(viewedNotes));
      }
    } catch (error) {
        console.error("Error handling localStorage for viewedNotes:", error);
    }
  };

  // Enhanced animation variants for buttery-smooth transitions
  const chevronVariants = {
    initial: { x: 0 },
    hover: { x: 3, transition: { repeat: 0, duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } }
  };

  // Handle interaction
  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Helper function to determine if a note should have a pulsing dot
  const shouldShowPulsingDot = (noteId: number) => {
    // Feature removed: Always return false
    return false;
    /* Original Logic:
    const noteItem = notes.find(note => note.id === noteId);
    if (noteItem?.locked) {
      return false;
    }
    if (widgetNoteId !== null && widgetNoteId === noteId) {
      if (selectedNote && selectedNote.id === noteId) {
        return false;
      }
      return true;
    }
    return false;
    */
  };

  // Animation variants for beautiful entrance with minimal delay
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
        duration: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: {
        type: "spring",
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Handle initialNoteId and direct opening of Hello World note
  useEffect(() => {
    setIsInitializing(true);
    setIsNoteReady(false);

    // Check if window.openNoteDirectly is true - this means we should open Hello World
    if (window.openNoteDirectly === true) {
      // Always open Hello World note (ID 1) when openNoteDirectly is true
      const helloWorldNote = notes.find(note => note.id === 1);
      if (helloWorldNote && !helloWorldNote.locked) {
        console.log(`NotesScreen opening Hello World directly.`);
        setSelectedNote(helloWorldNote);
        setIsViewingDetail(true);
        markNoteAsViewed(1);
        setIsFirstViewOfHelloWorld(true);
        window.openNoteDirectly = false; // Reset the flag after using it

        setTimeout(() => {
          if (noteContentRef.current) {
            noteContentRef.current.scrollTop = 0;
          }
          setIsNoteReady(true);
          setIsInitializing(false);
        }, 150);
      } else {
        // Handle case where Hello World note might be missing or locked
        setSelectedNote(null);
        setIsViewingDetail(false);
        setIsInitializing(false);
        window.openNoteDirectly = false; // Still reset the flag
      }
    } else if (typeof initialNoteId === 'number') {
      // Handle opening a note passed via prop (e.g., from widget click)
      const noteToOpen = notes.find(note => note.id === initialNoteId);
      if (noteToOpen && !noteToOpen.locked) {
        console.log(`NotesScreen opening note via prop: ${initialNoteId}`);
        setSelectedNote(noteToOpen);
        setIsViewingDetail(true);
        markNoteAsViewed(initialNoteId);
        setTimeout(() => {
          if (noteContentRef.current) {
            noteContentRef.current.scrollTop = 0;
          }
          setIsNoteReady(true);
          setIsInitializing(false);
        }, 150);
      } else {
        // Invalid ID or locked note from prop -> show list view
        setSelectedNote(null);
        setIsViewingDetail(false);
        setIsInitializing(false);
      }
    } else {
      // Default to list view if no initialNoteId is provided
      setSelectedNote(null);
      setIsViewingDetail(false);
      setIsInitializing(false);
    }
  }, [initialNoteId]); // Depend only on initialNoteId
  
  // Function to update the container state when viewing details
  const setIsViewingDetail = (value: boolean) => {
    isViewingDetailRef.current = value;
    window.isViewingNoteDetail = value;
    
    if (setIsNoteDetailView) { // Check if prop exists
      setIsNoteDetailView(value);
    }
  };

  // Add effect to ensure the portrait mode is properly maintained
  useEffect(() => {
    // Set the flag to control the container shape
    setIsViewingDetail(selectedNote !== null);
    
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
    };
  }, [selectedNote]);

  // Add effect to check for initialNoteId and also check if we're coming from Hello World
  useEffect(() => {
    // Check if we have an initial note ID to highlight from the widget
    if (initialNoteId) {
      setWidgetNoteId(initialNoteId);
    }
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
  }, [initialNoteId]);

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

  const handleNoteClick = (note: NoteItem) => {
    if (note.locked) return; // Prevent opening locked notes
    // Mark the note as viewed immediately
    markNoteAsViewed(note.id);
    
    // Preload the note content first
    // setPreloadedNote(note);
    
    // Hide the note content initially until everything is ready
    setIsNoteReady(false);
    
    // Set flag to true BEFORE state changes for immediate effect
    setIsViewingDetail(true);
    if (setIsNoteDetailView) { // Check if prop exists
      setIsNoteDetailView(true);
    }
    
    createTactileEffect();
    
    // If this was the note highlighted from widget, clear the widget ID
    // This ensures that if the user goes back to home and clicks the same note
    // from the widget again, the orb will reappear
    if (widgetNoteId === note.id) {
      setWidgetNoteId(null);
    }
    
    // If hyperlink from Hello World (initialNoteId) to Kineship (note.id===2), mark for back navigation
    if (initialNoteId === selectedNote?.id && note.id === 2) {
      setIsFromHelloWorldToKineship(true);
    }
    
    // Set the selected note immediately
    setSelectedNote(note);
    
    // Delay to ensure backdrop blur is fully rendered before showing text
    setTimeout(() => {
      setIsNoteReady(true);
    }, 150); // Longer delay to ensure backdrop blur paints before text appears
  };

  // Function to close the note detail view
  const closeNote = () => {
    // Set selectedNote back to null to return to the list view
    setSelectedNote(null);
    
    // Update the detail view flag (this is also handled by useEffect depending on selectedNote)
    setIsViewingDetail(false); 
    if (setIsNoteDetailView) {
      setIsNoteDetailView(false);
    }
  
    // Optional: Add tactile feedback if desired
    // createTactileEffect(); 
  };

  // Add function to handle video links
  const handleVideoLink = (url: string) => {
    setVideoUrl(url);
  };

  // Function to close video player
  const closeVideoPlayer = () => {
    setVideoUrl(null);
  };

  // Effect to clear the first load flag on component mount
  useEffect(() => {
    localStorage.removeItem('hasCompletedFirstLoad');
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to expose openNoteWithId globally
  useEffect(() => {
    window.openNoteWithId = (noteId: number) => {
      const noteToOpen = notes.find(note => note.id === noteId);
      if (noteToOpen) {
        // Directly call handleNoteClick instead of setSelectedNote
        handleNoteClick(noteToOpen);
      } else {
        console.warn(`Note with ID ${noteId} not found.`);
      }
    };

    // Cleanup function to remove the global handler when the component unmounts
    return () => {
      delete window.openNoteWithId;
    };
    // Ensure handleNoteClick is stable or included if it depends on changing state/props
  }, [handleNoteClick]); // Add handleNoteClick to dependency array

  // Effect to set global back handler so App can delegate back action
  useEffect(() => {
    window.noteScreenBackHandler = () => {
      if (selectedNote) {
        // Back from Kineship hyperlink should return to Hello World once
        if (selectedNote.id === 2 && isFromHelloWorldToKineship) {
          setIsFromHelloWorldToKineship(false);
          const hello = notes.find(n => n.id === initialNoteId);
          if (hello) {
            setSelectedNote(hello);
            setIsViewingDetail(true);
          }
          return true;
        }
        // First-load Hello World back to home
        if (initialNoteId != null && selectedNote.id === initialNoteId && isFirstViewOfHelloWorld) {
          setIsFirstViewOfHelloWorld(false);
          return false;
        }
        // Default: close note detail
        closeNote();
        return true;
      }
      return false;
    };
    return () => {
      delete window.noteScreenBackHandler;
    };
  }, [selectedNote, initialNoteId, isFirstViewOfHelloWorld, isFromHelloWorldToKineship]);

  return (
    <div 
      className="h-full w-full" 
      style={{
        display: "block",
        position: "relative"
      }}
      onClick={(e) => {
        e.stopPropagation(); // Stop propagation immediately
        if (selectedNote) {
          // Delay the actual closing logic slightly
          setTimeout(() => {
            closeNote();
          }, 0); // setTimeout with 0 delay defers execution until after the current call stack clears
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
          >
            <div 
              className="h-full w-full rounded-xl relative"
              style={{ 
                touchAction: 'pan-y',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                overflow: 'hidden',
                userSelect: 'text' // Explicitly allow text selection
              }}
            >
              {/* Apple-style bottom fade to indicate scrollable content */}
              <div 
                className={`absolute bottom-0 left-0 right-0 pointer-events-none z-10 ${selectedNote?.title === 'hello world' ? 'h-20' : 'h-16'}`}
                style={{
                  background: selectedNote?.title === 'hello world' 
                    ? 'linear-gradient(to top, rgba(45, 35, 28, 0.98) 0%, rgba(45, 35, 28, 0.85) 30%, rgba(45, 35, 28, 0.4) 60%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(25, 25, 28, 0.98) 0%, rgba(25, 25, 28, 0.85) 30%, rgba(25, 25, 28, 0.4) 60%, transparent 100%)',
                  borderBottomLeftRadius: '0.75rem',
                  borderBottomRightRadius: '0.75rem'
                }}
              />
              
              <motion.div 
                ref={noteContentRef}
                className="h-full w-full overflow-auto scrollbar-subtle relative p-6 pb-28"
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
                  className="flex flex-col space-y-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate={isNoteReady ? "show" : "hidden"}
                  exit="exit" 
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
                        {getRelativeDate(selectedNote?.date)}
                      </span>
                    </div>
                    
                    {/* Show full content without preview/expand */}
                    <motion.div 
                      className="text-sm leading-relaxed text-white/80 overflow-y-auto scrollbar-subtle pr-1 note-content-area lora-note-content"
                      variants={itemVariants}
                      style={{ 
                        WebkitOverflowScrolling: 'touch',
                        whiteSpace: 'pre-line'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: selectedNote?.content
                          // Rule for italics: *text* -> <em>text</em>
                          .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
                          // Rule for links: [text](url)
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
                            // Check if this is an internal note link
                            if (url.startsWith('note:')) {
                              const noteId = parseInt(url.substring(5));
                              let clickHandler = `(function(e) { 
                                e.stopPropagation(); 
                                
                                window.openNoteWithId(${noteId});
                              })(event)`;
                              return `<a href=\"javascript:void(0)\" class=\"custom-pink-link\" onclick=\"${clickHandler}\">${text}</a>`;
                            }
                            
                            // Check if this is a video link
                            if (url.startsWith('video:')) {
                              const videoUrl = url.substring(6);
                              return `<a href=\"javascript:void(0)\" class=\"custom-pink-link\" onclick=\"(function(e) { 
                                e.stopPropagation(); 
                                window.handleVideoLink(\'${videoUrl}\');
                              })(event)\">${text}</a>`;
                            }
                            
                            // Check if this is an app link
                            if (url.startsWith('app:')) {
                              const appId = url.substring(4);
                              return `<a href=\"javascript:void(0)\" class=\"custom-pink-link\" onclick=\"(function(e) { 
                                e.stopPropagation(); 
                                window.handleAppClick(\'${appId}\');
                              })(event)\">${text}</a>`;
                            }
                            
                            // Explicitly handle mailto links
                            if (url.startsWith('mailto:')) {
                              return `<a href=\"${url}\" class=\"custom-pink-link\" onclick=\"event.stopPropagation()\">${text}</a>`;
                            }
                            
                            // External links (http, https, etc.) - ensure target_blank for these
                            if (url.startsWith('http:') || url.startsWith('https:')) {
                                return `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"custom-pink-link\" onclick=\"event.stopPropagation()\">${text}</a>`;
                            }
                            
                            // Fallback for any other link types (though ideally all are covered)
                            return `<a href=\"${url}\" class=\"custom-pink-link\" onclick=\"event.stopPropagation()\">${text}</a>`;
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
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }} 
              className="flex flex-col h-full w-full overflow-hidden"
            >
              <div className="h-full overflow-y-auto scrollbar-subtle p-6">
                {/* Pinned notes section */}
                {pinnedNotes.length > 0 && (
                  <div>
                    {/* Remove px-2 from header */}
                    <h2 className="text-white/60 text-[14px] font-medium uppercase tracking-wider mb-4 flex items-center">
                      <PinIcon />
                      Pinned
                    </h2>
                    <div className="space-y-2">
                      {pinnedNotes.map((note, index) => (
                        <motion.div 
                          key={`pinned-${note.id}`}
                          className="flex group px-2 py-2 rounded-md hover:bg-white/5 active:bg-white/10 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            createTactileEffect();
                            handleNoteClick(note);
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                              <h3 className="text-white/90 break-words group-hover:text-white transition-colors duration-200 distinct-note-font">
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 flex items-center">
                              <span className={`text-[14px] text-white/50 whitespace-nowrap`}>
                                {getRelativeDate(note.date)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All notes section */}
                {allNotes.length > 0 && (
                  <div>
                    {/* Remove px-2 from header */}
                    <h2 className="text-white/60 text-[14px] font-medium uppercase tracking-wider mb-4">
                      All
                    </h2>
                    <div className="space-y-2">
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
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                              <h3 className={`${note.locked ? 'text-white/60' : 'text-white/90'} break-words transition-colors duration-200 distinct-note-font`}>
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 flex items-center">
                              <span className={`text-[14px] ${note.locked ? 'text-white/50' : 'text-white/50'} whitespace-nowrap`}>
                                {note.locked ? <Lock size={16} className="text-white/50" /> : getRelativeDate(note.date)}
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