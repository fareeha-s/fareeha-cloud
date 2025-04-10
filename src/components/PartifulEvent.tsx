import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

type PartifulEventProps = {
  onBack: () => void;
};

export const PartifulEvent: React.FC<PartifulEventProps> = ({ onBack }) => {
  // State to track if user has scrolled
  const [hasScrolled, setHasScrolled] = useState(false);

  // Add useEffect to hide sidebar when component mounts
  useEffect(() => {
    // Add a class to the body to handle sidebar visibility
    document.body.classList.add('partiful-event-active');
    
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
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

  // Host profile photos with smaller size to match screenshot
  const hostPhotos = [
    { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
    { id: 2, image: 'https://i.pravatar.cc/100?img=32' },
    { id: 3, image: 'https://i.pravatar.cc/100?img=33' },
  ];
  
  // Approved attendees sample data - reduced to just 5 to prevent scrolling
  const approvedCount = 35;
  const attendeePhotos = [
    { id: 1, image: 'https://i.pravatar.cc/100?img=1' },
    { id: 2, image: 'https://i.pravatar.cc/100?img=2' },
    { id: 3, image: 'https://i.pravatar.cc/100?img=3' },
    { id: 4, image: 'https://i.pravatar.cc/100?img=4' },
  ];
  
  // Spotify link for Technologic by Daft Punk
  const spotifyLink = "https://open.spotify.com/track/0LSLM0zuWRkEYemF7JcfEE?si=EhnHw1mWS1OOC9joykQgOA";
  
  // Function to handle back click, prevents event propagation
  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling up
    onBack();
  };

  // Function to handle external link clicks, prevents event propagation
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from bubbling up
  };
  
  // Function to prevent any clicks from bubbling up
  const preventBubbling = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Split the description text into words for animation
  const descriptionText = `quick hits of obscure knowledge 💚

bring that random wikipedia rabbithole only you seem to know about. weird nature stuff, unsolved mysteries, watershed moments, conspiracy theories, crazy undercover govt ops, cool people etc etc 🌀🌀🌀

wiki page will go up on a projector. exactly two mins for you to brief us. +1 question from the rest of us

limited capacity! tell us what you'd share 🫶🏼`;

  const descriptionWords = descriptionText.split(' ');
  
  return (
    // Root container with height and width
    <div 
      className="h-full w-full" 
      onClick={preventBubbling}
    >
      <motion.div 
        className="h-full w-full overflow-auto scrollbar-subtle"
        style={{ 
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, "Inter", sans-serif',
          backgroundColor: '#0e2b17',
          borderRadius: '8px',
        }}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="x"
        dragConstraints={{ left: 0, right: 100 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x > 80) {
            onBack();
          }
        }}
      >
        {/* Back button for navigation */}
        <div className="flex items-center px-4 py-3 text-white/80">
          <button 
            className="flex items-center"
            onClick={handleBackClick}
          >
            <ChevronLeft size={16} className="mr-1" />
            <span className="text-xs">Events</span>
          </button>
        </div>
        
        {/* Main content section */}
        <section 
          className="px-3 py-1" 
          onClick={preventBubbling}
        >
          <div className="px-2 py-1">
            {/* Header title without extra margin */}
            <motion.h1 
              className="ptf-l-PKzNy ptf-l-kz-X6 cGVq-y" 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                fontSize: '28px', 
                fontFamily: 'Grotesk, -apple-system, BlinkMacSystemFont, Arial, sans-serif', 
                lineHeight: 1.1, 
                marginBottom: '12px', 
                color: 'white', 
                textAlign: 'center', 
                fontWeight: 600, 
                letterSpacing: '0.12em', 
                paddingTop: '0px',
                textTransform: 'lowercase',
                fontStretch: '150%',
                fontStyle: 'normal',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
            >
              <span className="summary" style={{ fontStretch: 'expanded', letterSpacing: '0.08em' }}>mental static</span>
            </motion.h1>
            
            {/* Event image with square corners - slightly smaller to fit more content */}
            <motion.div 
              className="w-full flex justify-center mb-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-full max-w-md h-[220px] overflow-hidden">
                <picture>
                  <source srcSet="/images/partiful/ms-giphy.webp" type="image/webp" />
                  <img 
                    src="/images/partiful/ms-fallback.jpg" 
                    alt="Mental Static Event" 
                    className="w-full h-full" 
                    style={{ objectFit: 'contain' }}
                  />
                </picture>
              </div>
            </motion.div>
            
            <div className="ptf-l-kmWBO _5zoT4j">
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
                    <div className="ptf-l-EDGV-" style={{ color: 'white', fontSize: '24px', fontWeight: 500 }}>Monday, Mar 31</div>
                    <div className="ptf-l-y64FO" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>7:30pm</div>
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
                      <div key={host.id} className="ptf-l-UZPE- ptf-l-QJYpB ptf-l-gEM83" style={{ cursor: 'pointer', marginRight: index === hostPhotos.length - 1 ? '0' : '6px' }}>
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
                <div className="ptf-l-V5l2c ptf-l-42Hmr" style={{ display: 'flex', alignItems: 'flex-start', marginTop: '14px' }}>
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
                    style={{ color: '#E6F8C1', fontSize: '14px', cursor: 'pointer' }}
                    onClick={handleExternalLinkClick}
                  >
                    surf it scroll it pause it click it cross it crack it ssswitch update it
                  </a>
                </div>
              </motion.div>
              
              {/* Description text with staggered word animation */}
              <motion.div
                className="description-container"
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {descriptionWords.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={wordVariants}
                    className="inline-block"
                    style={{ 
                      marginRight: word === '\n\n' ? 0 : '0.25em',
                      color: 'white', 
                      fontSize: '14px', 
                      fontWeight: 400,
                      whiteSpace: word.includes('\n') ? 'pre-line' : 'normal'
                    }}
                  >
                    {word.includes('\n') ? (
                      <React.Fragment>
                        <br /><br />
                      </React.Fragment>
                    ) : word === '🌀🌀🌀' ? (
                      <span style={{ color: '#5938e8' }}>🌀🌀🌀</span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </motion.div>
              
              {/* Approved attendees section - now with blurred photos and badge overlay */}
              <motion.div 
                className="ptf-l-gQnpk mt-5" 
                style={{ margin: '22px 0 10px', cursor: 'pointer', position: 'relative' }}
                onClick={preventBubbling}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Mysterious blurred attendee photos row */}
                <div className="flex items-center max-w-full overflow-hidden" style={{ height: '38px' }}>
                  {attendeePhotos.map((attendee, index) => (
                    <div 
                      key={attendee.id} 
                      style={{ 
                        marginRight: index === attendeePhotos.length - 1 ? '0' : '6px',
                        position: 'relative',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        opacity: 0.8,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div style={{ 
                        position: 'absolute', 
                        inset: 0,
                        backgroundColor: 'rgba(28, 50, 32, 0.25)',
                        zIndex: 2
                      }} />
                      <img 
                        src={attendee.image} 
                        alt="Mysterious Attendee" 
                        style={{ 
                          objectFit: 'cover', 
                          width: '100%', 
                          height: '100%',
                          filter: 'blur(2px) brightness(0.8)',
                          transform: 'scale(1.05)',
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Overlaid attendee count badge */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    zIndex: 10,
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '3px',
                    paddingBottom: '3px',
                    backgroundColor: '#E6F8C1',
                    color: '#0e2b17',
                    borderRadius: '14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.2px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  {approvedCount} approved
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}; 