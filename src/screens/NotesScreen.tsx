import React, { useState, useEffect } from 'react';
import type { AppScreenProps } from '../types';
import { ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { createTactileEffect } from '../App';

type NoteItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  timeframe: 'recent' | 'older';
};

export const NotesScreen: React.FC<AppScreenProps> = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const chevronControls = useAnimation();
  const [focusedNote, setFocusedNote] = useState(2); // ID for "so...tell me about yourself"

  const [notes] = useState<NoteItem[]>([
    { 
      id: 1, 
      title: "canada", 
      content: "no, we're not the US, we never should be, and we never will be. thank you <3", 
      date: "05/04/25",
      timeframe: 'recent' 
    },
    { 
      id: 2, 
      title: "\"so...tell me about yourself\"", 
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
      title: "apples", 
      content: "sugarbee - 10/10, pink lady - 9/10, honeycrisp - 7/10", 
      date: "12/03/25",
      timeframe: 'older' 
    }
  ]);
  
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);

  // Run a subtle animation sequence on first render for mobile users
  useEffect(() => {
    if (!hasInteracted) {
      // Subtle chevron pulse animation for the focused note
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
  }, [chevronControls, hasInteracted]);

  const openNote = (note: NoteItem) => {
    setSelectedNote(note);
    createTactileEffect();
    setHasInteracted(true);
  };

  const closeNote = () => {
    setSelectedNote(null);
    createTactileEffect();
  };

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  // Filter notes by timeframe
  const recentNotes = notes.filter(note => note.timeframe === 'recent');
  const olderNotes = notes.filter(note => note.timeframe === 'older');

  // Format for today's date
  const getRelativeDate = (dateStr: string) => {
    const today = "08/04/25";
    
    if (dateStr === today) {
      return "Today";
    }
    
    if (dateStr === "07/04/25") {
      return "Yesterday";
    }
    
    return dateStr;
  };

  // Subtle chevron animation variants
  const chevronVariants = {
    initial: { x: 0 },
    hover: { x: 2, transition: { repeat: 0, duration: 0.3 } }
  };

  // Note list view
  const NotesListView = () => (
    <motion.div 
      className="h-full overflow-y-auto scrollbar-hide"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <div className="space-y-4 px-2 py-1" onClick={handleInteraction} onTouchStart={handleInteraction}>
        {/* Recent notes section */}
        {recentNotes.length > 0 && (
          <div>
            <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 pl-1">
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
                    >
                      <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                    </motion.div>
                  </div>
                  <div className="ml-2 flex-1 flex justify-between">
                    <div className="flex-1 pr-3">
                      <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 self-start pt-0.5">
                      <span className="text-xs text-white/40 whitespace-nowrap">
                        {getRelativeDate(note.date)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Older notes section */}
        {olderNotes.length > 0 && (
          <div>
            <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 pl-1">
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
                      animate={note.id === focusedNote && !hasInteracted ? chevronControls : undefined}
                    >
                      <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
                    </motion.div>
                  </div>
                  <div className="ml-2 flex-1 flex justify-between">
                    <div className="flex-1 pr-3">
                      <h3 className="text-sm font-normal text-white/90 break-words group-hover:text-white transition-colors duration-200">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 self-start pt-0.5">
                      <span className="text-xs text-white/40 whitespace-nowrap">
                        {note.date}
                      </span>
                    </div>
                  </div>
                  {!hasInteracted && note.id === focusedNote && (
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
    </motion.div>
  );

  // Note detail view
  const NoteDetailView = () => {
    if (!selectedNote) return null;

    return (
      <motion.div 
        className="h-full flex flex-col p-2"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="px-1">
          <div className="flex items-start justify-between mb-3 pt-1">
            <h2 className="text-white text-lg font-medium pr-3">{selectedNote.title}</h2>
            <div className="flex items-center flex-shrink-0 pt-1">
              <Clock size={12} className="text-white/50 mr-1" />
              <span className="text-xs text-white/50">{getRelativeDate(selectedNote.date)}</span>
            </div>
          </div>
          <div className="text-white/80 text-sm leading-relaxed overflow-y-auto max-h-[calc(100vh-90px)] scrollbar-hide">
            {selectedNote.content}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full w-full p-3" onClick={(e) => e.stopPropagation()}>
      <AnimatePresence mode="wait" initial={false}>
        {selectedNote ? (
          <NoteDetailView key="detail" />
        ) : (
          <NotesListView key="list" />
        )}
      </AnimatePresence>
    </div>
  );
};