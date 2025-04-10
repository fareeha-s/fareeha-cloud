import React, { useState } from 'react';
import type { AppScreenProps } from '../types';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, ChevronLeft } from 'lucide-react';
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
    createTactileEffect();
  };

  const closeNote = () => {
    setSelectedNote(null);
    createTactileEffect();
  };

  // Simple version with conditional rendering
  if (selectedNote) {
    return (
      <div className="h-full w-full" onClick={(e) => e.stopPropagation()}>
        <motion.div 
          className="h-full w-full rounded-lg backdrop-blur-sm bg-black/10" 
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          drag="x"
          dragConstraints={{ left: 0, right: 100 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x > 80) {
              closeNote();
            }
          }}
        >
          <div className="flex items-center px-4 py-3 text-white/80">
            <button 
              className="flex items-center"
              onClick={closeNote}
            >
              <ChevronLeft size={16} className="mr-1" />
              <span className="text-xs">Notes</span>
            </button>
          </div>
          
          <div className="h-[calc(100%-44px)] flex flex-col p-4">
            <div className="px-2">
              <div className="flex items-start justify-between mb-3 pt-1">
                <h2 className="text-white text-lg font-medium pr-3">
                  {selectedNote.title}
                </h2>
                <div className="flex items-center flex-shrink-0 pt-1">
                  <Clock size={12} className="text-white/60 mr-1" />
                  <span className="text-xs text-white/60">{getRelativeDate(selectedNote.date)}</span>
                </div>
              </div>
              <div className="text-white/90 text-sm leading-relaxed overflow-y-auto max-h-[calc(100vh-130px)] scrollbar-subtle">
                {selectedNote.content}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Otherwise, show the list view
  return (
    <div className="h-full w-full" onClick={(e) => e.stopPropagation()}>
      <div className="h-full overflow-y-auto scrollbar-subtle">
        <div className="space-y-4 p-6">
          {/* Recent notes section */}
          {recentNotes.length > 0 && (
            <div>
              <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 px-2">
                Previous 7 days
              </h2>
              <div className="space-y-1">
                {recentNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="flex cursor-pointer group px-1 py-1 rounded-md hover:bg-white/5 active:bg-white/10 relative" 
                    onClick={() => openNote(note)}
                  >
                    <div className="w-5 h-5 flex-shrink-0 flex items-start justify-center pt-0.5 text-white/50">
                      <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
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
                  </div>
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
                {olderNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="flex cursor-pointer group px-1 py-1 rounded-md hover:bg-white/5 active:bg-white/10 relative" 
                    onClick={() => openNote(note)}
                  >
                    <div className="w-5 h-5 flex-shrink-0 flex items-start justify-center pt-0.5 text-white/50">
                      <ChevronRight size={16} className="group-hover:text-white/70 transition-colors duration-200" />
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};