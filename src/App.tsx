import React, { useState, useRef, useLayoutEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AppIcon } from './components/AppIcon';
import { NotesScreen } from './screens/NotesScreen';
import { SocialsScreen } from './screens/SocialsScreen';
import { WorkScreen } from './screens/WorkScreen';
import type { AppIcon as AppIconType } from './types';
import { Music } from 'lucide-react';

// Global tactile effect function for better performance
export const createTactileEffect = () => {
  if (typeof window !== 'undefined') {
    // Check if an effect is already in progress
    if (document.querySelector('.tactile-effect')) return;
    
    requestAnimationFrame(() => {
      const element = document.createElement('div');
      element.className = 'fixed inset-0 bg-white/5 pointer-events-none z-50 tactile-effect';
      element.style.willChange = 'opacity';
      document.body.appendChild(element);
      
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Fade out smoothly
          element.style.transition = 'opacity 60ms ease';
          element.style.opacity = '0';
          
          setTimeout(() => {
            if (document.body.contains(element)) {
              document.body.removeChild(element);
            }
          }, 60);
        }, 20);
      });
    });
  }
};

// Animation coordinates for Apple-like expansion
interface AnimationPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const appsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [appPosition, setAppPosition] = useState<AnimationPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAppElement, setCurrentAppElement] = useState<HTMLElement | null>(null);
  
  // For icon masking/cloning during animation
  const [clonedAppIcon, setClonedAppIcon] = useState<{
    app: AppIconType | null;
    rect: DOMRect | null;
  }>({
    app: null,
    rect: null
  });

  const apps: AppIconType[] = [
    { id: 'notes', name: 'notes', icon: 'StickyNote', color: 'from-white/90 to-white/80', component: NotesScreen },
    { id: 'socials', name: 'socials', icon: 'AtSign', color: 'from-white/90 to-white/80', component: SocialsScreen },
    { id: 'partiful', name: 'partiful', icon: 'PartyPopper', color: 'from-white/90 to-white/80', component: WorkScreen },
  ];

  // Handle app closing with proper animation
  const handleClose = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Start closing animation
    setTimeout(() => {
      setActiveApp(null);
      setAppPosition(null);
      setClonedAppIcon({
        app: null,
        rect: null
      });
      // Reset animation state only after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 250);
    }, 50);
  };

  // True Apple-style app opening animation
  const handleAppClick = (appId: string) => {
    if (isAnimating) return;
    
    const appElement = appsRef.current.get(appId);
    const containerElement = mainContainerRef.current;
    
    if (!appElement || !containerElement) return;
    
    setIsAnimating(true);
    
    // Get app's absolute position
    const appRect = appElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();
    
    // Find the selected app
    const selectedApp = apps.find(app => app.id === appId) || null;
    
    // Store the app's position relative to the container
    setAppPosition({
      x: appRect.left - containerRect.left + (appRect.width / 2),
      y: appRect.top - containerRect.top + (appRect.height / 2),
      width: appRect.width,
      height: appRect.height
    });
    
    // Store a clone of the app icon for animation
    setClonedAppIcon({
      app: selectedApp,
      rect: appRect
    });
    
    // Set the current app element for scale calculations
    setCurrentAppElement(appElement);
    
    // Small delay to ensure animation settings are in place
    setTimeout(() => {
      setActiveApp(appId);
    }, 10);
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  const ActiveComponent = activeApp ? apps.find(app => app.id === activeApp)?.component : null;
  const activeAppName = activeApp ? apps.find(app => app.id === activeApp)?.name : null;
  
  // Apple-like spring animation for subtle movements
  const springTransition = {
    type: "spring",
    damping: 30,
    stiffness: 400,
    mass: 0.8,
  };
  
  // Precise iOS app opening animation timing
  const appOpeningTransition = {
    type: "spring",
    stiffness: 350,
    damping: 35,
    mass: 1.2,
    duration: 0.3
  };

  return (
    <div 
      className="min-h-screen p-8 relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={activeApp && !isAnimating ? handleClose : undefined}
    >
      {/* Soft blur orbs */}
      <div className="absolute top-[-15vh] right-[10vw] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#88a5a3] to-[#b3c1bd] opacity-40 blur-[120px]"></div>
      <div className="absolute bottom-[-10vh] left-[5vw] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-gradient-to-r from-[#bad0c5] to-[#98aeae] opacity-30 blur-[100px]"></div>
      
      {/* Subtle grid overlay for depth */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA0KSIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMwek0wIDMwaDMwdjMwSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-15"></div>

      <div 
        className="relative flex flex-col items-center will-change-transform"
        ref={mainContainerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* App name - consistently displayed outside the container */}
        <h2 className="text-xl text-white font-medium mb-5 tracking-wide text-center absolute top-[-40px] w-full text-shadow-sm">
          {!activeApp ? "fareeha's cloud ☁️" : activeAppName}
        </h2>

        {/* Main container - with iOS style blur effect */}
        <motion.div 
          className={`w-[290px] aspect-square rounded-[24px] overflow-hidden shadow-xl relative z-20 will-change-transform ${activeApp ? 'bg-black/35 backdrop-blur-2xl' : 'bg-black/25 backdrop-blur-md border border-white/20'}`}
          onClick={(e) => {
            e.stopPropagation();
            if (activeApp && !isAnimating) handleClose();
          }}
          style={{
            boxShadow: activeApp ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : '0 10px 15px -3px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Home Screen Layer - Always present */}
          <div 
            className={`absolute inset-0 z-10 ${activeApp ? 'pointer-events-none' : ''}`}
            style={{
              opacity: activeApp ? 0 : 1,
              transition: 'opacity 0.2s ease-out',
            }}
          >
            <div className="h-full flex flex-col pt-5 px-5 pb-5 will-change-transform">
              {/* App icons */}
              <div className="grid grid-cols-3 gap-y-5 gap-x-4 mb-6 mt-2">
                {apps.map((app) => (
                  <AppIcon
                    key={app.id}
                    icon={app.icon}
                    name={app.name}
                    color={app.color}
                    onClick={() => !isAnimating && handleAppClick(app.id)}
                    ref={(el) => {
                      if (el) appsRef.current.set(app.id, el);
                    }}
                    className={clonedAppIcon.app?.id === app.id && activeApp ? 'invisible' : ''}
                  />
                ))}
              </div>
              
              {/* Empty space to push widget down */}
              <div className="flex-grow"></div>
              
              {/* Music Widget */}
              <motion.div 
                className="w-full mt-auto rounded-[16px] bg-white/15 backdrop-blur-sm border border-white/20 p-3.5 shadow-sm mb-1 will-change-transform"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
              >
                <div className="flex items-center mb-2">
                  <div className="bg-[#8797a3]/80 w-9 h-9 rounded-full flex items-center justify-center mr-2.5">
                    <Music className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-normal text-white">now playing</h3>
                    <p className="text-[9px] text-white/80 font-light">music</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[13px] text-white font-medium truncate">lover</p>
                  <p className="text-[11px] text-white/90 font-light truncate">taylor swift</p>
                  <div className="w-full bg-white/30 h-1 rounded-full mt-2.5">
                    <div className="bg-white w-2/3 h-1 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Expanding App Icon Animation */}
          {appPosition && clonedAppIcon.app && !activeApp && (
            <motion.div
              className="absolute rounded-[12px] bg-black/35 backdrop-blur-2xl z-20 overflow-hidden"
              initial={{
                width: appPosition.width,
                height: appPosition.height,
                x: appPosition.x - appPosition.width/2,
                y: appPosition.y - appPosition.height/2,
                borderRadius: 12,
              }}
              animate={{
                width: '100%',
                height: '100%',
                x: 0,
                y: 0,
                borderRadius: 24,
              }}
              transition={appOpeningTransition}
            >
              {/* Icon in center during expansion */}
              <motion.div
                className="absolute flex items-center justify-center"
                initial={{
                  width: appPosition.width,
                  height: appPosition.height,
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ duration: 0.15, delay: 0.1 }}
              >
                <div className={`bg-gradient-to-br ${clonedAppIcon.app.color} h-full w-full rounded-[12px] flex items-center justify-center`}>
                  <AppIcon
                    icon={clonedAppIcon.app.icon}
                    name=""
                    color={clonedAppIcon.app.color}
                    onClick={() => {}}
                    showLabel={false}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* App Content Layer */}
          {activeApp && ActiveComponent && (
            <div 
              className="absolute inset-0 z-30"
              style={{ 
                opacity: activeApp ? 1 : 0,
                transition: 'opacity 0.15s ease-in',
                transitionDelay: '0.1s'
              }}
            >
              <ActiveComponent />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;