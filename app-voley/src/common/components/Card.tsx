import React from 'react';
import type { BaseComponentProps } from '../types';

interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'md', 
  shadow = 'sm',
  hover = false,
  className = '' 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const baseClasses = `
    bg-white dark:bg-gray-800 
    border border-gray-200 dark:border-gray-700
    rounded-xl
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${hover ? 'hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200' : ''}
  `;

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
