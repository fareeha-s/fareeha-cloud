import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type PartifulEventProps = {
  onBack: () => void;
};

export const PartifulEvent: React.FC<PartifulEventProps> = ({ onBack }) => {
  // Add useEffect to hide sidebar when component mounts
  useEffect(() => {
    // Add a class to the body to handle sidebar visibility
    document.body.classList.add('partiful-event-active');
    
    // Clean up function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('partiful-event-active');
    };
  }, []);

  // Host profile photos with smaller size to match screenshot
  const hostPhotos = [
    { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
    { id: 2, image: 'https://i.pravatar.cc/100?img=32' },
    { id: 3, image: 'https://i.pravatar.cc/100?img=33' },
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
  
  return (
    // Adding onClick handler to prevent bubbling on the entire component
    <div 
      className="fixed inset-0 overflow-auto z-50" 
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
      onClick={preventBubbling}
    >
      {/* Main content - also adding onClick here for extra safety */}
      <section 
        className="WJXgWN min-h-screen w-full overflow-y-auto" 
        style={{ backgroundColor: '#0e2b17', padding: '20px' }}
        onClick={preventBubbling}
      >
        {/* Partiful logo in upper left - now with link to partiful.com */}
        <div className="absolute top-6 left-6">
          <a 
            href="https://partiful.com" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleExternalLinkClick}
          >
            <img 
              src="/icons/partiful.png" 
              alt="Partiful" 
              className="w-6 h-6" 
            />
          </a>
        </div>

        {/* Back arrow moved to top right */}
        <div className="absolute top-6 right-6 cursor-pointer" onClick={handleBackClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Header title - using Grotesk font */}
        <h1 className="ptf-l-PKzNy ptf-l-kz-X6 cGVq-y" style={{ fontSize: '32px', fontFamily: 'Grotesk, -apple-system, BlinkMacSystemFont, Arial, sans-serif', lineHeight: 1.1, marginBottom: '12px', color: 'white', textAlign: 'center', fontWeight: 600, letterSpacing: '0.5px', paddingTop: '40px' }}>
          <span className="summary">mental static</span>
        </h1>
        
        {/* Event image - using the correct paths from public/images/partiful */}
        <div className="w-full flex justify-center mb-2">
          <div className="relative w-full max-w-md h-[260px]">
            <picture>
              <source srcSet="/images/partiful/ms-giphy.webp" type="image/webp" />
              <img 
                src="/images/partiful/ms-fallback.jpg" 
                alt="Mental Static Event" 
                className="w-full h-full object-contain" 
                style={{ borderRadius: '4px' }}
              />
            </picture>
          </div>
        </div>
        
        <div className="ptf-l-kmWBO _5zoT4j">
          {/* Date info - increased font size slightly */}
          <time className="ptf-l-V4zs2 dtstart ptf-l-mXUGi" dateTime="2025-03-31T07:30:00.000-07:00">
            <div className="ptf-l-daxsj">
              <div>
                <div className="ptf-l-EDGV-" style={{ color: 'white', fontSize: '24px', fontWeight: 500 }}>Monday, Mar 31</div>
                <div className="ptf-l-y64FO" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>7:30pm</div>
              </div>
            </div>
          </time>
          
          {/* Host profiles section - even smaller sizes */}
          <div className="ptf-l-gFMtG" style={{ marginBottom: '18px', marginTop: '2px', overflow: 'hidden' }}>
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
          </div>
          
          {/* Description text - smaller font size */}
          <span 
            className="ptf-6n-N4 ptf-NNO7K ptf-l-mWmFQ ptf-l-99OOv description" 
            style={{ color: 'white', fontSize: '14px', fontWeight: 400, overflowWrap: 'break-word', whiteSpace: 'pre-line', wordBreak: 'break-word', minHeight: '40px', textWrap: 'pretty' }}
          >
            quick hits of obscure knowledge 💚 
            <br></br><br></br>
            bring that random wikipedia rabbithole only you seem to know about. weird nature stuff, unsolved mysteries, watershed moments, conspiracy theories, crazy undercover govt ops, cool people etc etc <span style={{ color: '#5938e8' }}>🌀🌀🌀</span> 
            <br></br><br></br>
            wiki page will go up on a projector. exactly two mins for you to brief us. +1 question from the rest of us
            <br></br><br></br>
            limited capacity! tell us what you'd share 🫶🏼
          </span>
        </div>
      </section>
    </div>
  );
}; 