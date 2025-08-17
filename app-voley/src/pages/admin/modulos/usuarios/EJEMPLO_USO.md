# Ejemplo: Cómo crear un módulo con paginación

Este ejemplo muestra cómo usar los componentes core de paginación para crear un nuevo módulo (ej: Equipos).

## 1. Crear los tipos

```typescript
// src/pages/admin/modulos/equipos/types/index.ts
export interface Equipo {
  id: number;
  nombre: string;
  liga: string;
  capitanId: number;
  fechaCreacion: string;
  activo: boolean;
}

export interface CreateEquipoRequest {
  nombre: string;
  ligaId: number;
  capitanId: number;
}
```

## 2. Crear el servicio API

```typescript
// src/pages/admin/modulos/equipos/api/equipoApi.ts
import axios from 'axios';
import type { Equipo, CreateEquipoRequest } from '../types';
import type { ResponsePaginate, ListFiltersPaginate } from '../../../../../core/components/pagination';
import { createParamsPaginate } from '../../../../../core/components/pagination';

export class EquipoApiService {
  static async getEquipos(filters: ListFiltersPaginate = {}): Promise<ResponsePaginate<Equipo>> {
    const params = createParamsPaginate(filters);
    const queryString = params.toString();
    const url = queryString ? `/equipos?${queryString}` : '/equipos';
    
    const response = await axios.get<ResponsePaginate<Equipo>>(url);
    return response.data;
  }

  static async createEquipo(data: CreateEquipoRequest): Promise<Equipo> {
    const response = await axios.post<Equipo>('/equipos', data);
    return response.data;
  }
  
  // ... más métodos
}
```

## 3. Configurar las columnas de tabla

```typescript
// src/pages/admin/modulos/equipos/hooks/useEquipoTableColumns.ts
import type { ExtendedTableColumn } from '../../../../../core/components/pagination';
import type { Equipo } from '../types';

export const getEquipoTableColumnsConfig = (): ExtendedTableColumn<Equipo>[] => {
  return [
    {
      key: 'nombre',
      name: 'Nombre del Equipo',
      searchKey: 'nombre',
      sortable: true,
      className: 'font-medium',
    },
    {
      key: 'liga',
      name: 'Liga',
      searchKey: 'liga',
      sortable: true,
    },
    {
      key: 'activo',
      name: 'Estado',
      sortable: true,
      className: 'text-center',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'fechaCreacion',
      name: 'Fecha de Creación',
      sortable: true,
      render: (value: string) => {
        return new Date(value).toLocaleDateString('es-ES');
      }
    }
  ];
};
```

## 4. Crear el hook de paginación

```typescript
// src/pages/admin/modulos/equipos/hooks/useEquipoPagination.ts
import { useGenericPagination } from '../../../../../core/components/pagination';
import { EquipoApiService } from '../api/equipoApi';
import { queryKeys } from '../../../../../core/query/queryClient';
import type { Equipo } from '../types';
import { getEquipoTableColumnsConfig } from './useEquipoTableColumns';

export const useEquipoPagination = (props = {}) => {
  return useGenericPagination<Equipo>({
    url: '/equipos',
    getTableColumnsConfig: getEquipoTableColumnsConfig,
    queryFn: EquipoApiService.getEquipos,
    getQueryKey: (filters) => queryKeys.equipos(filters), // Agregar a queryKeys
    defaultSortBy: 'nombre',
    defaultSelectedField: 'nombre'
  }, props);
};
```

## 5. Crear los hooks de React Query

```typescript
// src/pages/admin/modulos/equipos/hooks/useEquipoQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EquipoApiService } from '../api/equipoApi';
import { queryKeys } from '../../../../../core/query/queryClient';

export const useEquipos = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.equipos(filters),
    queryFn: () => EquipoApiService.getEquipos(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useCreateEquipo = (options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: EquipoApiService.createEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    ...options,
  });
};
```

## 6. Crear la página principal

```typescript
// src/pages/admin/modulos/equipos/pages/EquiposLista.tsx
import React, { useState } from 'react';
import { PaginatePrincipalWithQuery, SortableTable } from '../../../../../core/components';
import { useEquipoPagination } from '../hooks/useEquipoPagination';
import { useCreateEquipo, useDeleteEquipo } from '../hooks/useEquipoQueries';

const EquiposLista: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  
  const {
    data: equipos,
    meta,
    isLoading,
    error,
    state,
    searchFields,
    updateSearch,
    updateSelectedFields,
    // ... más propiedades
  } = useEquipoPagination();
  
  const createMutation = useCreateEquipo();
  const deleteMutation = useDeleteEquipo();

  const columns = [
    ...getEquipoTableColumnsConfig(),
    {
      key: 'actions',
      name: 'Acciones',
      render: (_, record) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(record.id)}>
            Editar
          </button>
          <button onClick={() => handleDelete(record.id)}>
            Eliminar
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Equipos</h1>
      
      <PaginatePrincipalWithQuery
        fields={searchFields}
        state={state}
        meta={meta}
        isLoading={isLoading}
        updateSearch={updateSearch}
        updateSelectedFields={updateSelectedFields}
        // ... más props
        onAdd={() => setShowForm(true)}
      >
        <SortableTable
          columns={columns}
          data={equipos}
          loading={isLoading}
          emptyMessage="No hay equipos registrados"
        />
      </PaginatePrincipalWithQuery>
    </div>
  );
};

export default EquiposLista;
```

## 7. Agregar al queryKeys

```typescript
// src/core/query/queryClient.ts
export const queryKeys = {
  all: ['queries'] as const,
  users: (filters?: any) => [...queryKeys.all, 'users', filters] as const,
  equipos: (filters?: any) => [...queryKeys.all, 'equipos', filters] as const,
  // ... más entidades
};
```

## Características que obtienes automáticamente:

✅ **Paginación completa** con navegación y footer  
✅ **Búsqueda en tiempo real** por campos configurables  
✅ **Filtros dinámicos** basados en las columnas  
✅ **Ordenamiento** por cualquier columna marcada como sortable  
✅ **Cache inteligente** con TanStack Query  
✅ **Loading states** y manejo de errores  
✅ **Responsive design** con Tailwind CSS  
✅ **TypeScript** completamente tipado  

## Personalización avanzada:

### Agregar filtros específicos
```typescript
const fieldsAnd = [
  { key: 'ligaId', keyForm: 'ligaId', name: 'Liga' },
  { key: 'activo', keyForm: 'activo', name: 'Estado' }
];

<PaginatePrincipalWithQuery
  fieldsAnd={fieldsAnd}
  // ... otras props
/>
```

### Customizar renderizado de celdas
```typescript
{
  key: 'capitan',
  name: 'Capitán',
  render: (_, record) => (
    <div className="flex items-center gap-2">
      <img src={record.capitan.avatar} className="w-8 h-8 rounded-full" />
      <span>{record.capitan.nombre}</span>
    </div>
  )
}
```

Esta estructura te permite crear módulos completos con mínimo código boilerplate, reutilizando toda la lógica de paginación, filtrado y ordenamiento.
