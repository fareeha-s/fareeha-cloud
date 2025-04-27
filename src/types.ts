export interface AppIcon {
  id: string;
  name: string;
  icon: string;
  color: string;
  component: React.FC<AppScreenProps>;
}

import React, { SetStateAction, Dispatch } from 'react';

// Common props for screens that are opened like apps
export interface AppScreenProps {
  onClose?: () => void;
  onNavigate?: (target: string, options?: { noteId?: number; eventId?: number }) => void;
  initialNoteId?: number | null; // Optional: If opening directly to a specific note
  initialEventId?: number | null; // Optional: If opening directly to a specific event
  isNoteDetailView?: boolean; // Optional: Passed from App for NotesScreen
  setIsNoteDetailView?: Dispatch<SetStateAction<boolean>>; // Optional: Passed from App for NotesScreen
  isEventDetailView?: boolean; // Optional: Passed from App for EventScreen
  setIsEventDetailView?: Dispatch<SetStateAction<boolean>>; // Optional: Passed from App for EventScreen
  initialPosition?: { x: number; y: number; width: number; height: number };
}

// Add initialNoteId to the Window interface
declare global {
  interface Window {
    initialNoteId?: number;
    initialEventId?: number;
    isViewingEventDetail?: boolean;
    isViewingNoteDetail?: boolean;
    openNoteWithId?: (noteId: number) => void;
    handleVideoLink?: (videoUrl: string) => void;
    handleAppClick?: (appId: string) => void;
    noteScreenBackHandler?: () => boolean;
    eventScreenBackHandler?: () => boolean;
  }
}