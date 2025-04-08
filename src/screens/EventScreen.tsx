import React, { useState } from 'react';
import type { AppScreenProps } from '../types';
import { motion, useReducedMotion } from 'framer-motion';
import { createTactileEffect } from '../App';
import { PartifulEvent } from '../components/PartifulEvent';

export const EventScreen: React.FC<AppScreenProps> = () => {
  const prefersReducedMotion = useReducedMotion();
  const [showPartiful, setShowPartiful] = useState(false);
  
  const projects = [
    {
      title: "partiful app",
      description: "ios-inspired party invitation app"
    },
    {
      title: "e-commerce platform",
      description: "modern e-commerce solution"
    }
  ];

  // Apple-like spring animation
  const springTransition = {
    type: "spring",
    damping: 30,
    stiffness: 400,
    mass: 0.8,
  };
  
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }
    }
  };

  if (showPartiful) {
    return (
      <PartifulEvent 
        onBack={() => {
          setShowPartiful(false);
          createTactileEffect();
        }}
      />
    );
  }

  return (
    <div className="h-full px-5 py-6" onClick={(e) => e.stopPropagation()}>
      <motion.div 
        className="h-full overflow-y-auto scrollbar-hide space-y-4 mt-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {projects.map((project, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              ...springTransition,
              duration: prefersReducedMotion ? 0 : undefined
            }}
            className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl py-4 px-5 cursor-pointer will-change-transform hardware-accelerated"
            onClick={(e) => {
              e.stopPropagation();
              createTactileEffect();
              // Open the Partiful iframe when the first project is clicked
              if (index === 0) {
                setShowPartiful(true);
              }
            }}
            variants={itemVariants}
            style={{ 
              willChange: 'transform, opacity'
            }}
          >
            <h3 className="text-white text-base font-normal">{project.title}</h3>
            <p className="text-white/80 text-sm mt-1">{project.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};