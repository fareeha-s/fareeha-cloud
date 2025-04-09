import React, { useState } from 'react';
import type { AppScreenProps } from '../types';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTactileEffect } from '../App';

type NoteItem = {
  id: number;
  title: string;
  content: string;
  expanded: boolean;
  timeframe: 'recent' | 'older';
};

export const NotesScreen: React.FC<AppScreenProps> = () => {
  const [notes, setNotes] = useState<NoteItem[]>([
    { id: 1, title: "canada", content: "no, we're not the US, we never should be, and we never will be. thank you <3", expanded: false, timeframe: 'recent' },
    { id: 2, title: "\"so...tell me about yourself\"", content: "an impossible question to answer briefly.", expanded: false, timeframe: 'older' },
    { id: 3, title: "reshaping social culture for longevity", content: "strong connections lead to longer, healthier lives.", expanded: false, timeframe: 'older' },
    { id: 4, title: "apples", content: "honeycrisp, pink lady, granny smith, fuji.", expanded: false, timeframe: 'older' }
  ]);

  const toggleNote = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, expanded: !note.expanded } : note
    ));
    createTactileEffect();
  };

  // Filter notes by timeframe
  const recentNotes = notes.filter(note => note.timeframe === 'recent');
  const olderNotes = notes.filter(note => note.timeframe === 'older');

  // Note renderer function
  const renderNote = (note: NoteItem) => (
    <div key={note.id}>
      <div 
        className="flex items-center cursor-pointer group py-1.5" 
        onClick={() => toggleNote(note.id)}
      >
        <motion.div 
          animate={{ rotate: note.expanded ? 90 : 0 }}
          transition={{ duration: 0.2, ease: [0.3, 1.1, 0.3, 0.9] }}
          className="w-5 h-5 flex items-center justify-center text-white/50 group-hover:text-white/70"
        >
          <ChevronRight size={16} />
        </motion.div>
        <h3 className={`text-sm font-normal ml-2 ${note.expanded ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
          {note.title}
        </h3>
      </div>
      
      <AnimatePresence initial={false}>
        {note.expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -5 }}
            transition={{ 
              height: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
              opacity: { duration: 0.25, ease: "easeInOut" },
              y: { duration: 0.25, ease: "easeOut" }
            }}
            className="overflow-hidden"
          >
            <div className="pl-7 pr-3 py-1 text-white/70 text-sm max-h-60 overflow-y-auto scrollbar-hide">
              {note.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="h-full w-full p-4" onClick={(e) => e.stopPropagation()}>
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="space-y-6">
          {/* Recent notes section */}
          {recentNotes.length > 0 && (
            <div>
              <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 pl-2">
                Previous 7 days
              </h2>
              <div className="space-y-2">
                {recentNotes.map(renderNote)}
              </div>
            </div>
          )}

          {/* Older notes section */}
          {olderNotes.length > 0 && (
            <div>
              <h2 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2 pl-2">
                Previous 30 days
              </h2>
              <div className="space-y-2">
                {olderNotes.map(renderNote)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};