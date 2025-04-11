import React, { useState, useEffect } from 'react';
import type { AppScreenProps } from '../types';
import { motion, useAnimation, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, ChevronLeft } from 'lucide-react';
import { createTactileEffect } from '../App';

// Declare the global window property for TypeScript
declare global {
  interface Window {
    noteScreenBackHandler?: () => boolean;
  }
}

type NoteItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  timeframe: 'recent' | 'older';
};

export const NotesScreen: React.FC<AppScreenProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const chevronControls = useAnimation();
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  
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
        closeNote();
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
    };
  }, [selectedNote]);

  const [notes] = useState<NoteItem[]>([
    { 
      id: 1, 
      title: "canada", 
      content: "no, we're not the US. <br></br> we never should be, and we never will be. thank you 🤍🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🇨🇦🍁🍁🍁🍁🍁", 
      date: "05/04/25",
      timeframe: 'recent' 
    },
    { 
      id: 2, 
      title: "\"so... what's your story?\"", 
      content: "an impossible question to answer briefly.", 
      date: "17/03/25",
      timeframe: 'older' 
    },
    { 
      id: 3, 
      title: "reshaping social culture for longevity", 
      content: "strong connections lead to longer, healthier lives.", 
      date: "25/03/25",
      timeframe: 'older' 
    },
    { 
      id: 4, 
      title: "apples!", 
      content: "sugarbee - 10/10, pink lady - 9/10, honeycrisp - 7/10", 
      date: "12/03/25",
      timeframe: 'older' 
    }
  ]);
  
  // Simple helper function to format date
  const getRelativeDate = (dateStr: string) => {
    const today = "08/04/25";
    if (dateStr === today) return "Today";
    if (dateStr === "07/04/25") return "Yesterday";
    return dateStr;
  };

  // Filter notes by timeframe
  const recentNotes = notes.filter(note => note.timeframe === 'recent');
  const olderNotes = notes.filter(note => note.timeframe === 'older');

  const openNote = (note: NoteItem) => {
    setSelectedNote(note);
    setHasInteracted(true);
    createTactileEffect();
  };

  const closeNote = () => {
    setSelectedNote(null);
    createTactileEffect();
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

  return (
    <div 
      className="h-full w-full" 
      onClick={(e) => {
        e.stopPropagation();
        if (selectedNote) {
          closeNote(); // Close note when clicking the background
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
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0, transition: { type: "spring", damping: 25, stiffness: 300, velocity: 2 } }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="h-full w-full rounded-lg backdrop-blur-sm bg-black/10">
              <div className="flex items-center justify-between px-6 pt-6 pb-1 text-white/80">
                <div className="flex items-center">
                  {/* Empty div to maintain spacing */}
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-white/60">{getRelativeDate(selectedNote?.date || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }))}</span>
                </div>
              </div>
              
              <div className="h-[calc(100%-44px)] flex flex-col p-4 pt-2">
                <div className="px-2">
                  <div className="mb-3 pt-0">
                    <h2 className="text-white text-lg font-medium">
                      {selectedNote?.title}
                    </h2>
                  </div>
                  <div className="text-white/90 text-sm leading-relaxed overflow-y-auto max-h-[calc(100vh-130px)] scrollbar-subtle">
                    {selectedNote?.content}
                  </div>
                </div>
              </div>
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
              <div className="space-y-4 p-6">
                {/* Recent notes section */}
                {recentNotes.length > 0 && (
                  <div>
                    <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                      Previous 7 days
                    </h2>
                    <div className="space-y-1">
                      {recentNotes.map((note, index) => (
                        <motion.div 
                          key={note.id}
                          className="flex cursor-pointer group px-1 py-1 rounded-md hover:bg-white/5 active:bg-white/10 relative" 
                          onClick={() => openNote(note)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
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
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 self-start">
                              <span className="text-xs text-white/40 whitespace-nowrap pt-0.5">
                                {getRelativeDate(note.date)}
                              </span>
                            </div>
                          </div>
                          {!hasInteracted && index === 0 && (
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

                {/* Older notes section */}
                {olderNotes.length > 0 && (
                  <div>
                    <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                      Previous 30 days
                    </h2>
                    <div className="space-y-1">
                      {olderNotes.map((note, index) => (
                        <motion.div 
                          key={note.id}
                          className="flex cursor-pointer group px-1 py-1 rounded-md hover:bg-white/5 active:bg-white/10 relative" 
                          onClick={() => openNote(note)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-5 h-5 flex-shrink-0 flex items-start justify-center pt-0.5 text-white/50">
                            <motion.div
                              variants={chevronVariants}
                              initial="initial"
                              whileHover="hover"
                            >
                              <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                            </motion.div>
                          </div>
                          <div className="ml-1 flex-1 flex justify-between">
                            <div className="flex-1 pr-3">
                              <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 self-start">
                              <span className="text-xs text-white/40 whitespace-nowrap pt-0.5">
                                {getRelativeDate(note.date)}
                              </span>
                            </div>
                          </div>
                          {!hasInteracted && note.title === "\"so...tell me about yourself\"" && (
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};