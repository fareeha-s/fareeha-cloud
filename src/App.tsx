import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion, PanInfo } from 'framer-motion';
import { AppIcon } from './components/AppIcon';
import { NotesScreen } from './screens/NotesScreen';
import { SocialsScreen } from './screens/SocialsScreen';
import { EventScreen } from './screens/EventScreen';
import type { AppIcon as AppIconType } from './types';
import { Music, ChevronLeft, ChevronRight } from 'lucide-react';

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

// Function to create floating particles
const createParticles = (containerEl: HTMLElement | null, count: number = 15) => {
  if (!containerEl || typeof document === 'undefined') return;
  
  // Clear any existing particles
  const existingParticles = containerEl.querySelectorAll('.magic-particle');
  existingParticles.forEach(p => p.remove());
  
  // Create new particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'magic-particle absolute rounded-full pointer-events-none';
    
    // Randomize properties
    const size = Math.random() * 4 + 1; // 1-5px
    const xPos = Math.random() * 100; // 0-100%
    const yPos = Math.random() * 100; // 0-100%
    const opacity = Math.random() * 0.2 + 0.1; // 0.1-0.3
    const delay = Math.random() * 10; // 0-10s
    const duration = Math.random() * 10 + 15; // 15-25s
    
    // Apply styles - simplified for Safari compatibility
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${xPos}%;
      top: ${yPos}%;
      opacity: ${opacity * 0.3}; /* Reduced opacity */
      background-color: rgba(255, 255, 255, 0.6);
      box-shadow: 0 0 ${size/2}px ${size / 4}px rgba(255, 255, 255, 0.1);
      animation-name: safari-particle-${Math.floor(Math.random() * 3)};
      animation-duration: ${duration * 1.5}s; /* Slower animation */
      animation-delay: ${delay}s;
      animation-iteration-count: infinite;
      animation-direction: alternate;
      animation-timing-function: ease-in-out;
    `;
    
    containerEl.appendChild(particle);
  }
};

function App() {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const appsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [appPosition, setAppPosition] = useState<AnimationPosition | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAppElement, setCurrentAppElement] = useState<HTMLElement | null>(null);
  const [windowHeight, setWindowHeight] = useState('100vh');
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [isParticlesAdded, setIsParticlesAdded] = useState(false);
  
  // Initialize particles with simpler approach
  useEffect(() => {
    if (fullyLoaded && !prefersReducedMotion && !isParticlesAdded) {
      // Small delay to ensure the container is rendered
      const timer = setTimeout(() => {
        createParticles(particlesContainerRef.current, 10); // Reduced count for better performance
        setIsParticlesAdded(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [fullyLoaded, prefersReducedMotion, isParticlesAdded]);
  
  // Set body to prevent scrolling and get actual window height
  useEffect(() => {
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Set the actual window height for mobile browsers where 100vh can be inconsistent
    const setHeight = () => {
      const vh = window.innerHeight;
      setWindowHeight(`${vh}px`);
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
      
      // Add additional handling for mobile devices to ensure full height
      document.body.style.height = `${vh}px`;
      document.documentElement.style.height = `${vh}px`;
    };
    
    // Set initial height
    setHeight();
    
    // Detect Apple devices
    const userAgent = navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh/.test(userAgent);
    setIsAppleDevice(isApple);
    
    // Update on resize
    window.addEventListener('resize', setHeight);
    window.addEventListener('orientationchange', setHeight);
    
    // Additional event for mobile browsers
    window.addEventListener('touchmove', () => setHeight(), { passive: true });
    
    // Set loaded state after a short delay to coordinate with CSS transitions
    const initialTimer = setTimeout(() => {
      setIsLoaded(true);
      // Set fully loaded after the main transitions complete
      const fullLoadTimer = setTimeout(() => {
        setFullyLoaded(true);
        // Force recompute height to ensure proper display
        setHeight();
      }, 1200);
      return () => clearTimeout(fullLoadTimer);
    }, 500);
    
    return () => {
      window.removeEventListener('resize', setHeight);
      window.removeEventListener('orientationchange', setHeight);
      window.removeEventListener('touchmove', () => setHeight());
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      clearTimeout(initialTimer);
    };
  }, []);
  
  // Inject critical styles for proper mobile rendering
  useEffect(() => {
    // Create and inject critical styles to ensure proper rendering on mobile
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Force hardware acceleration */
      .will-change-transform {
        will-change: transform;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
      
      /* Ensure full height on mobile devices */
      html, body, #root {
        height: 100% !important;
        height: -webkit-fill-available !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        position: fixed !important;
        overflow: hidden !important;
      }
      
      /* Fix for mobile browsers and notches */
      @supports (-webkit-touch-callout: none) {
        .h-screen, #root, body, html {
          height: -webkit-fill-available !important;
        }
      }
      
      /* Force entire page container */
      #root {
        position: fixed !important;
        inset: 0 !important;
        overflow: hidden !important;
      }
      
      /* Viewport height fix for mobile browsers */
      @media screen and (max-width: 768px) {
        body, html, #root, .h-screen {
          height: 100% !important;
          min-height: 100% !important;
          max-height: 100% !important;
        }
      }
      
      /* Safari-compatible particle animations - predefined to avoid dynamic values */
      @keyframes safari-particle-0 {
        0% { transform: translate(0, 0) scale(1); opacity: 0.05; }
        100% { transform: translate(5px, 3px) scale(0.9); opacity: 0.08; }
      }
      
      @keyframes safari-particle-1 {
        0% { transform: translate(0, 0) scale(1); opacity: 0.03; }
        100% { transform: translate(-4px, 5px) scale(0.95); opacity: 0.06; }
      }
      
      @keyframes safari-particle-2 {
        0% { transform: translate(0, 0) scale(1); opacity: 0.04; }
        100% { transform: translate(2px, -5px) scale(0.92); opacity: 0.07; }
      }
      
      /* Magic stars effect */
      .magic-star {
        position: absolute;
        background-color: white;
        width: 1px;
        height: 1px;
        border-radius: 50%;
        opacity: 0;
        animation: twinkle-safari 4s ease-in-out infinite;
      }
      
      @keyframes twinkle-safari {
        0% { opacity: 0; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(1.1); }
        100% { opacity: 0; transform: scale(1); }
      }
      
      /* Ambient light glow - simplified for Safari */
      .ambient-glow {
        position: absolute;
        border-radius: 100%;
        background-color: rgba(255, 255, 255, 0.05);
        mix-blend-mode: screen;
        pointer-events: none;
        z-index: 1;
      }
      
      /* Keyframe animations for blur and background */
      @keyframes app-container-blur {
        0% { backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
        20% { backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
        40% { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
        60% { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        80% { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        100% { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
      }
      
      @keyframes app-container-blur-active {
        0% { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
        100% { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      }
      
      @keyframes app-container-bg-fade {
        0% { background-color: rgba(0, 0, 0, 0.02); }
        25% { background-color: rgba(0, 0, 0, 0.05); }
        50% { background-color: rgba(0, 0, 0, 0.08); }
        75% { background-color: rgba(0, 0, 0, 0.12); }
        100% { background-color: rgba(0, 0, 0, 0.15); }
      }
      
      @keyframes app-container-bg-active {
        0% { background-color: rgba(0, 0, 0, 0.15); }
        100% { background-color: rgba(0, 0, 0, 0.3); }
      }
      
      /* Animation classes */
      .app-container-blur-animation {
        animation: app-container-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .app-container-blur-active-animation {
        animation: app-container-blur-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-blur-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .app-container-bg-animation {
        animation: app-container-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .app-container-bg-active-animation {
        animation: app-container-bg-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: app-container-bg-active 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      /* Music widget animations */
      @keyframes music-widget-blur {
        0% { backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
        50% { backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
        100% { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
      }
      
      @keyframes music-widget-bg-fade {
        0% { background-color: rgba(255, 255, 255, 0.05); }
        50% { background-color: rgba(255, 255, 255, 0.08); }
        100% { background-color: rgba(255, 255, 255, 0.12); }
      }
      
      .music-widget-blur-animation {
        animation: music-widget-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: music-widget-blur 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      
      .music-widget-bg-animation {
        animation: music-widget-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        -webkit-animation: music-widget-bg-fade 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // For icon masking/cloning during animation
  const [clonedAppIcon, setClonedAppIcon] = useState<{
    app: AppIconType | null;
    rect: DOMRect | null;
  }>({
    app: null,
    rect: null
  });

  const apps: AppIconType[] = [
    { id: 'notes', name: 'notes', icon: 'StickyNote', color: '', component: NotesScreen },
    { id: 'socials', name: 'socials', icon: 'AtSign', color: '', component: SocialsScreen },
    { id: 'partiful', name: 'partiful', icon: 'Partiful', color: '', component: EventScreen },
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
  
  // Special transition for the taller partiful container
  const partifulOpeningTransition = {
    type: "spring",
    stiffness: 300,
    damping: 40,
    mass: 1.3,
    duration: 0.4
  };

  // Handle navigation between apps
  const navigateToNextApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimating || !activeApp) return;
    
    const currentIndex = apps.findIndex(app => app.id === activeApp);
    const nextIndex = (currentIndex + 1) % apps.length;
    
    // Close current app and open the next one
    handleClose();
    setTimeout(() => {
      handleAppClick(apps[nextIndex].id);
    }, 300); // Wait for the close animation to finish
  };
  
  const navigateToPrevApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnimating || !activeApp) return;
    
    const currentIndex = apps.findIndex(app => app.id === activeApp);
    const prevIndex = (currentIndex - 1 + apps.length) % apps.length;
    
    // Close current app and open the previous one
    handleClose();
    setTimeout(() => {
      handleAppClick(apps[prevIndex].id);
    }, 300); // Wait for the close animation to finish
  };

  // Handle back swipe gesture
  const handleSwipeGesture = (info: PanInfo) => {
    // Only go back if swiping right (positive x) with enough force
    if (activeApp && !isAnimating && info.offset.x > 100) {
      handleClose();
    }
  };

  return (
    <motion.div 
      className="h-screen w-screen fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{
        height: windowHeight,
        width: '100%',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={activeApp && !isAnimating ? handleClose : undefined}
      drag={!!activeApp && !isAnimating}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      dragMomentum={true}
      onDragEnd={(e, info) => handleSwipeGesture(info)}
    >
      {/* Background Wrapper - Ensures full coverage */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Soft blur orbs */}
        <div 
          className="absolute top-[-25vh] right-[10vw] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-r from-[#88a5a3] to-[#b3c1bd] blur-[140px] will-change-transform" 
          style={{ 
            transform: 'translateZ(0)', 
            WebkitTransform: 'translateZ(0)',
            opacity: isLoaded ? 0.38 : 0,
            transition: 'opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
        <div 
          className="absolute bottom-[-20vh] left-[-5vw] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#bad0c5] to-[#98aeae] blur-[120px] will-change-transform" 
          style={{ 
            transform: 'translateZ(0)', 
            WebkitTransform: 'translateZ(0)',
            opacity: isLoaded ? 0.3 : 0,
            transition: 'opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
        
        {/* Simplified gradient overlays - more Safari friendly */}
        <div 
          className="absolute top-[20vh] left-[10vw] w-[35vw] h-[35vw] rounded-full bg-[#a0d8ef]/10 blur-[100px]" 
          style={{ 
            opacity: isLoaded ? 0.25 : 0,
            transition: 'opacity 2.5s ease'
          }}
        ></div>
        <div 
          className="absolute bottom-[25vh] right-[5vw] w-[30vw] h-[30vw] rounded-full bg-[#d4a5e5]/10 blur-[80px]" 
          style={{ 
            opacity: isLoaded ? 0.2 : 0,
            transition: 'opacity 2.5s ease'
          }}
        ></div>
        
        {/* Safari-friendly magic stars (static positioned) - but fewer and more subtle */}
        {isLoaded && Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={`star-${i}`}
            className="magic-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              animationDelay: `${Math.random() * 10}s`, // More spread out timing
              boxShadow: `0 0 ${Math.random() * 1.5 + 1}px ${Math.random() * 0.5 + 0.5}px rgba(255,255,255,0.4)`
            }}
          />
        ))}
        
        {/* Subtle grid overlay for depth - extends to all edges */}
        <div 
          className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA0KSIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMwek0wIDMwaDMwdjMwSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')]" 
          style={{
            opacity: isLoaded ? 0.12 : 0,
            transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
        
        {/* Additional subtle top gradient to enhance the Dynamic Island effect */}
        <div 
          className="absolute top-0 left-0 right-0 h-[15vh] bg-gradient-to-b from-[#0a0c10]/40 to-transparent" 
          style={{ 
            opacity: isLoaded ? 0.4 : 0,
            transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        ></div>
        
        {/* Particles container */}
        <div 
          ref={particlesContainerRef}
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
        ></div>
      </div>

      <div 
        className="relative flex flex-col items-center will-change-transform z-10"
        ref={mainContainerRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          WebkitTransform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          transition: "opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1), transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)"
        }}
      >
        {/* App name with back button - consistently displayed outside the container */}
        <div 
          className="absolute top-[-40px] w-full flex justify-center items-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? '0' : '-10px'})`,
            transition: "opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.2s"
          }}
        >
          {activeApp ? (
            <>
              {/* Back button + app name for active apps */}
              <motion.div 
                className="absolute left-0 ml-1 cursor-pointer"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.2 }}
                onClick={!isAnimating ? handleClose : undefined}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={20} className="text-white" strokeWidth={1.5} />
              </motion.div>
              <h2 className="text-xl text-white font-medium tracking-wide text-center text-shadow-sm">
                {activeAppName}
        </h2>
            </>
          ) : (
            /* Home screen title with enhanced styling */
            <motion.h2 
              className="text-3xl text-white font-medium tracking-wide text-center relative z-30"
              initial={{ y: 0 }}
              animate={{ y: 0 }}
              style={{ 
                position: 'relative',
                textShadow: '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.25))',
                marginBottom: '-15px',
                transform: 'translateY(-10px)',
                zIndex: 30
              }}
            >
              fareeha's cloud
            </motion.h2>
          )}
        </div>

        {/* Main container - with iOS style blur effect */}
        <motion.div 
          className={`${activeApp === 'partiful' ? 'w-[290px] aspect-auto h-[420px]' : 'w-[290px] aspect-square'} rounded-[24px] overflow-hidden shadow-xl relative z-20 will-change-transform ${
            isLoaded ? (activeApp ? 'app-container-blur-animation app-container-bg-animation app-container-blur-active-animation app-container-bg-active-animation' : 'app-container-blur-animation app-container-bg-animation') : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (activeApp && !isAnimating) handleClose();
          }}
          style={{
            boxShadow: activeApp && activeApp !== 'socials' ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            backgroundColor: activeApp === 'socials' ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
            backdropFilter: activeApp === 'socials' ? 'none' : 'blur(0px)',
            WebkitBackdropFilter: activeApp === 'socials' ? 'none' : 'blur(0px)',
            border: activeApp === 'socials' ? 'none' : activeApp ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            opacity: activeApp === 'socials' ? 0 : activeApp ? 1 : 1
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
            <div className="h-full flex flex-col pt-5 px-5 pb-5 will-change-transform" style={{ opacity: 1.1 }}>
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
                className={`w-full mt-auto rounded-[16px] overflow-hidden shadow-sm mb-1 will-change-transform ${isLoaded ? 'music-widget-blur-animation music-widget-bg-animation' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(0px)',
                  WebkitBackdropFilter: 'blur(0px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '14px',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)'
                }}
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
                  <p className="text-[13px] text-white font-medium truncate">canada</p>
                  <p className="text-[11px] text-white/90 font-light truncate">wallows</p>
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
                height: clonedAppIcon.app?.id === 'partiful' ? '420px' : '100%',
                x: 0,
                y: 0,
                borderRadius: 24,
              }}
              transition={clonedAppIcon.app?.id === 'partiful' 
                ? { type: "spring", stiffness: 300, damping: 40, mass: 1.3, duration: 0.4 } 
                : appOpeningTransition}
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
                  {clonedAppIcon.app.icon === 'Partiful' ? (
                    <img src="/icons/partiful.png" alt="Partiful" className="w-6 h-6" />
                  ) : (
                    <AppIcon
                      icon={clonedAppIcon.app.icon}
                      name=""
                      color={clonedAppIcon.app.color}
                      onClick={() => {}}
                      showLabel={false}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* App Content Layer - For non-socials apps */}
          {activeApp && ActiveComponent && activeApp !== 'socials' && (
            <div 
              className="absolute inset-0 z-30 overflow-hidden flex items-center justify-center"
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

        {/* Socials Content Layer - Outside the container for cleaner look */}
        {activeApp === 'socials' && ActiveComponent && (
          <motion.div 
            className="absolute w-[290px] aspect-square z-30 overflow-hidden flex items-center justify-center"
            style={{ 
              opacity: 1,
              transition: 'opacity 0.15s ease-in',
              transitionDelay: '0.1s'
            }}
          >
            <ActiveComponent />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default App;