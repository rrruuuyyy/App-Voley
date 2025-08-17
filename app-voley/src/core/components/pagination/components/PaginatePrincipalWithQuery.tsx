import React, { useState } from 'react';
import type { FieldsPaginate, FiledPaginateQueryAnd } from '../types';
import { PaginateNavigation } from './PaginateNavigation';
import { PaginateFilters } from './PaginateFilters';
import PaginationFooter from './PaginationFooter';

interface PaginatePrincipalWithQueryProps {
  fields?: FieldsPaginate[];
  fieldsAnd?: FiledPaginateQueryAnd[];
  
  // Props de control de estado
  state: any;
  meta: any;
  isLoading: boolean;
  
  // Funciones de control
  updateSearch: (search: string) => void;
  updateSelectedFields: (fields: string[]) => void;
  updateQueryAndFilters: (filters: any) => void;
  toggleShowQueryAndFilters: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  reload: () => void;
  search: () => void;
  setLimit?: (limit: number) => void;
  
  // Callbacks opcionales
  onAdd?: () => void;
  
  // Children para contenido personalizado
  children?: React.ReactNode;
}

export const PaginatePrincipalWithQuery = (
  props: PaginatePrincipalWithQueryProps
): React.ReactElement => {
  const {
    fields = [],
    fieldsAnd = [],
    
    // Estado y funciones del hook
    state,
    meta,
    isLoading,
    updateSearch,
    updateSelectedFields,
    updateQueryAndFilters,
    // toggleShowQueryAndFilters,
    goToNextPage,
    goToPreviousPage,
    reload,
    search,
    setLimit,
    
    // Callbacks
    onAdd,
    
    // Children
    children
  } = props;
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(searchTerm);
    search();
  };

  const handleReload = () => {
    reload();
  };

  const handleAdd = () => {
    onAdd?.();
  };

  const handleLimitChange = (limit: number) => {
    setLimit?.(limit);
  };

  return (
    <div className="grid grid-cols-1">
      <div className="space-y-4">
        {/* Search and Controls Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={handleReload}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
              {fields.length > 0 && (
                <PaginateFilters
                  fields={fields}
                  onFieldsChange={updateSelectedFields}
                />
              )}
            </form>
          </div>
          
          <div className="lg:col-span-7">
            <PaginateNavigation
              meta={meta}
              onNext={goToNextPage}
              onBack={goToPreviousPage}
              onNew={handleAdd}
            />
          </div>
        </div>

        {/* Advanced Filters Row */}
        {state.showQueryAndFilters && fieldsAnd.length > 0 && (
          <div className="filters-section">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {fieldsAnd.map((field) => (
                <div key={field.keyForm} className="col-span-1">
                  <label 
                    htmlFor={`input-${field.keyForm}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    {field.name}
                  </label>
                  <input
                    id={`input-${field.keyForm}`}
                    type="text"
                    value={state.queryAndFilters[field.keyForm] || ''}
                    onChange={(e) => updateQueryAndFilters({
                      ...state.queryAndFilters,
                      [field.keyForm]: e.target.value
                    })}
                    placeholder={field.name}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Children Content */}
      {children && (
        <div className="mt-4">
          <div className="overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-700 dark:text-gray-300">Cargando...</span>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      )}
      
      <PaginationFooter
        className='mt-2'
        meta={meta}
        currentLimit={state.limit || 10}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
};
