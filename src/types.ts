export interface AppIcon {
  id: string;
  name: string;
  icon: string;
  color: string;
  component: React.FC<AppScreenProps>;
}

export interface AppScreenProps {
  onClose?: () => void;
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