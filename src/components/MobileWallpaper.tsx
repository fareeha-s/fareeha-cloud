import React from 'react';

// Polaroids from past gatherings tossed across the phone's "tabletop", sitting
// out of focus behind the glass like a depth-of-field wallpaper. They're baked
// into a single pre-blurred image (public/images/wallpaper.webp) so the phone
// downloads one small file and never has to blur anything live.
const MobileWallpaper: React.FC<{ isLoaded?: boolean }> = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
    <div
      className="mobile-wallpaper absolute inset-0"
      style={{ backgroundImage: 'url(/images/wallpaper.webp)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
    />

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

export default MobileWallpaper;
