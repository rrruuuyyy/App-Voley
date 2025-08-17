import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  isDark, 
  onToggle, 
  className = '' 
}) => {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center justify-center
        w-10 h-10
        rounded-lg
        bg-gray-100 dark:bg-gray-700
        hover:bg-gray-200 dark:hover:bg-gray-600
        transition-colors duration-200
        ${className}
      `}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;
