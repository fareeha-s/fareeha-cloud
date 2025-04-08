import React from 'react';
import { AppScreenProps } from '../types';

export const AppScreen: React.FC<AppScreenProps & { children: React.ReactNode }> = ({ 
  children
}) => {
  // Just render the content directly with consistent styling
  return (
    <div className="h-full px-5 py-6">
      <div className="h-full overflow-y-auto scrollbar-hide mt-2">
        {children}
      </div>
    </div>
  );
};