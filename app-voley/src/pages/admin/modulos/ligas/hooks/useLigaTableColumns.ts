import { useMemo } from 'react';
import type { ExtendedTableColumn } from '../../../../../core/components/pagination';
import type { Liga } from '../types';

/**
 * Hook que define la configuración de columnas para la tabla de ligas
 */
export const useLigaTableColumns = () => {
  return useMemo<ExtendedTableColumn<Liga>[]>(() => [
    {
      key: 'nombre',
      searchKey: 'nombre',
      name: 'Nombre',
      sortable: true,
      width: '20%',
    },
    {
      key: 'descripcion',
      searchKey: 'descripcion',
      name: 'Descripción',
      sortable: false,
      width: '25%',
    },
    {
      key: 'status',
      searchKey: 'status',
      name: 'Estado',
      sortable: true,
      width: '12%',
    },
    {
      key: 'fechaInicio',
      searchKey: 'fechaInicio',
      name: 'Fecha Inicio',
      sortable: true,
      width: '12%',
    },
    {
      key: 'fechaFin',
      searchKey: 'fechaFin',
      name: 'Fecha Fin',
      sortable: true,
      width: '12%',
    },
    {
      key: 'sede',
      searchKey: 'sede.nombre',
      name: 'Sede',
      sortable: false,
      width: '15%',
    },
    {
      key: 'actions',
      name: 'Acciones',
      sortable: false,
      width: '4%',
    },
  ], []);
};

/**
 * Función que retorna la configuración de columnas (para usar con useGenericPagination)
 */
export const getLigaTableColumnsConfig = (): ExtendedTableColumn<Liga>[] => [
  {
    key: 'nombre',
    searchKey: 'nombre',
    name: 'Nombre',
    sortable: true,
    width: '20%',
  },
  {
    key: 'descripcion',
    searchKey: 'descripcion',
    name: 'Descripción',
    sortable: false,
    width: '25%',
  },
  {
    key: 'status',
    searchKey: 'status',
    name: 'Estado',
    sortable: true,
    width: '12%',
  },
  {
    key: 'fechaInicio',
    searchKey: 'fechaInicio',
    name: 'Fecha Inicio',
    sortable: true,
    width: '12%',
  },
  {
    key: 'fechaFin',
    searchKey: 'fechaFin',
    name: 'Fecha Fin',
    sortable: true,
    width: '12%',
  },
  {
    key: 'sede',
    searchKey: 'sede.nombre',
    name: 'Sede',
    sortable: false,
    width: '15%',
  },
  {
    key: 'actions',
    name: 'Acciones',
    sortable: false,
    width: '4%',
  },
];
