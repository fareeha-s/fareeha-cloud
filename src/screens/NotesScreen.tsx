import React, { useState, useEffect, useRef } from 'react';
import type { AppScreenProps } from '../types';
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
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
  
  // Add state for video player
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Create a ref to use for directly setting the window property
  const isViewingDetailRef = useRef(false);
  
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

  // Set up back handler - MOVED OUTSIDE the conditional rendering
  useEffect(() => {
    // If we have a selected note and the App's back button is clicked,
    // we should close the note view first instead of closing the app
    const handleAppBackClick = () => {
      if (selectedNote) {
        // Set flag to false BEFORE state changes for immediate effect
        setIsViewingDetail(false);
        
        // Add longer delay before changing React state to ensure animation completes
        setTimeout(() => {
          setSelectedNote(null);
          createTactileEffect();
        }, 150); // Increased from 50ms to 150ms
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
    
    return () => {
      // Clean up when component unmounts
      setIsViewingDetail(false);
      console.log('Cleanup: Setting isViewingNoteDetail to false');
    };
  }, [selectedNote]);

  // Add effect to check for initialNoteId
  useEffect(() => {
    // Check if we have an initial note ID to highlight from the widget
    if (window.initialNoteId) {
      setWidgetNoteId(window.initialNoteId);
      // Clear the initialNoteId after using it
      window.initialNoteId = undefined;
    }
    
    // Set up the openNoteWithId function in the window object
    window.openNoteWithId = (noteId: number) => {
      // Find the note with this ID
      const noteToOpen = notes.find(note => note.id === noteId);
      if (noteToOpen) {
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
    
    // Parse the provided date to get the day of week
    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(2000 + year, month - 1, day);
    
    // Get day of week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[dateObj.getDay()];
    
    // Calculate difference in days
    const diffTime = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate difference in weeks and months
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = (now.getFullYear() - dateObj.getFullYear()) * 12 + now.getMonth() - dateObj.getMonth();
    
    if (dateStr === today) return 'today';
    if (dateStr === yesterday) return 'yesterday';
    
    // Within a week, use day names
    if (diffDays < 7) return dayOfWeek.toLowerCase();
    
    // Within two weeks
    if (diffDays < 14) return 'last week';
    
    // Within a month
    if (diffDays < 31) {
      if (diffWeeks === 2) return '2 weeks ago';
      if (diffWeeks === 3) return '3 weeks ago';
      return `${diffWeeks} weeks ago`;
    }
    
    // Within 3 months
    if (diffMonths <= 3) {
      if (diffMonths === 1) return '1 month ago';
      return `${diffMonths} months ago`;
    }
    
    // Older dates
    return dateStr;
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
    
    // Add longer delay before changing React state to ensure animation completes
    setTimeout(() => {
      setSelectedNote(null);
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
    // Check if this note has been viewed before
    const viewedNotes = JSON.parse(localStorage.getItem('viewedNotes') || '[]');
    if (viewedNotes.includes(noteId)) {
      return false;
    }

    // If user came from widget, only highlight that specific note
    if (widgetNoteId !== null) {
      return widgetNoteId === noteId;
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
    markNoteAsViewed(note.id);
    // Set flag to true BEFORE state changes for immediate effect
    setIsViewingDetail(true);
    console.log('Click handler: Setting isViewingNoteDetail to true');
    setSelectedNote(note);
    createTactileEffect();
  };

  // Add function to handle video links
  const handleVideoLink = (url: string) => {
    setVideoUrl(url);
  };

  // Function to close video player
  const closeVideoPlayer = () => {
    setVideoUrl(null);
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
          >
            <div 
              className="h-full w-full rounded-lg backdrop-blur-sm bg-black/10"
              style={{ 
                touchAction: 'pan-y',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                overflow: 'hidden'
              }}
            >
              <motion.div 
                className="h-full w-full overflow-auto scrollbar-subtle relative p-6"
                style={{ 
                  overscrollBehavior: 'contain', // Prevent pull-to-refresh and bounce effects
                  maxHeight: '100%',  // Make sure content stays within the container height
                  touchAction: 'pan-y', // Allow vertical scrolling only
                  pointerEvents: 'auto' // Ensure the component captures all pointer events
                }}
              >
                <div className="flex items-center justify-between mb-1 text-white/80">
                  <div className="flex items-center">
                    {/* Empty div to maintain spacing */}
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-white/60">{getRelativeDate(selectedNote?.date || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }))}</span>
                  </div>
                </div>
                
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
                    <div className="mb-2">
                      <h2 className="text-white text-lg font-medium">
                        {selectedNote?.title}
                      </h2>
                    </div>
                    
                    {/* Show full content without preview/expand */}
                    <motion.div 
                      className="text-white/90 text-sm leading-relaxed whitespace-pre-line"
                      variants={itemVariants}
                      style={{ 
                        whiteSpace: 'pre-line'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: selectedNote?.content
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
                            // Check if this is an internal note link
                            if (url.startsWith('note:')) {
                              const noteId = parseInt(url.substring(5));
                              return `<a href="javascript:void(0)" class="text-white underline decoration-white/50 hover:decoration-white/90 transition-all" onclick="(function(e) { 
                                e.stopPropagation(); 
                                window.openNoteWithId(${noteId});
                              })(event)">${text}</a>`;
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
                          .replace(/(__[^_]+__)/g, (match, part) => {
                            // Process underlined sections
                            return `<span class="underline decoration-white/90">${part.slice(2, -2)}</span>`;
                          })
                      }}
                    />
                  </motion.div>
                </motion.div>
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
                    <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2 flex items-center">
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
                              animate={index === 0 && note.title.includes("hello world!") && !hasInteracted ? chevronControls : undefined}
                            >
                              <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                            </motion.div>
                          </div>
                          <div className="ml-1 flex-1 flex justify-between items-center">
                            <div className="flex-1 pr-3">
                              <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 flex items-center">
                              <span className="text-xs text-white/40 whitespace-nowrap">
                                {getRelativeDate(note.date)}
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
                    <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                      Last edited
                    </h2>
                    <div className="space-y-0.5">
                      {allNotes.map((note, index) => (
                        <motion.div 
                          key={`all-${note.id}`}
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
                            >
                              <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                            </motion.div>
                          </div>
                          <div className="ml-1 flex-1 flex justify-between items-center">
                            <div className="flex-1 pr-3">
                              <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 flex items-center">
                              <span className="text-xs text-white/40 whitespace-nowrap">
                                {getRelativeDate(note.date)}
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