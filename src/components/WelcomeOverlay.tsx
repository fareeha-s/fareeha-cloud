import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, StickyNote } from 'lucide-react';
import { createTactileEffect } from '../App';
import { NoteItem } from '../data/notes';

interface WelcomeOverlayProps {
  note: NoteItem;
  visible: boolean;
  onClose: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ note, visible, onClose }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="relative w-full max-w-2xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button 
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => {
                onClose();
                createTactileEffect();
              }}
            >
              <X size={24} />
            </button>
            
            <div className="mb-4 flex items-center">
              <div className="mr-3 p-2 bg-zinc-800 rounded-lg">
                <StickyNote size={20} className="text-white/80" />
              </div>
              <h2 className="text-xl font-medium text-white">Welcome to Fareeha's Cloud</h2>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-white/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors"
                onClick={() => {
                  onClose();
                  createTactileEffect();
                }}
              >
                Continue to Site
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay;
