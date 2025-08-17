import React from 'react';
import type { BaseComponentProps } from '../types';
import { DarkModeToggle } from '../index';
import { useTheme } from '../../contexts/ThemeContext';

interface PageHeaderProps extends BaseComponentProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showDarkModeToggle?: boolean;
  statusIndicator?: {
    label: string;
    color: 'green' | 'blue' | 'yellow' | 'red';
    isActive?: boolean;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  showDarkModeToggle = true,
  statusIndicator,
  className = ''
}) => {
  const { isDark, toggleTheme } = useTheme();

  const getStatusColors = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 'yellow':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'red':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={`flex justify-between items-center ${className}`}>
      {/* Left side - Title and subtitle */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side - Actions and controls */}
      <div className="flex items-center space-x-4">
        {/* Status indicator */}
        {statusIndicator && (
          <div className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg border
            ${getStatusColors(statusIndicator.color)}
          `}>
            {statusIndicator.isActive && (
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                statusIndicator.color === 'green' ? 'bg-green-500' :
                statusIndicator.color === 'blue' ? 'bg-blue-500' :
                statusIndicator.color === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
            )}
            <span className="text-sm font-medium">
              {statusIndicator.label}
            </span>
          </div>
        )}

        {/* Dark mode toggle */}
        {showDarkModeToggle && (
          <DarkModeToggle isDark={isDark} onToggle={toggleTheme} />
        )}

        {/* Custom actions */}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
