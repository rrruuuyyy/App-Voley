import React, { useState, useRef, useEffect } from 'react';
import type { FieldsPaginate } from '../types';

interface PaginateFiltersProps {
  fields: FieldsPaginate[];
  onFieldsChange: (selectedFields: string[]) => void;
}

export const PaginateFilters: React.FC<PaginateFiltersProps> = ({
  fields,
  onFieldsChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>(
    fields.filter(f => f.selected === true).map(f => f.searchKey || f.key)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectAll = (checked: boolean) => {
    const newSelectedFields = checked ? fields.map(f => f.searchKey || f.key) : [];
    setSelectedFields(newSelectedFields);
    onFieldsChange(newSelectedFields);
  };

  const handleFieldToggle = (fieldKey: string) => {
    const newSelectedFields = selectedFields.indexOf(fieldKey) !== -1
      ? selectedFields.filter(key => key !== fieldKey)
      : [...selectedFields, fieldKey];
    
    setSelectedFields(newSelectedFields);
    onFieldsChange(newSelectedFields);
  };

  if (!fields.length) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        Filtros
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <div className="px-4 py-2 text-sm border-b border-gray-100 dark:border-gray-700">
              <label className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={selectedFields.length === fields.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                />
                <span>Seleccionar todos</span>
              </label>
            </div>
            {fields.map((field) => (
              <div key={field.key} className="px-4 py-2">
                <label className="flex items-center space-x-2 cursor-pointer text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.searchKey || field.key)}
                    onChange={() => handleFieldToggle(field.searchKey || field.key)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <span className="text-sm">{field.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
