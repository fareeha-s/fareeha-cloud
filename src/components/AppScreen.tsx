import React from 'react';
import { AppScreenProps } from '../types';

export const AppScreen: React.FC<AppScreenProps & { children: React.ReactNode }> = ({ 
  children
}) => {
  // Render content directly with iPhone styling
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
};