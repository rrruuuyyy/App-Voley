import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { BaseComponentProps } from '../types';

interface ActionButtonProps extends BaseComponentProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  color = 'blue',
  onClick,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'text-blue-500 dark:text-blue-400',
    green: 'text-green-500 dark:text-green-400',
    purple: 'text-purple-500 dark:text-purple-400',
    orange: 'text-orange-500 dark:text-orange-400',
  };

  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center p-4 
        border border-gray-200 dark:border-gray-600
        rounded-lg 
        bg-white dark:bg-gray-800
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-colors 
        duration-200
        text-left
        w-full
        ${className}
      `}
    >
      <Icon className={`h-8 w-8 mr-3 ${colorClasses[color]}`} />
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </button>
  );
};

export default ActionButton;
