// Global type declarations for the application

// Extend the Window interface to include our custom properties
interface Window {
  // Note handling
  initialNoteId?: number;
  openNoteDirectly?: boolean;
  openNoteWithId?: (noteId: number) => void;
  noteScreenBackHandler?: () => boolean;
  isViewingNoteDetail?: boolean;
  goToHomeFromHelloWorld?: boolean;
  isFirstTimeOpeningApp?: boolean;
  widgetNoteId?: number;
  
  // Event handling
  initialEventId?: number;
  openEventWithId?: (eventId: number) => void;
  eventScreenBackHandler?: () => boolean;
  isViewingEventDetail?: boolean;
  
  // App navigation
  handleAppClick?: (appId: string) => void;
  
  // Video handling
  handleVideoLink?: (url: string) => void;
}
