import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Polaroid from './Polaroid';
import { polaroidPhotos, PolaroidPhoto } from '../data/polaroids';

type Stack = {
  pos: React.CSSProperties;
  // Bottom of the stack first
  photos: { photo: PolaroidPhoto; rotate: number; dx: number; dy: number }[];
  width: number;
};

// Just the fruit gatherings, each on its own, tossed loosely around the card and phone
const stacks: Stack[] = [
  { pos: { left: '4%', top: '12%' }, width: 185, photos: [{ photo: polaroidPhotos.scrumptious, rotate: -6, dx: 0, dy: 0 }] },
  { pos: { left: '2.5%', bottom: '5%' }, width: 170, photos: [{ photo: polaroidPhotos.citrus, rotate: 4, dx: 0, dy: 0 }] },
  { pos: { left: '51%', bottom: '3%' }, width: 170, photos: [{ photo: polaroidPhotos.kiwi, rotate: -4, dx: 0, dy: 0 }] },
  { pos: { right: '2.5%', top: '12%' }, width: 180, photos: [{ photo: polaroidPhotos.strawberry, rotate: 6, dx: 0, dy: 0 }] },
  { pos: { right: '3.5%', bottom: '7%' }, width: 185, photos: [{ photo: polaroidPhotos.pomegranate, rotate: -3, dx: 0, dy: 0 }] },
];

// Polaroids from past gatherings scattered around the desktop page. Each one can be
// picked up and dragged anywhere; whatever you grab last sits on top.
const PolaroidStacks: React.FC = () => {
  const [order, setOrder] = useState<string[]>([]);
  const bringToFront = (key: string) => setOrder((prev) => [...prev.filter((k) => k !== key), key]);

  let dealt = 0;
  return (
    <div
      className="invisible [@media(min-width:1320px)_and_(min-height:700px)]:visible fixed inset-0 z-[15] pointer-events-none"
    >
      {stacks.map((stack, s) =>
        stack.photos.map(({ photo, rotate, dx, dy }) => {
          const key = photo.caption;
          const i = dealt++;
          const raised = order.indexOf(key);
          return (
            <motion.div
              key={key}
              className="absolute pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
              style={{ ...stack.pos, marginLeft: dx, marginTop: dy, zIndex: raised === -1 ? s * 10 + i : 100 + raised }}
              drag
              // No momentum or constraints: it stays under the pointer, so it can't be lost off-screen,
              // and nothing re-clamps (and jumps) when the window is resized
              dragMomentum={false}
              onPointerDown={() => bringToFront(key)}
              // Keep the phone's iframe from swallowing the pointer mid-drag
              onDragStart={() => document.body.classList.add('dragging-polaroid')}
              onDragEnd={() => document.body.classList.remove('dragging-polaroid')}
              initial={{ opacity: 0, y: -40, rotate: rotate * 2.2, scale: 1.08 }}
              animate={{ opacity: 1, y: 0, rotate, scale: 1 }}
              whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              whileDrag={{ scale: 1.08, rotate: rotate / 3, boxShadow: '0 30px 60px -12px rgba(0,0,0,0.7)' }}
              transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.4 + i * 0.12 }}
            >
              <Polaroid src={photo.src} alt={photo.caption} width={stack.width} developDelay={0.5 + i * 0.12} />
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default PolaroidStacks;
