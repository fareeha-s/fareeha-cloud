import React, { useState } from 'react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    __setTheme?: (light: boolean) => void;
  }
}

// iOS-style glass switch: moon (dark) ↔ sun (daylight linen). Used on desktop and phones.
// The theme itself is applied and remembered by the script in index.html.
const ThemeToggle: React.FC = () => {
  const [light, setLight] = useState(() => document.documentElement.classList.contains('theme-light'));

  const flip = () => {
    const next = !light;
    setLight(next);
    window.__setTheme?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={flip}
      className="relative flex items-center rounded-full p-[3px] transition-colors duration-500"
      style={{
        width: 64,
        height: 34,
        cursor: 'pointer',
        justifyContent: light ? 'flex-end' : 'flex-start',
        // Frosted glass track, lightly tinted gold in daylight
        background: light ? 'rgba(236, 184, 108, 0.32)' : 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        boxShadow: light
          ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.55), inset 0 1px 2px rgba(120, 80, 20, 0.15), 0 4px 14px -6px rgba(120, 80, 20, 0.3)'
          : 'inset 0 0 0 1px rgba(255, 255, 255, 0.14), inset 0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 14px -6px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Faint icon on the empty side of the track */}
      <span
        className="absolute top-1/2 -translate-y-1/2 flex"
        style={{ [light ? 'left' : 'right']: 10, opacity: 0.55 }}
        aria-hidden="true"
      >
        {light ? <Moon color="#7a5418" /> : <Sun color="rgba(255,255,255,0.8)" />}
      </span>

      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 28,
          height: 28,
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2), inset 0 0 0 0.5px rgba(255,255,255,0.9)',
        }}
      >
        {light ? <Sun color="#d99a2b" /> : <Moon color="#3a3a44" />}
      </motion.span>
    </button>
  );
};

const Sun: React.FC<{ color: string }> = ({ color }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" fill={color} stroke="none" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
  </svg>
);

const Moon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
    <path d="M20.5 14.6A8.5 8.5 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z" />
  </svg>
);

export default ThemeToggle;
