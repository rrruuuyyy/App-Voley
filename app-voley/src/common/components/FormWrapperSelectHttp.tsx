import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FieldValues, Path } from 'react-hook-form';
import { ChevronDown, X, Search } from 'lucide-react';

interface SelectItem {
  id: number;
  nombre: string;
}

interface FormWrapperSelectHttpProps<TFieldValues, TItem extends SelectItem> {
  name: keyof TFieldValues;
  label: string;
  required?: boolean;
  placeholder?: string;
  textHelp?: string;
  disabled?: boolean;
  // Hook de query para obtener los datos - compatible con TanStack Query
  useQuery: (options?: any) => { 
    data: TItem[] | undefined; 
    isLoading: boolean; 
    error: any;
    refetch?: () => void;
  };
  // Función de búsqueda personalizada para fetch dinámico
  searchFunction?: (searchTerm: string) => Promise<{ items: TItem[]; meta?: any }>;
  // Función para obtener un elemento por ID para inicialización
  getByIdFunction?: (id: number) => Promise<TItem | null>;
  // Configuración de búsqueda
  searchFields?: (keyof TItem)[];
  // Configuración de valores
  valueKey?: keyof TItem;
  displayKey?: keyof TItem;
  onItemSelect?: (item: TItem) => void;
  // Valores iniciales preseleccionados
  values?: TItem[];
  // Fetch inicial
  fetchOnMount?: boolean;
}

export function FormWrapperSelectHttp<TFieldValues extends FieldValues, TItem extends SelectItem>({
  name,
  label,
  required,
  placeholder = 'Buscar...',
  textHelp,
  disabled = false,
  useQuery,
  searchFunction,
  getByIdFunction,
  searchFields = ['nombre'],
  valueKey = 'id',
  displayKey = 'nombre',
  onItemSelect,
  values,
  fetchOnMount = false,
}: FormWrapperSelectHttpProps<TFieldValues, TItem>) {
  const { setValue, watch, formState: { errors } } = useFormContext<TFieldValues>();
  
  // Estados locales
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [searchItems, setSearchItems] = useState<TItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Observar cambios en el formulario
  const watchedValue = watch(name as Path<TFieldValues>);

  // Función para realizar búsqueda dinámica
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchFunction || !searchTerm.trim()) {
      setSearchItems([]);
      setIsSearching(false);
      return;
    }

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsSearching(true);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const result = await searchFunction(searchTerm);
      
      if (!abortController.signal.aborted) {
        setSearchItems(result.items || []);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error en búsqueda:', error);
        setSearchItems([]);
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsSearching(false);
      }
      abortControllerRef.current = null;
    }
  }, [searchFunction]);

  // Query de datos - manejo de undefined data y estructura con items
  const queryResult = useQuery();
  
  // Extraer items, manejando tanto arrays directos como objetos con estructura {items: [...]}
  let items: any[] = [];
  if (queryResult.data) {
    if (Array.isArray(queryResult.data)) {
      items = queryResult.data;
    } else if (queryResult.data && typeof queryResult.data === 'object') {
      const dataObj = queryResult.data as any;
      if ('items' in dataObj && Array.isArray(dataObj.items)) {
        items = dataObj.items;
      }
    }
  }

  // Usar items de búsqueda si hay un término de búsqueda activo
  const activeItems = searchTerm.trim() && searchFunction ? searchItems : items;
  const isLoading = searchTerm.trim() && searchFunction ? isSearching : queryResult.isLoading;
  const error = queryResult.error;

  // Filtrar items según la búsqueda
  const filteredItems = activeItems.filter(item => {
    if (searchTerm.trim() && searchFunction) return true;
    if (!searchTerm.trim()) return true;
    
    return searchFields.some(field => {
      const fieldValue = item[field];
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  // Efecto para inicializar con valores preseleccionados
  useEffect(() => {
    if (values && values.length > 0) {
      const firstItem = values[0];
      setSelectedItem(firstItem);
      setDisplayValue(firstItem[displayKey] as string);
      const value = firstItem[valueKey];
      setValue(name as Path<TFieldValues>, value as any, { shouldValidate: false });
    }
  }, [values, displayKey, valueKey, setValue, name]);

  // Efecto para sincronizar con cambios en el formulario cuando hay datos disponibles
  useEffect(() => {
    if (watchedValue && activeItems.length > 0 && !selectedItem && !isUserTyping) {
      const item = activeItems.find(i => (i[valueKey] as any) === watchedValue);
      if (item) {
        setSelectedItem(item);
        setDisplayValue(item[displayKey] as string);
      }
    }
  }, [watchedValue, activeItems, valueKey, displayKey, selectedItem, isUserTyping]);

  // Efecto para fetch inicial si es necesario
  useEffect(() => {
    if (fetchOnMount && !watchedValue && !selectedItem && items.length === 0 && !isLoading) {
      // Triggering a refetch or ensuring query runs
      queryResult.refetch?.();
    }
  }, [fetchOnMount, watchedValue, selectedItem, items.length, isLoading, queryResult]);

  // Efecto para obtener item por ID cuando hay un valor pero no items cargados
  useEffect(() => {
    const shouldFetchById = 
      watchedValue && 
      typeof watchedValue === 'number' && 
      !selectedItem && 
      !isUserTyping &&
      activeItems.length === 0 &&
      getByIdFunction &&
      !isLoading;

    if (shouldFetchById) {
      getByIdFunction(watchedValue).then(item => {
        if (item) {
          setSelectedItem(item);
          setDisplayValue(item[displayKey] as string);
        }
      }).catch(error => {
        console.error('Error al obtener elemento por ID:', error);
      });
    }
  }, [watchedValue, selectedItem, isUserTyping, activeItems.length, getByIdFunction, isLoading, displayKey]);

  // Limpiar selección cuando el valor del formulario se limpia externamente
  useEffect(() => {
    if (!watchedValue && selectedItem) {
      setSelectedItem(null);
      setDisplayValue('');
      setSearchTerm('');
    }
  }, [watchedValue, selectedItem]);

  // Función para limpiar selección
  const handleClear = useCallback(() => {
    setValue(name as Path<TFieldValues>, undefined as any, { shouldValidate: true });
    setSelectedItem(null);
    setDisplayValue('');
    setSearchTerm('');
    setIsOpen(false);
    setIsUserTyping(false);
  }, [setValue, name]);

  // Manejar selección de item
  const handleItemSelect = useCallback((item: TItem) => {
    const value = item[valueKey];
    setValue(name as Path<TFieldValues>, value as any, { shouldValidate: true });
    setSelectedItem(item);
    setDisplayValue(item[displayKey] as string);
    setSearchTerm('');
    setIsOpen(false);
    setIsUserTyping(false);
    onItemSelect?.(item);
  }, [setValue, name, valueKey, displayKey, onItemSelect]);

  // Manejar cambios en la búsqueda con debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsUserTyping(true);
    setSearchTerm(value);
    setDisplayValue(value);
    setIsOpen(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (searchFunction) {
      searchTimeoutRef.current = window.setTimeout(() => {
        performSearch(value);
      }, 300);
    }
  };

  // Manejar foco en input
  const handleInputFocus = () => {
    if (!selectedItem) {
      setIsUserTyping(true);
      setIsOpen(true);
    }
  };

  // Click fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsUserTyping(false);
        if (!selectedItem) {
          setDisplayValue('');
          setSearchTerm('');
        } else {
          setDisplayValue(selectedItem[displayKey] as string);
          setSearchTerm('');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, selectedItem, displayKey]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fieldName = name as Path<TFieldValues>;
  const fieldError = errors[fieldName];
  const showTextHelp = textHelp && !fieldError;

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          id={fieldName}
          type="text"
          value={displayValue}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!!selectedItem}
          className={`w-full px-3 py-2 pr-20 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
            fieldError 
              ? 'border-red-500 dark:border-red-500' 
              : 'border-gray-300 dark:border-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
            selectedItem ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''
          }`}
        />
        
        {/* Iconos de acción */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {selectedItem && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 ml-1"></div>
          ) : (
            <ChevronDown className={`w-4 h-4 text-gray-400 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && !selectedItem && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-4 h-4 inline mr-2" />
              Cargando...
            </div>
          ) : error ? (
            <div className="px-3 py-2 text-center text-red-500">
              Error al cargar datos
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item[valueKey] as any}
                type="button"
                onClick={() => handleItemSelect(item)}
                className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                  selectedItem && selectedItem[valueKey] === item[valueKey]
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {item[displayKey] as string}
              </button>
            ))
          )}
        </div>
      )}

      {/* Mensajes de error y ayuda */}
      {fieldError && (
        <span className="absolute left-0 top-full mt-1 text-xs text-red-500 leading-tight">
          {fieldError.message as string}
        </span>
      )}
      
      {showTextHelp && (
        <span className="absolute left-0 top-full mt-1 text-xs text-gray-500 dark:text-gray-400 leading-tight">
          {textHelp}
        </span>
      )}
    </div>
  );
}
