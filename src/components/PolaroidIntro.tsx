import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Polaroid from './Polaroid';
import { polaroidPhotos } from '../data/polaroids';

const SEEN_KEY = 'polaroid-intro-seen';

// Bottom of the stack first; the last one lands on top
const stack = [
  { photo: polaroidPhotos.strawberry, rotate: -9, x: -18 },
  { photo: polaroidPhotos.citrus, rotate: 7, x: 16 },
  { photo: polaroidPhotos.pomegranate, rotate: -2, x: 0 },
];

// Decided once per page load (not per mount), so a remount mid-intro doesn't skip it
const shouldShowIntro = (() => {
  if (typeof window === 'undefined') return false;
  // Desktop gets the scattered polaroids instead
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
  try {
    if (sessionStorage.getItem(SEEN_KEY)) return false;
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Private mode etc. The intro just shows on every load.
  }
  return true;
})();
let introDone = false;

// A little stack of polaroids dealt onto the screen the first time someone
// opens the site in a session. Tap anywhere to skip.
const PolaroidIntro: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => shouldShowIntro && !introDone);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      introDone = true;
      setVisible(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, [visible]);

  const dismiss = () => {
    introDone = true;
    setVisible(false);
  };

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="polaroid-intro"
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ background: 'rgba(12, 13, 15, 0.55)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          onClick={dismiss}
        >
          <motion.div
            className="relative"
            style={{ width: 210, height: 260 }}
            exit={{ y: -60, scale: 0.9, opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } }}
          >
            {stack.map(({ photo, rotate, x }, i) => (
              <motion.div
                key={photo.caption}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ y: 420, x: x * 4, rotate: rotate * 3, opacity: 0 }}
                animate={{ y: 0, x, rotate, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 17, delay: 0.1 + i * 0.22 }}
              >
                <Polaroid src={photo.src} caption={photo.caption} width={200} developDelay={0.3 + i * 0.22} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PolaroidIntro;
