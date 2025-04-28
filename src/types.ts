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
  onNavigate?: (appId: string) => void;
  // Add initialNoteId prop for direct note opening
  initialNoteId?: number | null;
  // Prop for passing the initial event ID to the EventScreen
  initialEventId?: number | null;
  isNoteDetailView?: boolean; 
  setIsNoteDetailView?: Dispatch<SetStateAction<boolean>>; 
  isEventDetailView?: boolean; 
  setIsEventDetailView?: Dispatch<SetStateAction<boolean>>; 
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