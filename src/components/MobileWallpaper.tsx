import React from 'react';
import Polaroid from './Polaroid';
import { polaroidPhotos } from '../data/polaroids';

// Polaroids from past gatherings tossed across the phone's "tabletop", sitting
// out of focus behind the glass like a depth-of-field wallpaper. They drift very
// slowly so the home screen feels alive, and the glass picks up their colour.
const scattered = [
  { photo: polaroidPhotos.mango, style: { left: '-9vw', top: '3vh' }, rotate: -9 },
  { photo: polaroidPhotos.strawberry, style: { right: '-7vw', top: '10vh' }, rotate: 8 },
  { photo: polaroidPhotos.citrus, style: { left: '-4vw', top: '43vh' }, rotate: 6 },
  { photo: polaroidPhotos.pomegranate, style: { right: '-11vw', top: '55vh' }, rotate: -7 },
  { photo: polaroidPhotos.kiwi, style: { left: '18vw', bottom: '-5vh' }, rotate: -3 },
];

const MobileWallpaper: React.FC<{ isLoaded: boolean }> = ({ isLoaded }) => {
  const width = typeof window !== 'undefined' ? Math.round(Math.min(window.innerWidth, 500) * 0.5) : 190;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1.4s ease' }}
      aria-hidden="true"
    >
      <div className="mobile-wallpaper absolute inset-0">
        {scattered.map(({ photo, style, rotate }, i) => (
          <div key={photo.caption} className="absolute" style={{ ...style, transform: `rotate(${rotate}deg)` }}>
            <Polaroid src={photo.src} width={width} developDelay={0.3 + i * 0.15} />
          </div>
        ))}
      </div>

      {/* Keep the top and bottom calm so the header and home screen stay legible */}
      <div
        className="mobile-wallpaper-scrim absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(11,11,12,0.55) 0%, rgba(11,11,12,0.2) 30%, rgba(11,11,12,0.25) 65%, rgba(11,11,12,0.6) 100%)',
        }}
      />
    </div>
  );
};

export default MobileWallpaper;
