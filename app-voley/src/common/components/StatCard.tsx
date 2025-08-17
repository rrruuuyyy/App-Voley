import React from 'react';
import type { LucideIcon } from 'lucide-react';
import type { BaseComponentProps, ColorVariant } from '../types';

interface StatCardProps extends BaseComponentProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: ColorVariant;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend,
  description,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700
      rounded-xl 
      p-6 
      shadow-sm 
      hover:shadow-md 
      dark:hover:shadow-lg
      transition-shadow 
      duration-200
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
