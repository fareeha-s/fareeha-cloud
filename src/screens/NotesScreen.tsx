import React, { useState } from 'react';
import type { AppScreenProps } from '../types';
import { ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTactileEffect } from '../App';

type NoteItem = {
  id: number;
  title: string;
  content: string;
  date: string;
  timeframe: 'recent' | 'older';
};

export const NotesScreen: React.FC<AppScreenProps> = () => {
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

  const openNote = (note: NoteItem) => {
    setSelectedNote(note);
    createTactileEffect();
  };

  const closeNote = () => {
    setSelectedNote(null);
    createTactileEffect();
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

  // Note list view
  const NotesListView = () => (
    <motion.div 
      className="h-full overflow-y-auto scrollbar-hide"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <div className="space-y-6 px-2 py-2">
        {/* Recent notes section */}
        {recentNotes.length > 0 && (
          <div>
            <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 pl-1">
              Previous 7 days
            </h2>
            <div className="space-y-2">
              {recentNotes.map(note => (
                <div 
                  key={note.id}
                  className="flex cursor-pointer group px-1 py-2 rounded-md hover:bg-white/5" 
                  onClick={() => openNote(note)}
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-start justify-center pt-0.5 text-white/50 group-hover:text-white/70">
                    <ChevronRight size={16} />
                  </div>
                  <div className="ml-2 flex-1 flex justify-between">
                    <div className="flex-1 pr-3">
                      <h3 className="text-sm font-normal text-white/90 group-hover:text-white break-words">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 self-start pt-0.5">
                      <span className="text-xs text-white/40 group-hover:text-white/60 whitespace-nowrap">
                        {getRelativeDate(note.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Older notes section */}
        {olderNotes.length > 0 && (
          <div>
            <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 pl-1">
              Previous 30 days
            </h2>
            <div className="space-y-2">
              {olderNotes.map(note => (
                <div 
                  key={note.id}
                  className="flex cursor-pointer group px-1 py-2 rounded-md hover:bg-white/5" 
                  onClick={() => openNote(note)}
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-start justify-center pt-0.5 text-white/50 group-hover:text-white/70">
                    <ChevronRight size={16} />
                  </div>
                  <div className="ml-2 flex-1 flex justify-between">
                    <div className="flex-1 pr-3">
                      <h3 className="text-sm font-normal text-white/90 group-hover:text-white break-words">
                        {note.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 self-start pt-0.5">
                      <span className="text-xs text-white/40 group-hover:text-white/60 whitespace-nowrap">
                        {note.date}
                      </span>
                    </div>
                  </div>
                </div>
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
          <div className="flex items-start justify-between mb-4 pt-2">
            <h2 className="text-white text-lg font-medium pr-3">{selectedNote.title}</h2>
            <div className="flex items-center flex-shrink-0 pt-1">
              <Clock size={12} className="text-white/50 mr-1" />
              <span className="text-xs text-white/50">{getRelativeDate(selectedNote.date)}</span>
            </div>
          </div>
          <div className="text-white/80 text-sm leading-relaxed overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-hide">
            {selectedNote.content}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full w-full p-4" onClick={(e) => e.stopPropagation()}>
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