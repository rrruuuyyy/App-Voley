import React, { type ReactNode } from 'react';
import type { SortDirection, SortConfig, ExtendedTableColumn } from '../pagination/types';

export interface SortableTableProps<T = any> {
  columns: ExtendedTableColumn<T>[];
  data: T[];
  children?: ReactNode;
  className?: string;
  onSort?: (sortConfig: SortConfig<T>) => void;
  defaultSort?: SortConfig<T>;
  loading?: boolean;
  emptyMessage?: string;
  externalSort?: boolean;
  currentSort?: SortConfig<T>;
  maxTableWidth?: string;
  defaultTruncate?: boolean;
}

interface SortIconProps {
  direction: SortDirection;
  className?: string;
}

const SortIcon: React.FC<SortIconProps> = ({ direction, className = '' }) => {
  if (direction === 'asc') {
    return (
      <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
    );
  }
  
  if (direction === 'desc') {
    return (
      <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  }
  
  return (
    <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
    </svg>
  );
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const SortableTable: React.FC<SortableTableProps> = ({
  columns,
  data,
  children,
  className = '',
  onSort,
  defaultSort,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  externalSort = false,
  currentSort,
  maxTableWidth = '100%',
  defaultTruncate = true
}) => {
  const [internalSort, setInternalSort] = React.useState<SortConfig>(defaultSort || { key: '', direction: null });
  
  const activeSort = externalSort ? currentSort : internalSort;

  const handleSort = (columnKey: string) => {
    let newDirection: SortDirection = 'asc';
    
    if (activeSort?.key === columnKey) {
      if (activeSort.direction === 'asc') {
        newDirection = 'desc';
      } else if (activeSort.direction === 'desc') {
        newDirection = null;
      }
    }
    
    const newSortConfig = { key: columnKey, direction: newDirection };
    
    if (externalSort) {
      onSort?.(newSortConfig);
    } else {
      setInternalSort(newSortConfig);
      onSort?.(newSortConfig);
    }
  };

  const sortedData = React.useMemo(() => {
    if (externalSort || !activeSort?.direction || !activeSort.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, activeSort.key as string);
      const bValue = getNestedValue(b, activeSort.key as string);
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return activeSort.direction === 'asc' ? comparison : -comparison;
      }
      
      if (aValue < bValue) return activeSort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return activeSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, activeSort, externalSort]);

  const displayData = externalSort ? data : sortedData;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`} style={{ maxWidth: maxTableWidth }}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                  } ${column.className || ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.name || String(column.key)}</span>
                    {column.sortable && (
                      <SortIcon
                        direction={activeSort?.key === column.key ? activeSort.direction : null}
                        className="flex-shrink-0"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {columns.map((column) => {
                    const value = getNestedValue(row, column.key as string);
                    const cellContent = column.render ? column.render(value, row, index) : value;
                    
                    return (
                      <td
                        key={column.key as string}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${
                          defaultTruncate ? 'truncate' : ''
                        } ${column.className || ''}`}
                        style={{ 
                          width: column.width,
                          maxWidth: column.maxWidth
                        }}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  );
};

export default SortableTable;
