import React, { useState, useEffect } from 'react';

interface AppBackgroundProps {
  isLoaded: boolean; // Pass isLoaded state to control image fade-in
}

const AppBackground: React.FC<AppBackgroundProps> = ({ isLoaded }) => {
  // State to handle image fallback
  const [imageSrc, setImageSrc] = useState('./images/background.webp');

  // Effect to try loading the primary image and fallback if needed
  useEffect(() => {
    const img = new Image();
    img.src = './images/background.webp';
    img.onerror = () => {
      // If webp fails, set state to use jpg
      setImageSrc('./images/background.jpg');
    };
  }, []); // Run only once on mount

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Base gradient and color */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#131518] to-[#1d1c21]"
        style={{
          opacity: 1,
          backgroundColor: '#131518',
        }}
      >
        {/* Subtle bokeh effect overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.02) 0%, transparent 30%), radial-gradient(circle at 45% 80%, rgba(180,180,200,0.02) 0%, transparent 40%)',
            mixBlendMode: 'screen'
          }}
        ></div>

        {/* Background image that loads on top of the gradient */}
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 0.7 : 0,
            transition: 'opacity 1s ease',
            backgroundColor: '#131518',
          }}
          // No onError needed here as the effect handles the fallback
        />

        {/* Subtle overlay for better text contrast */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: isLoaded ? 0.35 : 0,
            transition: 'opacity 1s ease',
          }}
        ></div>
      </div>
    </div>
  );
};

export default AppBackground; 