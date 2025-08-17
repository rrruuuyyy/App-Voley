import React from 'react';
import type { BaseComponentProps } from '../types';

interface PageLayoutProps extends BaseComponentProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  header,
  className = '' 
}) => {
  return (
    <div className={`h-full flex flex-col bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header fijo */}
      <div className="flex-shrink-0 px-6 py-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        {header}
      </div>
      
      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
