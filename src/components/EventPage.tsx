import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { EventItem } from '../data/events';

// Event type configuration
type EventType = 'strawberry-hour' | 'blood-moon-rising' | 'mental-static' | 'out-of-office' | 'threading-in' | 'consumer-social' | 'watercolour';

// Event configuration type
type EventConfig = {
  title: string;
  date: string;
  time: string;
  attendees: number;
  backgroundColor: string;
  accentColor: string;
  spotifyLink: string;
  spotifyLyrics: string;
  description: string;
  hostPhotos: { id: number; image: string }[];
  attendeePhotos: { id: number; image: string }[];
};

// Event configurations
const eventConfigs: Record<EventType, EventConfig> = {
  'strawberry-hour': {
    title: 'strawberry hour',
    date: '26/03/25',
    time: '7:00pm',
    attendees: 8,
    backgroundColor: 'rgba(0, 32, 63, 0.7)', // Navy blue with transparency (was pink)
    accentColor: '#FF69B4',
    spotifyLink: 'https://open.spotify.com/track/3Am0IbOxmvlSXro7N5iSfZ?si=YdJhZwYXTnqHh_5JYQZQZA',
    spotifyLyrics: 'let me take you down cause i\'m going to strawberry fields',
    description: `strawberry hour 🍓

join us for an afternoon of strawberry-themed delights! we'll be making strawberry shortcakes, strawberry smoothies, and strawberry jam. bring your favorite strawberry recipe to share.

all ingredients will be provided, but feel free to bring your own strawberries if you have a special variety you'd like to share.

limited to 8 people to keep it cozy and intimate. let us know if you'd like to join! 💕`,
    hostPhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=41' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=42' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=43' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=44' }
    ],
    attendeePhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=11' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=12' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=13' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=14' },
    ],
  },
  'blood-moon-rising': {
    title: 'blood moon rising',
    date: '13/03/25',
    time: '8:00pm',
    attendees: 15,
    backgroundColor: 'rgba(20, 20, 40, 0.7)', // Dark blue/black with transparency
    accentColor: '#8B0000', // Dark red
    spotifyLink: 'https://maps.app.goo.gl/MkcQaTLh5AAbgCvQ9',
    spotifyLyrics: 'Moon Info',
    description: `to witness the sky's transformation,
marvel at cosmic rarity,
and remember being small under something ancient.

// layers recommended. the cold is merciless.

missing this will be cosmic treason;
your absence will haunt you.
🌑`,
    hostPhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=35' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=36' },
    ],
    attendeePhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=15' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=16' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=17' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=18' },
    ],
  },
  'mental-static': {
    title: 'mental static',
    date: '31/03/25',
    time: '7:30pm',
    attendees: 35,
    backgroundColor: 'rgba(14, 43, 23, 0.7)', // Dark green with transparency
    accentColor: '#5938e8',
    spotifyLink: 'https://open.spotify.com/track/0LSLM0zuWRkEYemF7JcfEE?si=EhnHw1mWS1OOC9joykQgOA',
    spotifyLyrics: 'surf it scroll it pause it click it cross it crack it ssswitch update it',
    description: `quick hits of obscure knowledge 💚

bring that random wikipedia rabbithole only you seem to know about. weird nature stuff, unsolved mysteries, watershed moments, conspiracy theories, crazy undercover govt ops, cool people etc etc 🌀🌀🌀

wiki page will go up on a projector. exactly two mins for you to brief us. +1 question from the rest of us

limited capacity! tell us what you'd share 🫶🏼`,
    hostPhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=31' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=32' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=33' },
    ],
    attendeePhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=1' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=2' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=3' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=4' },
    ],
  },
  'out-of-office': {
    title: 'out of office',
    date: '05/03/25',
    time: '7:30pm',
    attendees: 24,
    backgroundColor: 'rgba(144, 190, 109, 0.7)', // Light green with transparency
    accentColor: '#7DBA63',
    spotifyLink: '2459 Larkin St APT 9, San Francisco, CA',
    spotifyLyrics: 'light drinks & snacks',
    description: `light drinks & snacks
cocktail party, russian hill, sunset views 🌉

we know so many interesting people who should know each other! time to make that happen 🩵

agenda
7:30 your arrival (don't be late srsly)
7:45 meet your future collaborators, conspirators, accomplices
8:30 forced connection ritual 🫶🏼 (ice breakers lol)
8:45 artsy/creative/mysterious group photo
9:30 disappear (it's a school night)

dress code: casual, shoes off :)
parking: street, can be limited in the evening

xoxo`,
    hostPhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=29' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=30' },
    ],
    attendeePhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=21' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=22' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=23' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=24' },
    ],
  },
  'threading-in': {
    title: 'threading in',
    date: '20/02/25',
    time: '7:00pm',
    attendees: 40,
    backgroundColor: 'rgba(50, 35, 20, 0.7)', // Dark brown with transparency
    accentColor: '#D2B48C', // Tan/light brown
    spotifyLink: '1395 22nd St Apt 4, San Francisco, CA',
    spotifyLyrics: 'Fareeha',
    description: `Another Thursday, another nosh sesh.

Curated for the people in our lives whose eyes sparkle when they talk.

Few things bring us more joy than cooking for others, so there will be lots of beautiful finger foods🤍`,
    hostPhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=27' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=28' },
    ],
    attendeePhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=41' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=42' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=43' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=44' },
    ],
  },
  'consumer-social': {
    title: 'consumer social',
    date: '09/02/25',
    time: '6:45pm',
    attendees: 10,
    backgroundColor: 'rgba(10, 20, 40, 0.7)', // Navy blue with transparency
    accentColor: '#4A90E2', // Light blue
    spotifyLink: 'Presidio Bowl',
    spotifyLyrics: 'Presidio Bowl',
    description: `The plan:

we go bowling 🎳
and talk about all our fave apps :)

bring a consumer product hot take. hottest take gets a high five`,
    hostPhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=25' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=26' },
    ],
    attendeePhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=51' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=52' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=53' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=54' },
    ],
  },
  'watercolour': {
    title: 'Watercolour',
    date: '19/09/25',
    time: '6:30pm',
    attendees: 20,
    backgroundColor: 'rgba(180, 175, 230, 0.7)', // Light lavender with transparency
    accentColor: '#B19CD9', // Deeper lavender
    spotifyLink: 'Baukunst, 433 Cortland Ave, San Francisco, CA 94110',
    spotifyLyrics: 'Baukunst, 433 Cortland Ave, San Francisco, CA 94110',
    description: `Watercolour 🎨

Where pigment meets purpose, and vision bleeds into reality. We thrive in the diverse palette of our community.

We wanted to bring some of our favorite people in the city together for an intimate seated dinner, to celebrate each other and to create space for creative community.

You are cordially invited.

dress code: pastels, watercolor washes, artisan details 🪷`,
    hostPhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=23' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=24' },
    ],
    attendeePhotos: [
      { id: 1, image: 'https://i.pravatar.cc/100?img=61' },
      { id: 2, image: 'https://i.pravatar.cc/100?img=62' },
      { id: 3, image: 'https://i.pravatar.cc/100?img=63' },
      { id: 4, image: 'https://i.pravatar.cc/100?img=64' },
    ],
  },
};

type EventPageProps = {
  onBack: () => void;
  eventData?: EventItem;
  eventType: EventType;
};

export const EventPage: React.FC<EventPageProps> = ({ onBack, eventData, eventType }) => {
  // State to track if user has scrolled
  const [hasScrolled, setHasScrolled] = useState(false);
  // State to track if additional content is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get the event configuration
  const config = eventConfigs[eventType];
  
  // Use event data if provided, otherwise use default config
  const eventTitle = eventData?.title || config.title;
  const attendeeCount = eventData?.attendees || config.attendees;
  const eventDate = eventData?.date || config.date;
  
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

  // Split the description text into words for animation
  const descriptionLines = config.description.split('\n').map(line => line.split(' '));
  
  // Flatten the array but keep track of line breaks
  const descriptionWords = descriptionLines.reduce((acc, line, lineIndex) => {
    if (lineIndex > 0) {
      acc.push('\n'); // Add line break between lines
    }
    return acc.concat(line);
  }, [] as string[]);
  
  // Generate colors for attendee circles
  const generateAttendeeColors = (count: number) => {
    const baseColors = [
      { bg: `linear-gradient(135deg, ${config.accentColor}, ${adjustColor(config.accentColor, 20)})`, pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
      { bg: `linear-gradient(135deg, ${adjustColor(config.accentColor, 20)}, ${adjustColor(config.accentColor, -20)})`, pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
      { bg: `linear-gradient(135deg, ${adjustColor(config.accentColor, -20)}, ${config.accentColor})`, pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
      { bg: `linear-gradient(135deg, ${config.accentColor}, ${adjustColor(config.accentColor, 20)})`, pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
    ];
    
    // Repeat the colors to match the count
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    
    return colors;
  };
  
  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust brightness
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };
  
  // Add a function to calculate appropriate font size based on title length
  const calculateFontSize = (title: string) => {
    // Base font size
    const baseSize = 28;
    
    // If title is longer than 20 characters, reduce font size
    if (title.length > 20) {
      // Reduce by 1px for every 2 characters over 20
      const reduction = Math.min(8, Math.floor((title.length - 20) / 2));
      return baseSize - reduction;
    }
    
    return baseSize;
  };
  
  // Calculate font size based on event title
  const titleFontSize = calculateFontSize(eventTitle);
  
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
        backgroundColor: config.backgroundColor,
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
            fontSize: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? '42px' : `${titleFontSize}px`,
            fontFamily: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? 
              'Freight Display Pro, Didot, "Bodoni MT", "Times New Roman", serif' : 
              'Grotesk, -apple-system, BlinkMacSystemFont, Arial, sans-serif',
            lineHeight: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? 1.2 : 1.1,
            marginBottom: '12px', 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? 500 : 600,
            letterSpacing: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? '-0.03em' : '0.12em',
            paddingTop: '0px',
            paddingLeft: '16px',
            paddingRight: '16px',
            textTransform: eventType === 'strawberry-hour' || eventType === 'out-of-office' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? 'none' : 'lowercase',
            fontStyle: 'normal',
            width: '100%',
            display: 'block',
            position: 'relative',
            margin: '0 auto',
            maxWidth: '100%',
            overflow: 'visible'
          }}
        >
          <span 
            className="summary" 
            style={{ 
              fontStretch: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? 'normal' : 'expanded',
              letterSpacing: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? '-0.04em' : '0.08em',
              display: 'block',
              width: '100%',
              position: 'relative',
              overflow: 'visible',
              padding: '0 8px',
              marginRight: eventType === 'strawberry-hour' || eventType === 'threading-in' || eventType === 'consumer-social' || eventType === 'watercolour' ? '-0.04em' : '0' // Compensate for the last character spacing
            }}
          >
            {eventType === 'strawberry-hour' ? "Strawberry hour." : 
             eventType === 'out-of-office' ? "out of office" : 
             eventType === 'threading-in' ? "threading in" : 
             eventType === 'consumer-social' ? "consumer social." : eventType === 'watercolour' ? "watercolour." : eventTitle}
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
              <source srcSet="./images/partiful/ms-giphy.webp" type="image/webp" />
              <img 
                src="./images/partiful/ms-fallback.jpg" 
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
          dateTime={`${eventDateTime.getFullYear()}-${String(eventDateTime.getMonth() + 1).padStart(2, '0')}-${String(eventDateTime.getDate()).padStart(2, '0')}T${config.time.replace(':', '')}:00.000-07:00`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ptf-l-daxsj">
            <div>
              <div className="ptf-l-EDGV-" style={{ color: 'white', fontSize: '24px', fontWeight: 500, letterSpacing: '-0.01em' }}>{formattedDate}</div>
              <div className="ptf-l-y64FO" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', fontWeight: 425 }}>{config.time}</div>
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
              {config.hostPhotos.map((host, index) => (
                <div key={host.id} className="ptf-l-UZPE- ptf-l-QJYpB ptf-l-gEM83" style={{ marginRight: index === config.hostPhotos.length - 1 ? '0' : '6px' }}>
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
                        <span className="ptf-l--7nAv ptf-l-WCCTT ptf-l-Wcrf2" style={{ position: 'absolute', bottom: '-1px', right: '-1px', color: config.accentColor, height: '10px', width: '10px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill={config.accentColor} xmlns="http://www.w3.org/2000/svg">
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
              href={config.spotifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ptf-l-5a8R- ptf-l-4Jj6a"
              style={{ color: adjustColor(config.accentColor, 100), fontSize: '14px', fontWeight: 600 }}
              onClick={handleExternalLinkClick}
            >
              {config.spotifyLyrics}
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
              {config.description.split('\n').map((line, index) => (
                <p key={index} style={{ margin: 0, display: 'block', marginTop: index > 0 ? '-4px' : '0' }}>
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Approved attendees section with profile circles and centered badge */}
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
            {[...Array(attendeeCount)].map((_, index) => {
              // Generate colors for attendee circles
              const colors = generateAttendeeColors(attendeeCount);
              
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
                    zIndex: attendeeCount - index,
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
            <div style={{ fontWeight: 500, lineHeight: 1.2 }}>{attendeeCount}</div>
            <div style={{ fontSize: '11px', opacity: 1.0, marginTop: '0px', letterSpacing: '0.02em' }}>Approved</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}; 