import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, Shirt, Utensils } from 'lucide-react';
import { EventItem } from '../data/events';

type PartifulEventProps = {
  onBack: () => void;
  eventData?: EventItem;
};

export const PartifulEvent: React.FC<PartifulEventProps> = ({ onBack, eventData }) => {
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
      if (window.scrollY > 50 || (containerRef.current && containerRef.current.scrollTop > 50)) {
        setHasScrolled(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('partiful-event-active');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // Function to prevent any clicks from bubbling up
  const preventBubbling = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Function to prevent touch events from bubbling up
  const preventTouchBubbling = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  // Host profile photos with smaller size to match screenshot
  const hostPhotos = eventData?.hosts || [
    { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
    { id: 2, image: 'https://i.pravatar.cc/100?img=32' },
    { id: 3, image: 'https://i.pravatar.cc/100?img=33' },
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
        backgroundColor: eventTitle === "strawberry hour" ? 'rgba(0, 32, 63, 0.7)' : 
                         eventTitle === "consumer social" ? 'rgba(10, 20, 40, 0.7)' : 
                         eventTitle === "Watercolour" ? 'rgba(180, 175, 230, 0.7)' :
                         'rgba(14, 43, 23, 0.7)', // Navy blue for strawberry hour, consumer social, and light lavender for Watercolour
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
        <motion.h1 
          className="ptf-l-PKzNy ptf-l-kz-X6 cGVq-y" 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ 
            fontSize: '28px', 
            fontFamily: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "consumer social" || eventTitle === "Watercolour" ? 'Times New Roman, serif' : 'Grotesk, -apple-system, BlinkMacSystemFont, Arial, sans-serif',
            lineHeight: 1.1, 
            marginBottom: '12px', 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "consumer social" || eventTitle === "Watercolour" ? 700 : 600,
            letterSpacing: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "consumer social" || eventTitle === "Watercolour" ? '-0.03em' : '0.12em',
            paddingTop: '0px',
            textTransform: eventTitle === "strawberry hour" || eventTitle === "out of office" || eventTitle === "threading in" || eventTitle === "consumer social" || eventTitle === "Watercolour" ? 'none' : 'lowercase',
            fontStretch: '150%',
            fontStyle: 'normal',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <span className="summary" style={{ 
            fontStretch: 'expanded', 
            letterSpacing: eventTitle === "strawberry hour" || eventTitle === "threading in" || eventTitle === "consumer social" || eventTitle === "Watercolour" ? '-0.04em' : '0.08em' 
          }}>
            {eventTitle === "strawberry hour" ? "Strawberry hour." : 
             eventTitle === "threading in" ? "threading in" : 
             eventTitle === "consumer social" ? "consumer social." : 
             eventTitle === "Watercolour" ? "Watercolour." : eventTitle}
          </span>
        </motion.h1>
        
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
                <div key={host.id} className="ptf-l-UZPE- ptf-l-QJYpB ptf-l-gEM83" style={{ marginRight: index === hostPhotos.length - 1 ? '0' : '6px' }}>
                  <div className="ptf-l-sb2bo">
                    <div className="ptf-l-gt1XK" style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        className="ptf-l-YHgvF" 
                        src={host.image} 
                        alt="Host" 
                        width="26" 
                        height="26"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                      {index === 0 && (
                        <span className="ptf-l--7nAv ptf-l-WCCTT ptf-l-Wcrf2" style={{ position: 'absolute', bottom: '-1px', right: '-1px', color: '#5938e8', height: '10px', width: '10px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#5938e8" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Music lyrics with Spotify link - smaller font */}
          <div className="ptf-l-V5l2c ptf-l-42Hmr" style={{ display: 'flex', alignItems: 'flex-start', marginTop: '8px', marginBottom: '14px' }}>
            <span className="ptf--7nAv ptf-l-02UEs ptf-l-Y-q9d" style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18V5L21 3V16" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="6" cy="18" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="18" cy="16" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
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
          
          {/* Description text with staggered word animation */}
          <motion.div
            className="description-container"
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            style={{ marginTop: '0', marginBottom: '0' }}
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
                minHeight: '50px',  // Further reduced to minimize gap underneath
                paddingBottom: '0'
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
                  // Enhanced colors with gradients and patterns
              const colors = [
                    { bg: 'linear-gradient(135deg, #5871FF, #8257E5)', pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #8257E5, #FF7EB3)', pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #FF7EB3, #5CB6FF)', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #5CB6FF, #9F7AEA)', pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #9F7AEA, #65D2FF)', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #65D2FF, #8257E5)', pattern: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #8257E5, #5871FF)', pattern: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
                    { bg: 'linear-gradient(135deg, #5871FF, #FF7EB3)', pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' }
                  ];
                  
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