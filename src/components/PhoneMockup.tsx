import React, { useEffect, useState } from 'react';

// The top of an iPhone Pro, drawn at real proportions (393pt wide screen) and
// cropped so it fades out at the bottom. The app only gets the visible part of
// the screen as its viewport, so nothing it shows ever sits under the fade.
// The whole object is scaled to the window, so it looks the same on any monitor.
const SCREEN_W = 393;
const SCREEN_H = 852;
const EDGE = 3; // titanium rim
const BEZEL = 7; // black border around the screen
const PHONE_W = SCREEN_W + 2 * (EDGE + BEZEL);
const PHONE_H = SCREEN_H + 2 * (EDGE + BEZEL);
const VISIBLE_H = 690; // how much of the phone shows before it fades out
const FADE = 80;
const APP_H = VISIBLE_H - EDGE - BEZEL - FADE + 10; // app viewport ends where the fade begins

const titanium = 'linear-gradient(145deg, #6a6966 0%, #34343a 28%, #1d1d20 55%, #57565a 100%)';

const getScale = () =>
  typeof window === 'undefined' ? 0.9 : Math.min(0.95, (window.innerHeight - 170) / VISIBLE_H);

// The visitor's actual local time, like a real lock screen (no AM/PM, as on iPhone)
const formatTime = () => {
  const now = new Date();
  return `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const useClock = () => {
  const [time, setTime] = useState(formatTime);
  useEffect(() => {
    const tick = setInterval(() => setTime(formatTime()), 10_000);
    return () => clearInterval(tick);
  }, []);
  return time;
};

const StatusBar: React.FC = () => {
  const time = useClock();
  return (
  <div
    className="absolute left-0 right-0 flex items-center justify-between pointer-events-none z-20 text-white"
    style={{ top: 18, height: 22, paddingLeft: 52, paddingRight: 38, fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
  >
    <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{time}</span>
    <span className="flex items-center" style={{ gap: 6 }}>
      {/* Signal */}
      <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      {/* Wi-Fi */}
      <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
        <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.1-1.1C13.2 1.7 10.7.7 8 .7S2.8 1.7.9 3.6L2 4.7c1.6-1.5 3.7-2.4 6-2.4zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.1-1.1C11.5 4.7 9.8 4 8 4s-3.5.7-4.7 1.9L4.4 7C5.4 6.1 6.6 5.6 8 5.6zm0 3.3c-.6 0-1.1.2-1.5.6L8 11l1.5-1.5c-.4-.4-.9-.6-1.5-.6z" />
      </svg>
      {/* Battery */}
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="white" strokeOpacity="0.4" />
        <rect x="2" y="2" width="20" height="9" rx="2" fill="white" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="white" fillOpacity="0.45" />
      </svg>
    </span>
  </div>
  );
};

const PhoneMockup: React.FC<{ src: string }> = ({ src }) => {
  const [scale, setScale] = useState(getScale);
  // Start the embedded app in the page's current theme; later flips arrive by postMessage
  const [frameSrc] = useState(() =>
    document.documentElement.classList.contains('theme-light') ? `${src}&theme=light` : src
  );
  // Load the phone's copy of the site only after the page itself has finished,
  // so the card and background get the network and CPU first
  const [frameReady, setFrameReady] = useState(false);
  useEffect(() => {
    const start = () => setTimeout(() => setFrameReady(true), 150);
    if (document.readyState === 'complete') {
      const t = start();
      return () => clearTimeout(t);
    }
    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  useEffect(() => {
    const onResize = () => setScale(getScale());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const button = (side: 'left' | 'right', top: number, height: number) => (
    <div
      className="absolute rounded-full"
      style={{ [side]: -3, top, width: 4, height, background: titanium, boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.15)' }}
    />
  );

  return (
    <div
      style={{
        width: PHONE_W * scale + 8,
        height: VISIBLE_H * scale,
        overflow: 'hidden',
        paddingLeft: 4,
        paddingTop: 4,
        WebkitMaskImage: `linear-gradient(to bottom, #000 calc(100% - ${FADE * scale}px), transparent)`,
        maskImage: `linear-gradient(to bottom, #000 calc(100% - ${FADE * scale}px), transparent)`,
      }}
    >
      <div
        className="relative"
        style={{
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          borderRadius: 64,
          padding: EDGE,
          background: titanium,
          boxShadow: '0 50px 100px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.14)',
        }}
      >
        {/* Action button, volume up/down, side button */}
        {button('left', 160, 34)}
        {button('left', 225, 64)}
        {button('left', 302, 64)}
        {button('right', 250, 100)}

        <div className="w-full h-full bg-black" style={{ borderRadius: 61, padding: BEZEL }}>
          <div className="relative w-full h-full overflow-hidden bg-[#0b0b0c]" style={{ borderRadius: 54 }}>
            <iframe
              src={frameReady ? frameSrc : 'about:blank'}
              title="Fareeha OS on a phone"
              className="block"
              style={{ width: SCREEN_W, height: APP_H, border: 0 }}
            />

            <StatusBar />

            {/* Dynamic Island */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black pointer-events-none z-20"
              style={{ top: 11, width: 124, height: 36 }}
            />

            {/* Soft glass glare across the screen */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ background: 'linear-gradient(118deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 45%)' }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
