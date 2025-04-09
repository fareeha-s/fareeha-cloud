import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { AppScreenProps } from '../types';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { createTactileEffect } from '../App';

type Note = {
  id: number;
  title: string;
  content: string;
  expanded: boolean;
};

export const NotesScreen: React.FC<AppScreenProps> = () => {
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: 1, 
      title: "so, tell me about yourself...",
      content: "always such a loaded question why?",
      expanded: false
    },
    { 
      id: 2, 
      title: "social for longevity",
      content: "research shows that maintaining strong social connections contributes significantly to longer, healthier lives. regular social interactions can reduce stress, boost immune function, and provide emotional support.",
      expanded: false
    },
    { 
      id: 3, 
      title: "apples",
      content: "varieties to try: honeycrisp, pink lady, granny smith, fuji. remember to pick up some at the farmers market this weekend.",
      expanded: false
    }
  ]);
  
  const prefersReducedMotion = useReducedMotion();

  const toggleExpand = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, expanded: !note.expanded } : note
    ));

    // Use global tactile effect
    createTactileEffect();
  };

  // Apple-like spring animation
  const springTransition = {
    type: "spring",
    damping: 30,
    stiffness: 400,
    mass: 0.8,
  };

  return (
    <div className="h-full px-5 py-6" onClick={(e) => e.stopPropagation()}>
      <div className="h-full overflow-y-auto scrollbar-hide space-y-3 mt-2">
        {notes.map((note, index) => (
          <motion.div 
            key={note.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.03,
                duration: 0.2
              }
            }}
            className="border-b border-white/10"
          >
            <motion.div 
              className="py-3 flex items-center cursor-pointer will-change-transform"
              onClick={() => toggleExpand(note.id)}
              whileHover={{ paddingLeft: 4 }}
              whileTap={{ paddingLeft: 8 }}
              transition={{
                ...springTransition,
                duration: prefersReducedMotion ? 0 : undefined
              }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: note.expanded ? 90 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  duration: 0.2
                }}
                className="flex-shrink-0 mr-2"
              >
                {note.expanded ? 
                  <ChevronDown className="w-4 h-4 text-white/70" /> : 
                  <ChevronRight className="w-4 h-4 text-white/70" />
                }
              </motion.div>
              <h3 className="text-white text-sm font-normal">{note.title}</h3>
            </motion.div>
            
            <AnimatePresence initial={false}>
              {note.expanded && (
                <motion.div
                  key={`content-${note.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: 'auto', 
                    opacity: 1,
                    transition: { 
                      height: { type: "spring", stiffness: 500, damping: 30, duration: 0.2 },
                      opacity: { duration: 0.15, ease: [0, 0, 0.2, 1] }
                    } 
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0,
                    transition: { 
                      height: { type: "spring", stiffness: 500, damping: 30, duration: 0.15 },
                      opacity: { duration: 0.1, ease: [0.4, 0, 1, 1] }
                    } 
                  }}
                  className="pl-6 pr-1 py-3 overflow-hidden will-change-transform"
                >
                  <p className="text-white/90 text-sm">{note.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};