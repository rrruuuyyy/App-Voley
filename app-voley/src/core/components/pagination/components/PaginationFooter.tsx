import React from 'react';
import type { MetaPaginate } from '../types';

interface PaginationFooterProps {
  meta?: MetaPaginate;
  currentLimit: number;
  onLimitChange: (limit: number) => void;
  className?: string;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  meta,
  currentLimit,
  onLimitChange,
  className = ""
}) => {
  const limitOptions = [5, 10, 20, 50, 100];

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLimitChange(parseInt(e.target.value, 10));
  };

  return (
    <div className={`flex items-center justify-between py-2 px-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl ${className}`}>
      {/* Left side - Limit selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Mostrar
        </span>
        <select
          value={currentLimit}
          onChange={handleLimitChange}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {limitOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          elementos
        </span>
      </div>

      {/* Right side - Page info */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {meta ? (
          <span>
            Página {meta.page || 1} de {meta.pageCount || 1}
            {(meta.itemCount || 0) > 0 && (
              <>
                {' '} • {meta.itemCount} Item{(meta.itemCount || 0) !== 1 ? 's' : ''} en total
              </>
            )}
          </span>
        ) : (
          <span>Cargando información de página...</span>
        )}
      </div>
    </div>
  );
};

export default PaginationFooter;
