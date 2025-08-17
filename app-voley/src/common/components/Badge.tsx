import React from 'react';
import type { BaseComponentProps, ColorVariant, SizeVariant } from '../types';

interface BadgeProps extends BaseComponentProps {
  children: React.ReactNode;
  variant?: ColorVariant;
  size?: SizeVariant;
  rounded?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'gray', 
  size = 'md', 
  rounded = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const baseClasses = `
    inline-flex items-center font-medium
    ${rounded ? 'rounded-full' : 'rounded'}
    ${sizeClasses[size]}
  `;

  const variantClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
