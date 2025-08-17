import { useMemo } from 'react';
import type { ExtendedTableColumn } from '../../../../../core/components/pagination';
import type { Sede } from '../types';

/**
 * Hook que define la configuración de columnas para la tabla de sedes
 */
export const useSedeTableColumns = () => {
  return useMemo<ExtendedTableColumn<Sede>[]>(() => [
    {
      key: 'nombre',
      searchKey: 'nombre',
      name: 'Nombre',
      sortable: true,
      width: '25%',
    },
    {
      key: 'direccion',
      searchKey: 'direccion',
      name: 'Dirección',
      sortable: true,
      width: '30%',
    },
    {
      key: 'telefono',
      searchKey: 'telefono',
      name: 'Teléfono',
      sortable: false,
      width: '15%',
    },
    {
      key: 'numeroCancha',
      searchKey: 'numeroCancha',
      name: 'Nº Canchas',
      sortable: true,
      width: '12%',
    },
    {
      key: 'isActive',
      searchKey: 'active',
      name: 'Estado',
      sortable: true,
      width: '10%',
    },
    {
      key: 'actions',
      name: 'Acciones',
      sortable: false,
      width: '8%',
    },
  ], []);
};

/**
 * Función que retorna la configuración de columnas (para usar con useGenericPagination)
 */
export const getSedeTableColumnsConfig = (): ExtendedTableColumn<Sede>[] => [
  {
    key: 'nombre',
    searchKey: 'nombre',
    name: 'Nombre',
    sortable: true,
    width: '25%',
  },
  {
    key: 'direccion',
    searchKey: 'direccion',
    name: 'Dirección',
    sortable: true,
    width: '30%',
  },
  {
    key: 'telefono',
    searchKey: 'telefono',
    name: 'Teléfono',
    sortable: false,
    width: '15%',
  },
  {
    key: 'numeroCancha',
    searchKey: 'numeroCancha',
    name: 'Nº Canchas',
    sortable: true,
    width: '12%',
  },
  {
    key: 'isActive',
    searchKey: 'active',
    name: 'Estado',
    sortable: true,
    width: '10%',
  },
  {
    key: 'actions',
    name: 'Acciones',
    sortable: false,
    width: '8%',
  },
];
