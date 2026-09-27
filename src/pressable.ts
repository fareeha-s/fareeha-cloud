import type React from 'react';

// Makes a clickable, non-button element reachable with Tab and usable with
// Enter or Space, by forwarding the key press to its existing click handler
export const pressable = (label?: string) => ({
  role: 'button' as const,
  tabIndex: 0,
  'aria-label': label,
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  },
});
