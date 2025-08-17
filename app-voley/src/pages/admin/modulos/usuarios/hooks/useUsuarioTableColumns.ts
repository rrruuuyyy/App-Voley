import React from 'react';
import type { ExtendedTableColumn } from '../../../../../core/components/pagination';
import type { Usuario, UserRole } from '../types';
import { UserRolesEnum } from '../types';

/**
 * Configuración de columnas base para usuarios
 * Esta configuración se puede usar tanto para tabla como para filtros de paginación
 */
export const getUsuarioTableColumnsConfig = (): ExtendedTableColumn<Usuario>[] => {
  return [
    {
      key: 'nombre',
      name: 'Nombre',
      searchKey: 'nombre',
      sortable: true,
      className: 'font-medium',
    },
    {
      key: 'correo',
      name: 'Correo Electrónico',
      searchKey: 'correo',
      sortable: true,
      className: 'text-sm'
    },
    {
      key: 'rol',
      name: 'Rol',
      searchKey: 'rol',
      sortable: true,
      className: 'text-center',
      render: (value: UserRole) => {
        const roleColors = {
          [UserRolesEnum.ADMINISTRADOR]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          [UserRolesEnum.ADMIN_LIGA]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          [UserRolesEnum.CAPITAN]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          [UserRolesEnum.JUGADOR]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        
        const roleLabels = {
          [UserRolesEnum.ADMINISTRADOR]: 'Administrador',
          [UserRolesEnum.ADMIN_LIGA]: 'Admin Liga',
          [UserRolesEnum.CAPITAN]: 'Capitán',
          [UserRolesEnum.JUGADOR]: 'Jugador',
        };

        return React.createElement(
          'span',
          { 
            className: `px-2 py-1 rounded-full text-xs font-medium ${roleColors[value] || 'bg-gray-100 text-gray-800'}` 
          },
          roleLabels[value] || value
        );
      }
    },
    {
      key: 'active',
      name: 'Estado',
      sortable: true,
      className: 'text-center',
      render: (value: boolean, record: Usuario) => {
        const isActive = value ?? record.isActive ?? true;
        return React.createElement(
          'span',
          {
            className: `px-2 py-1 rounded-full text-xs font-medium ${
              isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`
          },
          isActive ? 'Activo' : 'Inactivo'
        );
      }
    },
    {
      key: 'createdAt',
      name: 'Fecha de Creación',
      sortable: true,
      render: (value: string) => {
        if (!value) return 'Sin fecha';
        const date = new Date(value);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    }
  ];
};
