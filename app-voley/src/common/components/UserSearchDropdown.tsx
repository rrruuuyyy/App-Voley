import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import { UsuarioApiService } from '../../pages/admin/modulos/usuarios/api/usuarioApi';
import type { Usuario } from '../../pages/admin/modulos/usuarios/types';

interface UserSearchDropdownProps {
  onUserSelect: (user: Usuario) => void;
  selectedUsers?: Usuario[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearOnSelect?: boolean;
  filterRole?: string;
  excludeUserIds?: number[];
}

export const UserSearchDropdown: React.FC<UserSearchDropdownProps> = ({
  onUserSelect,
  selectedUsers = [],
  placeholder = "Buscar usuario...",
  disabled = false,
  className = "",
  clearOnSelect = true,
  filterRole,
  excludeUserIds = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // IDs de usuarios seleccionados para comparación rápida
  const selectedUserIds = selectedUsers.map(user => user.id);
  
  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setUsers([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const filters: any = {
          search: searchTerm,
          limit: 10,
          page: 1
        };
        
        // Agregar filtro por rol si se especifica
        if (filterRole) {
          filters.rol = filterRole;
        }
        
        const response = await UsuarioApiService.getUsuarios(filters);
        
        // Filtrar usuarios excluidos
        let filteredUsers = response.items;
        if (excludeUserIds.length > 0) {
          filteredUsers = response.items.filter((user: Usuario) => !excludeUserIds.includes(user.id));
        }
        
        setUsers(filteredUsers);
        setIsOpen(filteredUsers.length > 0);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Error al buscar usuarios');
        setUsers([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterRole, excludeUserIds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (user: Usuario) => {
    onUserSelect(user);
    
    if (clearOnSelect) {
      setSearchTerm('');
      setUsers([]);
    }
    
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setUsers([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const isUserSelected = (userId: number) => {
    return selectedUserIds.includes(userId);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={disabled}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {error ? (
            <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : users.length > 0 ? (
            <ul className="py-1">
              {users.map((user) => {
                const isSelected = isUserSelected(user.id);
                
                return (
                  <li key={user.id}>
                    <button
                      onClick={() => handleUserSelect(user)}
                      disabled={isSelected}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        isSelected 
                          ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed opacity-60' 
                          : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.nombre}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {user.correo}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                          {user.rol}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-xs">Seleccionado</span>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No se encontraron usuarios
            </div>
          )}
        </div>
      )}

      {/* Usuarios seleccionados (opcional) */}
      {selectedUsers.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Usuarios seleccionados ({selectedUsers.length}):
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedUsers.map((user) => (
              <span
                key={user.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {user.nombre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
