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
    
    // Check if there's a specific screen back handler active
    // This allows screens like NotesScreen to handle internal navigation
    if (activeApp === 'notes' && window.noteScreenBackHandler && window.noteScreenBackHandler()) {
      return; // If the screen handler returns true, it handled the back action
    }
    
    // Check for event screen handler (partiful)
    if (activeApp === 'partiful' && window.eventScreenBackHandler && window.eventScreenBackHandler()) {
      return; // If the event screen handler returns true, it handled the back action
    }
    
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
  const navigateToNextApp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isAnimating || !activeApp) return;
    
    const currentIndex = apps.findIndex(app => app.id === activeApp);
    const nextIndex = (currentIndex + 1) % apps.length;
    
    // Close current app and open the next one
    handleClose();
    setTimeout(() => {
      handleAppClick(apps[nextIndex].id);
    }, 300); // Wait for the close animation to finish
  };
  
  const navigateToPrevApp = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
    // Don't handle drag if the disable-app-drag class is present
    if (document.body.classList.contains('disable-app-drag')) return;
    
    // Only go back if swiping right (positive x) with enough force
    if (activeApp && !isAnimating && info.offset.x > 100) {
      handleClose();
    }
  };

  // Check if app dragging should be disabled
  const shouldDisableDrag = () => {
    return document.body.classList.contains('disable-app-drag');
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
      drag={!!activeApp && !isAnimating && !shouldDisableDrag()}
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
        className="absolute flex flex-col items-center will-change-transform z-10"
        ref={mainContainerRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          WebkitTransform: `translateY(${isLoaded ? '0' : '10px'}) translateZ(0)`,
          transition: "opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1), transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
          top: '50%',
          left: '50%',
          marginLeft: '-145px', // Half of the container width (290px/2)
          marginTop: '-145px', // Half of the container height for square aspect
        }}
      >
        {/* App name above the container - returning to original position */}
        <div 
          className="absolute top-[-60px] w-full flex justify-center items-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? '0' : '-10px'})`,
            transition: "opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.2s",
            height: "60px",
            pointerEvents: "none"
          }}
        >
          {activeApp ? (
            <h2 className="text-xl text-white font-medium tracking-wide text-center text-shadow-sm">
              {activeAppName}
            </h2>
          ) : (
            /* Home screen title with enhanced styling */
            <motion.h2 
              className="text-2xl text-white font-medium tracking-wide text-right relative z-30 pointer-events-auto"
              initial={{ y: 0 }}
              animate={{ 
                y: [0, 12, 0],
                opacity: [1, 0.92, 1],
                transition: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 5,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }
              }}
              style={{ 
                position: 'absolute',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.1))',
                bottom: '0',
                zIndex: 30,
                letterSpacing: '0.02em',
                right: '0'
              }}
            >
              <span className="relative inline-block">
                hi, it's fareeha 🫶
                <motion.span 
                  className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent to-white/5 opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                      repeatType: "reverse",
                      delay: 0.5
                    }
                  }}
                />
              </span>
            </motion.h2>
          )}
        </div>
        
        {/* Main container - with glass solid effect instead of blur */}
        <motion.div 
          className={`w-[290px] aspect-square rounded-[24px] overflow-hidden shadow-xl relative z-20 will-change-transform glass-solid ${
            activeApp ? 'glass-solid-shine' : ''
          } ${
            activeApp === 'notes' ? 'glass-solid-orange' : 
            activeApp === 'socials' ? 'glass-solid-blue' : 
            activeApp === 'partiful' ? 'glass-solid-purple' : 
            activeApp === 'spotify' ? 'glass-solid-green' : ''
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (activeApp && !isAnimating) handleClose();
          }}
          style={{
            boxShadow: activeApp && activeApp !== 'socials' ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(255, 255, 255, 0.15) inset' : '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(255, 255, 255, 0.12) inset',
            backgroundColor: activeApp === 'socials' ? undefined : undefined,
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            opacity: 1
          }}
        >
          {/* Light reflection effects */}
          <div 
            className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] opacity-[0.06] rounded-full z-10 pointer-events-none" 
            style={{
              background: activeApp === 'notes' ? "radial-gradient(circle, rgba(255, 127, 80, 0.4) 0%, rgba(255, 127, 80, 0) 70%)" :
                         activeApp === 'socials' ? "radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, rgba(244, 114, 182, 0) 70%)" :
                         activeApp === 'partiful' ? "radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, rgba(124, 58, 237, 0) 70%)" :
                         "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
              transform: "rotate(-15deg)"
            }}
          />
          <div 
            className="absolute bottom-[5%] right-[5%] w-[30%] h-[30%] opacity-[0.05] rounded-full z-10 pointer-events-none" 
            style={{
              background: activeApp === 'notes' ? "radial-gradient(circle, rgba(255, 127, 80, 0.5) 0%, rgba(255, 127, 80, 0) 70%)" :
                         activeApp === 'socials' ? "radial-gradient(circle, rgba(244, 114, 182, 0.5) 0%, rgba(244, 114, 182, 0) 70%)" :
                         activeApp === 'partiful' ? "radial-gradient(circle, rgba(124, 58, 237, 0.5) 0%, rgba(124, 58, 237, 0) 70%)" :
                         "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
              transform: "rotate(15deg)"
            }}
          />
          
          {/* Edge highlights - diagonal light streaks */}
          <div 
            className="absolute top-[-5%] left-[-20%] w-[40%] h-[10%] opacity-[0.04] z-10 pointer-events-none" 
            style={{
              background: activeApp === 'notes' ? "linear-gradient(45deg, rgba(255, 127, 80, 0.5) 0%, rgba(255, 127, 80, 0) 100%)" :
                         activeApp === 'socials' ? "linear-gradient(45deg, rgba(244, 114, 182, 0.5) 0%, rgba(244, 114, 182, 0) 100%)" :
                         activeApp === 'partiful' ? "linear-gradient(45deg, rgba(124, 58, 237, 0.5) 0%, rgba(124, 58, 237, 0) 100%)" :
                         "linear-gradient(45deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
              transform: "rotate(35deg)",
              borderRadius: "50%"
            }}
          />
          
          {/* Bottom edge highlight */}
          <div 
            className="absolute bottom-[0%] left-[10%] right-[10%] h-[5%] opacity-[0.04] z-10 pointer-events-none" 
            style={{
              background: activeApp === 'notes' ? "linear-gradient(to top, rgba(255, 127, 80, 0.5) 0%, rgba(255, 127, 80, 0) 100%)" :
                         activeApp === 'socials' ? "linear-gradient(to top, rgba(244, 114, 182, 0.5) 0%, rgba(244, 114, 182, 0) 100%)" :
                         activeApp === 'partiful' ? "linear-gradient(to top, rgba(124, 58, 237, 0.5) 0%, rgba(124, 58, 237, 0) 100%)" :
                         "linear-gradient(to top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: "50%",
              filter: "blur(2px)"
            }}
          />
          
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
                <div className="flex items-center mb-3">
                  <div className="w-11 h-11 rounded-md flex items-center justify-center mr-3 shadow-sm bg-black/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="black"/>
                      <path d="M16.7535 17.0767C16.4914 17.0767 16.2546 16.9954 15.9928 16.8328C14.7702 16.0949 13.3598 15.6682 11.9494 15.6682C11.0171 15.6682 10.0848 15.8308 9.17715 16.1359C9.07089 16.1767 8.96463 16.2175 8.85837 16.2175C8.43171 16.2175 8.10463 15.8715 8.10463 15.4449C8.10463 15.0996 8.31715 14.7944 8.66886 14.713C9.77927 14.3262 10.8897 14.1229 11.9747 14.1229C13.6382 14.1229 15.2763 14.6312 16.6867 15.5255C16.9738 15.7288 17.134 15.9728 17.134 16.3389C17.1088 16.7655 16.7535 17.0767 16.7535 17.0767Z" fill="white"/>
                      <path d="M18.0925 13.8799C17.7853 13.8799 17.5484 13.7579 17.3369 13.6359C15.809 12.7008 13.7928 12.1516 11.5194 12.1516C10.3838 12.1516 9.19817 12.2736 8.11237 12.5176C7.95298 12.5584 7.8214 12.5992 7.69097 12.5992C7.17671 12.5992 6.75006 12.1924 6.75006 11.6432C6.75006 11.1756 6.98789 10.8051 7.38854 10.6831C8.69097 10.3372 9.9934 10.1748 11.5002 10.1748C14.1446 10.1748 16.4978 10.7647 18.2925 11.9007C18.6173 12.0228 18.8097 12.3687 18.8097 12.7551C18.8097 13.3451 18.4329 13.8799 18.0925 13.8799Z" fill="white"/>
                      <path d="M19.5278 10.1338C19.2206 10.1338 19.0349 10.053 18.7278 9.89097C16.9135 8.87513 14.2944 8.28517 11.5349 8.28517C10.212 8.28517 8.90962 8.44756 7.66032 8.73315C7.53104 8.77396 7.42562 8.81478 7.29634 8.81478C6.6754 8.81478 6.19043 8.32967 6.19043 7.66052C6.19043 7.05975 6.52842 6.61546 6.99897 6.49388C8.46611 6.1283 10.001 5.94753 11.5552 5.94753C14.669 5.94753 17.6595 6.61546 19.8349 7.84515C20.2643 8.04673 20.4944 8.4096 20.4944 8.87513C20.4746 9.60347 20.0373 10.1338 19.5278 10.1338Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[12px] font-medium text-white">Spotify</h3>
                      <p className="text-[10px] text-white/60">1:48</p>
                    </div>
                    <p className="text-[10px] text-white/70 font-light">Recently Played</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] text-white font-medium truncate pr-2">Canada</p>
                    <p className="text-[10px] text-white/60 font-light whitespace-nowrap">Wallows</p>
                  </div>
                  <div className="w-full bg-white/20 h-[3px] rounded-full">
                    <div className="bg-white h-full rounded-full" style={{ width: '37%' }}></div>
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
                    <img src="/icons/apps/partiful.png" alt="Partiful" className="w-6 h-6" />
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
          
          {/* App Content Layer - For all apps */}
          {activeApp && ActiveComponent && (
            <div 
              className="absolute inset-0 z-30 overflow-hidden flex items-center justify-center"
              style={{ 
                opacity: activeApp ? 1 : 0,
                transition: 'opacity 0.15s ease-in',
                transitionDelay: '0.1s'
              }}
            >
              <AnimatePresence mode="wait">
                <ActiveComponent key={activeApp} />
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        
        {/* Navigation arrows - positioned absolutely to not affect container positioning */}
        {activeApp && (
          <div 
            className="absolute w-full mt-4 px-1"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
              pointerEvents: "auto",
              bottom: '-50px',
              right: '0',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            {/* Back button - always goes back to home - moved to right side for thumb navigation */}
            <motion.div 
              className="cursor-pointer"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.2 }}
              onClick={!isAnimating ? handleClose : undefined}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={28} className="text-white" strokeWidth={1.5} />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default App;