import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Utensils } from 'lucide-react';
import { EventItem } from '../data/events';

type PartifulEventProps = {
  onBack: () => void;
  eventData?: EventItem;
  onScrollToBottom?: () => void;
};

export const PartifulEvent: React.FC<PartifulEventProps> = ({ onBack, eventData, onScrollToBottom }) => {
  // State to track if user has scrolled
  const [hasScrolled, setHasScrolled] = useState(false);
  // State to track if additional content is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Default event data if none provided
  const eventTitle = eventData?.title || "mental static";
  const attendeeCount = eventData?.attendees || 35;
  const eventDate = eventData?.date || "31/03/25";
  const eventTime = eventData?.time || "7:30pm";
  const descriptionText = eventData?.description || `quick hits of obscure knowledge 💚

bring that random wikipedia rabbithole only you seem to know about. weird nature stuff, unsolved mysteries, watershed moments, conspiracy theories, crazy undercover govt ops, cool people etc etc 🌀🌀🌀

wiki page will go up on a projector. exactly two mins for you to brief us. +1 question from the rest of us

limited capacity! tell us what you'd share 🫶🏼`;
  const spotifyLink = eventData?.spotifyLink || "https://open.spotify.com/track/0LSLM0zuWRkEYemF7JcfEE?si=EhnHw1mWS1OOC9joykQgOA";
  const spotifyLyrics = eventData?.spotifyLyrics || "surf it scroll it pause it click it cross it crack it ssswitch update it";
  
  // Parse the date string (format: DD/MM/YY)
  const parseDateString = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(2000 + year, month - 1, day);
  };
  
  const eventDateTime = parseDateString(eventDate);
  
  // Format date for display
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(eventDateTime);
  
  // Add useEffect to handle sidebar visibility and scroll tracking
  useEffect(() => {
    // Add a class to the body to handle sidebar visibility
    document.body.classList.add('partiful-event-active');
    
    // Add scroll event listener
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        // Track if user has scrolled more than 50px
        if (scrollTop > 50) {
          setHasScrolled(true);
        }
        
        // Check if user has scrolled near the bottom (within 30px)
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 30;
        if (isAtBottom && onScrollToBottom) {
          onScrollToBottom();
        }
      }
    };
    
    // Add event listener to the container
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }
    
    // Also listen for window scroll (fallback)
    window.addEventListener('scroll', handleScroll);
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('partiful-event-active');
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollToBottom]);

  // Toggle expanded state
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  // Handle back button click
  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBack();
  };

  // Function to prevent any clicks from bubbling up but allow links to work
  const preventBubbling = (e: React.MouseEvent) => {
    // Skip if the target is an anchor tag or inside an anchor tag
    if ((e.target as HTMLElement).tagName === 'A' || 
        (e.target as HTMLElement).closest('a')) {
      return;
    }
    e.stopPropagation();
  };

  // Function to prevent touch events from bubbling up
  const preventTouchBubbling = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  // Host profile photos with smaller size to match screenshot
  const hostPhotos = eventData?.hosts || [
    { id: 1, image: '/icons/hosts/fareeha.jpg' },
    { id: 2, image: '/icons/hosts/1-b975ea56.jpg' },
    { id: 3, image: '/icons/hosts/2-b975ea56.jpg' },
  ];
  
  // Use the actual attendee count from the event data
  const approvedCount = eventData?.attendees || 12;
  const attendeePhotos = [
    { id: 1, image: 'https://i.pravatar.cc/100?img=1' },
    { id: 2, image: 'https://i.pravatar.cc/100?img=2' },
    { id: 3, image: 'https://i.pravatar.cc/100?img=3' },
    { id: 4, image: 'https://i.pravatar.cc/100?img=4' },
  ];
  
  // Function to handle external link clicks, prevents event propagation
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling up
    // Do not prevent default behavior so the link will work
  };
  
  // Animation variants for staggered text
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.02
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 30
      }
    }
  };

  // Variants for the expanded content animation
  const expandedContentVariants = {
    hidden: { 
      height: 0, 
      opacity: 0 
    },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        height: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3
        },
        opacity: {
          duration: 0.2,
          delay: 0.1
        }
      }
    }
  };

  // Variants for the arrow animation
  const arrowVariants = {
    initial: { 
      rotate: 0,
      y: [0, 3, 0],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut"
        }
      }
    },
    expanded: { 
      rotate: 180,
      y: 0,
      transition: {
        rotate: {
          type: "spring",
          stiffness: 300,
          damping: 25
        }
      }
    }
  };

  // First split by newlines to preserve them, then split each line by spaces
  const descriptionLines = descriptionText.split('\n').map(line => line.split(' '));
  
  // Flatten the array but keep track of line breaks
  const descriptionWords = descriptionLines.reduce((acc, line, lineIndex) => {
    if (lineIndex > 0) {
      acc.push('\n'); // Add line break between lines
    }
    return acc.concat(line);
  }, [] as string[]);
  
  // Function to render icon with text
  const renderIconWithText = (text: string) => {
    if (text.startsWith('👕')) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shirt size={16} color="white" />
          <span>{text.replace('👕', '').trim()}</span>
        </div>
      );
    } else if (text.startsWith('🍽️')) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Utensils size={16} color="white" />
          <span>{text.replace('🍽️', '').trim()}</span>
        </div>
      );
    }
    return text;
  };

  return (
    // Root container with height and width - capture and stop all events
    <div 
      className="h-full w-full flex flex-col" 
      onClick={preventBubbling}
      onMouseDown={preventBubbling}
      onTouchStart={preventTouchBubbling}
      onTouchMove={preventTouchBubbling}
      onTouchEnd={preventTouchBubbling}
      style={{ 
        touchAction: 'pan-y',
        backgroundColor: eventTitle === "strawberry hour" ? 'rgba(0, 32, 63, 0.5)' : 
                         eventTitle === "consumer social" ? 'rgba(10, 20, 40, 0.5)' : 
                         eventTitle === "Watercolour" ? 'rgba(147, 112, 142, 0.7)' :
                         eventTitle === "threading in" ? 'rgba(35, 25, 15, 0.5)' :
                         eventTitle === "out of office" ? 'rgba(144, 190, 109, 0.5)' :
                         eventTitle === "blood moon rising." ? 'rgba(20, 20, 20, 0.5)' :
                         eventTitle === "Scrumptious" ? 'rgba(77, 166, 255, 0.5)' :
                         'rgba(14, 43, 23, 0.5)', // Default color for mental static
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        overflow: 'hidden'
      }}
    >
      {/* Main content container - no drag or swipe functionality */}
      <motion.div 
        ref={containerRef}
        className="h-full w-full overflow-auto scrollbar-subtle relative"
        style={{ 
          fontFamily: 'var(--font-sans)',
          overscrollBehavior: 'contain', // Prevent pull-to-refresh and bounce effects
          maxHeight: '100%',  // Make sure content stays within the container height
          touchAction: 'pan-y', // Allow vertical scrolling only
          pointerEvents: 'auto', // Ensure the component captures all pointer events
          padding: '24px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        drag={false} // Explicitly disable drag on this component
      >
        {/* Header title without extra margin */}
        {eventTitle === "blood moon rising." || eventTitle === "consumer social" ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ 
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '12px'
            }}
            data-event-type={eventTitle === "blood moon rising." ? "blood-moon-rising" : "consumer-social"}
          >
            <h1 className={eventTitle === "blood moon rising." ? "blood-moon-title" : "blood-moon-title consumer-social-title"} id={eventTitle === "blood moon rising." ? "blood-moon-title" : "consumer-social-title"}>
              {eventTitle === "blood moon rising." ? "blood moon rising." : "consumer social."}
            </h1>
          </motion.div>
        ) : (
        <motion.h1 
          className="ptf-l-PKzNy ptf-l-kz-X6 cGVq-y" 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            fontSize: '28px', 
            fontFamily: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "Watercolour" || eventTitle === "Scrumptious" ? 'Freight Display Pro, Didot, "Bodoni MT", "Times New Roman", serif' : 'Grotesk, -apple-system, BlinkMacSystemFont, Arial, sans-serif',
            lineHeight: 1.1, 
            marginBottom: '12px', 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "Watercolour" || eventTitle === "Scrumptious" ? 500 : 600,
            letterSpacing: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "Watercolour" || eventTitle === "Scrumptious" ? '-0.03em' : '0.12em',
            paddingTop: '0px',
            textTransform: eventTitle === "strawberry hour" || eventTitle === "out of office" || eventTitle === "threading in" || eventTitle === "Watercolour" || eventTitle === "Scrumptious" ? 'none' : 'lowercase',
            fontStretch: '150%',
            fontStyle: 'normal',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <span className="summary" style={{ 
            fontStretch: 'expanded', 
            letterSpacing: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "Watercolour" || eventTitle === "Scrumptious" ? '-0.04em' : '0.08em' 
          }}>
            {eventTitle === "strawberry hour" ? "Strawberry hour." : 
             eventTitle === "threading in" ? "threading in" : 
             eventTitle === "consumer social" ? "consumer social." : 
             eventTitle === "Watercolour" ? "Watercolour." :
             eventTitle === "Scrumptious" ? "Scrumptious" : eventTitle}
          </span>
        </motion.h1>
        )}
        
        {/* Event image with square corners - expanded to match text width */}
        <motion.div 
          className="w-full flex justify-center mb-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full overflow-hidden">
            <picture>
              <source srcSet={eventData?.image?.webp || "./images/partiful/ms-giphy.webp"} type="image/webp" />
              <img 
                src={eventData?.image?.fallback || "./images/partiful/ms-fallback.jpg"} 
                alt={`${eventTitle} Event`} 
                className="w-full" 
                style={{ objectFit: 'cover', maxHeight: '280px' }}
              />
            </picture>
          </div>
        </motion.div>
        
        {/* Date info moved back outside the card container */}
        <motion.time 
          className="ptf-l-V4zs2 dtstart ptf-l-mXUGi" 
          dateTime="2025-03-31T07:30:00.000-07:00"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ptf-l-daxsj">
            <div>
              <div className="ptf-l-EDGV-" style={{ color: 'white', fontSize: '24px', fontWeight: 500, letterSpacing: '-0.01em' }}>{formattedDate}</div>
              <div className="ptf-l-y64FO" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', fontWeight: 425 }}>{eventTime}</div>
            </div>
          </div>
        </motion.time>
        
        {/* Host profiles section - even smaller sizes */}
        <motion.div 
          className="ptf-l-gFMtG" 
          style={{ marginBottom: '18px', marginTop: '2px', overflow: 'hidden' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ptf-l-V5l2c ptf-l-42Hmr ptf-l-vmns4" style={{ display: 'flex', alignItems: 'center', marginTop: '14px' }}>
            <span className="ptf--7nAv ptf-l-02UEs" style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M19 19H5M19 22H5M19 19V22M5 19V22" stroke="white" strokeWidth="1.5"/>
              </svg>
            </span>
            <span className="ptf-6n-N4 ptf-NNO7K ptf-l-tpQlB" style={{ color: 'white', fontSize: '14px', fontWeight: 400 }}>Hosted by</span>
            
            <div className="ptf-l-STiwz ptf-l-cXv5O" style={{ marginLeft: '6px', display: 'flex', overflow: 'hidden' }}>
              {hostPhotos.map((host, index) => (
                <div key={host.id} className="ptf-l-UZPE- ptf-l-QJYpB ptf-l-gEM83" style={{ marginRight: index === hostPhotos.length - 1 ? '0' : '0px' }}>
                  <div className="ptf-l-sb2bo">
                    <div className="ptf-l-gt1XK" style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', position: 'relative', pointerEvents: host.image.includes('fareeha') ? 'auto' : 'none' }}>
                      {host.image.includes('fareeha') ? (
                        <a 
                          href="https://partiful.com/u/AuiLl2hkaLeL1T2mjMyMomWhe092"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleExternalLinkClick}
                          style={{ 
                            display: 'block', 
                            width: '100%', 
                            height: '100%',
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: 10
                          }}
                        >
                          <img 
                            className="ptf-l-YHgvF" 
                            src={host.image} 
                            alt="Host" 
                            width="26" 
                            height="26"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                          <span className="ptf-l--7nAv ptf-l-WCCTT ptf-l-Wcrf2" style={{ position: 'absolute', bottom: '-1px', right: '-1px', color: '#5938e8', height: '10px', width: '10px' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="#5938e8" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" />
                            </svg>
                          </span>
                        </a>
                      ) : (
                        <>
                          <img 
                            className="ptf-l-YHgvF" 
                            src={host.image} 
                            alt="Host" 
                            width="26" 
                            height="26"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Music lyrics with Spotify link - smaller font */}
          {spotifyLyrics && (eventTitle !== "threading in" && eventTitle !== "Watercolour" && eventTitle !== "Scrumptious" && eventTitle !== "consumer social") && (
          <div className="ptf-l-V5l2c ptf-l-42Hmr" style={{ display: 'flex', alignItems: 'flex-start', marginTop: '8px', marginBottom: '14px' }}>
            <span className="ptf--7nAv ptf-l-02UEs ptf-l-Y-q9d" style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}>
              {eventTitle === "blood moon rising." ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.4545 13.5455C10.0455 13.9545 10.0455 14.5909 10.4545 15C10.8636 15.4091 11.5 15.4091 11.9091 15L14.5455 12.3636C15.3636 11.5455 15.3636 10.2273 14.5455 9.40909C13.7273 8.59091 12.4091 8.59091 11.5909 9.40909L8.59091 12.4091C7.36364 13.6364 7.36364 15.5909 8.59091 16.8182C9.81818 18.0455 11.7727 18.0455 13 16.8182L16 13.8182" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.5455 10.4545C13.9545 10.0455 14.5909 10.0455 15 10.4545C15.4091 10.8636 15.4091 11.5 15 11.9091L12.3636 14.5455C11.5455 15.3636 10.2273 15.3636 9.40909 14.5455C8.59091 13.7273 8.59091 12.4091 9.40909 11.5909L12.4091 8.59091C13.6364 7.36364 15.5909 7.36364 16.8182 8.59091C18.0455 9.81818 18.0455 11.7727 16.8182 13L13.8182 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : eventTitle === "out of office" ? (
                <Utensils size={16} color="white" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18V5L21 3V16" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
                </svg>
              )}
            </span>
            <a 
              href={spotifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ptf-l-5a8R- ptf-l-4Jj6a"
              style={{ color: '#E6F8C1', fontSize: '14px', fontWeight: 600 }}
              onClick={handleExternalLinkClick}
            >
              {spotifyLyrics}
            </a>
          </div>
          )}
          
          {/* Description text with staggered word animation */}
          <motion.div
            className="description-container"
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ 
              marginTop: spotifyLyrics && (eventTitle !== "threading in" && eventTitle !== "Watercolour" && eventTitle !== "Scrumptious" && eventTitle !== "consumer social") ? '0' : '20px', 
              marginBottom: '0' 
            }}
          >
            <div style={{ 
              fontSize: '14px',
              lineHeight: '22.4px',
              color: 'rgb(255, 255, 255)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontFamily: 'Lausanne, "Helvetica Neue", Helvetica, sans-serif',
              textRendering: 'optimizeSpeed',
              WebkitFontSmoothing: 'antialiased',
              isolation: 'isolate'
            }}>
              {descriptionText.split('\n').map((paragraph, index) => (
                <p key={index} style={{ margin: 0, display: 'block', marginTop: index > 0 ? '-8px' : '0' }}>
                  {renderIconWithText(paragraph)}
                </p>
              ))}
            </div>
        
            {/* Approved attendees section with profile circles and centered badge - moved inside description container */}
        <motion.div 
              className="ptf-l-gQnpk" 
          style={{ 
                margin: '0',
                marginTop: '12px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
                minHeight: '65px',  // Increased from 50px to give more space
                paddingBottom: '15px'  // Added padding at the bottom to ensure content doesn't cut off
          }}
          onClick={preventBubbling}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Profile circles row */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            paddingLeft: '0px',
            paddingRight: '12px'
          }}>
            {[...Array(8)].map((_, index) => {
              // Generate a colorScheme based on event ID for consistent but varied colors per event
              const colorSchemes = [
                // Blue-greens
                [
                  { bg: 'linear-gradient(135deg, #2C9292, #2196F3)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #41B3A3, #85CDCA)', pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #5CDB95, #379683)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #8EE4AF, #379683)', pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #05386B, #379683)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #3AAFA9, #2B7A78)', pattern: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #5CDB95, #05386B)', pattern: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #41B3A3, #2B7A78)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' }
                ],
                // Yellow-browns
                [
                  { bg: 'linear-gradient(135deg, #F9A826, #E76F51)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #E9C46A, #F4A261)', pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #E76F51, #D4A373)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FAEDCD, #D4A373)', pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #CCD5AE, #E9EDC9)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #F9A826, #CCD5AE)', pattern: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #E9C46A, #D4A373)', pattern: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #F4A261, #E76F51)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' }
                ],
                // Purples-pinks
                [
                    { bg: 'linear-gradient(135deg, #5871FF, #8257E5)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #8257E5, #FF7EB3)', pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #FF7EB3, #5CB6FF)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #5CB6FF, #9F7AEA)', pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #9F7AEA, #65D2FF)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #65D2FF, #8257E5)', pattern: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #8257E5, #5871FF)', pattern: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #5871FF, #FF7EB3)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' }
                ],
                // Reds-oranges
                [
                  { bg: 'linear-gradient(135deg, #FF6B6B, #FFB347)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FF8E71, #FF5E5B)', pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FF5E5B, #FFB347)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FFB347, #FF8E71)', pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FF6B6B, #FF9770)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FF9770, #FFB347)', pattern: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FFB347, #FF5E5B)', pattern: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FF5E5B, #FF6B6B)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' }
                ],
                // Greens-yellows
                [
                  { bg: 'linear-gradient(135deg, #ADCF9F, #CED89E)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #CED89E, #FBEAAB)', pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FBEAAB, #76BA99)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #76BA99, #3C8DAD)', pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #3C8DAD, #ADCF9F)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #ADCF9F, #FBEAAB)', pattern: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #FBEAAB, #3C8DAD)', pattern: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                  { bg: 'linear-gradient(135deg, #3C8DAD, #76BA99)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' }
                ]
              ];
              
              // Collection of accent/wildcard colors that can be inserted into any scheme
              const wildcardColors = [
                { bg: 'linear-gradient(135deg, #FF4D6D, #FF9D8D)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
                { bg: 'linear-gradient(135deg, #845EC2, #B39CD0)', pattern: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
                { bg: 'linear-gradient(135deg, #00C9A7, #1AC0C6)', pattern: 'radial-gradient(circle at 45% 45%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
                { bg: 'linear-gradient(135deg, #F39233, #FFBD69)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
                { bg: 'linear-gradient(135deg, #4D8076, #84A9AC)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
                { bg: 'linear-gradient(135deg, #3B429F, #3A8AC0)', pattern: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
                { bg: 'linear-gradient(135deg, #0D5C46, #329476)', pattern: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
                { bg: 'linear-gradient(135deg, #A12568, #FF7582)', pattern: 'radial-gradient(circle at 45% 45%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
              ];
              
              // Use the eventData.id to create a predictable but seemingly random scheme
              // This ensures the same event always gets the same color scheme
              const eventIdNum = eventData?.id ? parseInt(eventData.id.toString().slice(-1), 10) : 0;
              const schemeIndex = eventIdNum % colorSchemes.length;
              let colors = [...colorSchemes[schemeIndex]]; // Make a copy we can modify
              
              // Inject some randomness with wildcard circles
              // Use the event id and index to create a deterministic but seemingly random selection
              const shouldUseWildcard = (eventIdNum + index) % 3 === 0; // Every 3rd profile has a chance for a wildcard
              
              if (shouldUseWildcard) {
                // Use a combination of eventId and index to select a consistent wildcard
                const wildcardIndex = (eventIdNum + index) % wildcardColors.length;
                // Replace the current color with a wildcard color
                colors[index] = wildcardColors[wildcardIndex];
              }
              
              // Add some variation in gradient direction for more diversity
              const gradientDirections = ['135deg', '150deg', '120deg', '165deg', '105deg', '90deg'];
              const directionIndex = (eventIdNum + index) % gradientDirections.length;
              
              // Extract color values from the gradient for manipulation
              const bgGradient = colors[index].bg;
              const colorMatches = bgGradient.match(/linear-gradient\(\d+deg,\s*([^,]+),\s*([^)]+)\)/);
              
              if (colorMatches && colorMatches.length >= 3) {
                const color1 = colorMatches[1].trim();
                const color2 = colorMatches[2].trim();
                
                // Occasionally flip the gradient colors or adjust opacity for more variety
                const shouldFlip = (eventIdNum + index) % 5 === 0;
                const shouldAdjustOpacity = (eventIdNum + index + 1) % 4 === 0;
                
                if (shouldFlip) {
                  colors[index].bg = `linear-gradient(${gradientDirections[directionIndex]}, ${color2}, ${color1})`;
                } else if (shouldAdjustOpacity) {
                  // Make one color slightly transparent for more subtle gradients
                  const opacity = 0.8 + (index % 3) * 0.1; // Between 0.8 and 1.0
                  colors[index].bg = `linear-gradient(${gradientDirections[directionIndex]}, ${color1}, ${color2.replace(')', `, ${opacity})`).replace('rgb', 'rgba')}`;
                } else {
                  // Just change the direction
                  colors[index].bg = `linear-gradient(${gradientDirections[directionIndex]}, ${color1}, ${color2})`;
                }
              }
                  
                  // Add subtle animation delay based on index
                  const animationDelay = `${index * 0.1}s`;
                  
              return (
                    <motion.div 
                  key={index} 
                  style={{ 
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    position: 'relative',
                    marginLeft: index === 0 ? '0' : '-8px',
                    zIndex: 8 - index,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1)',
                        background: colors[index].bg,
                        opacity: 0.85,
                        overflow: 'hidden'
                      }}
                      initial={{ scale: 0.9, opacity: 0.7 }}
                      animate={{ 
                        scale: [0.9, 1.05, 1],
                        opacity: [0.7, 0.9, 0.85]
                      }}
                      transition={{ 
                        duration: 0.5, 
                        delay: parseFloat(animationDelay),
                        ease: "easeOut"
                      }}
                    >
                      {/* Pattern overlay - larger than the circle */}
                      <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: colors[index].pattern,
                        opacity: 0.7
                      }} />
                      
                      {/* Shine effect - larger than the circle */}
                      <div style={{
                        position: 'absolute',
                        top: '-150%',
                        left: '-150%',
                        width: '400%',
                        height: '400%',
                        background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        transform: 'rotate(45deg)',
                        animation: `shine 3s infinite ${animationDelay}`
                      }} />
                    </motion.div>
              );
            })}
          </div>

          {/* Centered approved count badge */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              borderRadius: '999px',
              fontSize: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 18px 7px',
              minWidth: '46px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
          >
            <div style={{ fontWeight: 500, lineHeight: 1.2 }}>{approvedCount}</div>
                <div style={{ fontSize: '11px', opacity: 1.0, marginTop: '0px', letterSpacing: '0.02em' }}>Approved</div>
          </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Indicator arrow for expanding content */}
        <motion.div 
          className="flex justify-center"
          onClick={toggleExpanded}
        >
        </motion.div>
      </motion.div>
    </div>
  );
}; 