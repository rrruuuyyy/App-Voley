# Módulo de Usuarios - VoleyApp

Este módulo implementa la gestión completa de usuarios para la aplicación de voleibol, utilizando un patrón modular y reutilizable con paginación, filtrado, ordenamiento y operaciones CRUD.

## 🏗️ Arquitectura

El módulo está organizado siguiendo un patrón modular que separa responsabilidades:

```
src/pages/admin/modulos/usuarios/
├── api/
│   └── usuarioApi.ts              # Servicios de API
├── components/
│   ├── UserForm.tsx               # Formulario de usuario
│   └── ChangePasswordModal.tsx    # Modal para cambio de contraseña
├── hooks/
│   ├── useUsuarioQueries.ts       # Hooks de React Query
│   ├── useUsuarioPagination.ts    # Hook de paginación específico
│   └── useUsuarioTableColumns.ts  # Configuración de columnas
├── pages/
│   └── UsuariosLista.tsx          # Página principal
├── schemas/
│   └── usuario.schema.ts          # Esquemas de validación Zod
├── types/
│   └── index.ts                   # Tipos TypeScript
├── utils/
│   └── tableColumns.tsx           # Utilidades para columnas de tabla
└── index.ts                       # Punto de entrada del módulo
```

## 🧩 Componentes Core Reutilizables

### Paginación
Ubicación: `src/core/components/pagination/`

- **useGenericPagination**: Hook genérico para paginación con TanStack Query
- **PaginatePrincipalWithQuery**: Componente principal de paginación
- **PaginationFooter**: Footer con controles de límite y información
- **PaginateNavigation**: Navegación entre páginas y botón "Nuevo"
- **PaginateFilters**: Filtros por columnas

### Tabla
Ubicación: `src/core/components/table/`

- **SortableTable**: Tabla con ordenamiento, filtrado y personalización

## 🚀 Características Principales

### 1. Operaciones CRUD Completas
- ✅ Crear usuarios
- ✅ Editar usuarios
- ✅ Eliminar usuarios
- ✅ Cambiar contraseña
- ✅ Activar/Desactivar usuarios

### 2. Sistema de Paginación Avanzado
- Paginación servidor-side
- Filtrado por múltiples campos
- Ordenamiento por columnas
- Búsqueda en tiempo real
- Control de límite de resultados

### 3. Validación Robusta
- Esquemas de validación con Zod
- Validación en tiempo real
- Mensajes de error personalizados
- Validación de contraseña segura

### 4. Gestión de Estado
- TanStack Query para cache y sincronización
- Optimistic updates
- Invalidación automática de cache
- Loading states y error handling

## 🔧 Uso del Módulo

### Importar el módulo completo
```typescript
import { UsuariosLista } from './pages/admin/modulos/usuarios';
```

### Usar componentes individuales
```typescript
import { 
  UserForm, 
  useUsuarios, 
  UsuarioApiService 
} from './pages/admin/modulos/usuarios';
```

### Configurar en rutas
```typescript
<Route 
  path="/admin/usuarios" 
  element={
    <ProtectedRoute roles={['administrador']}>
      <UsuariosLista />
    </ProtectedRoute>
  } 
/>
```

## 🛠️ Tecnologías Utilizadas

- **React 19**: Framework principal
- **TypeScript**: Tipado estático
- **TanStack Query**: Gestión de estado del servidor
- **React Hook Form**: Gestión de formularios
- **Zod**: Validación de esquemas
- **Axios**: Cliente HTTP
- **Tailwind CSS**: Estilos

## 📋 API Endpoints

El módulo consume los siguientes endpoints:

```typescript
GET    /users              # Lista paginada con filtros
GET    /users/:id          # Usuario por ID
POST   /users              # Crear usuario
PATCH  /users/:id          # Actualizar usuario
DELETE /users/:id          # Eliminar usuario
PATCH  /users/:id/toggle-status  # Cambiar estado
PUT    /users/:id/change-password # Cambiar contraseña
GET    /users/lite         # Lista simplificada
GET    /users/activos      # Solo usuarios activos
```

## 🔄 Reutilización en Otros Proyectos

### Componentes Core Portables
Los componentes en `src/core/` están diseñados para ser reutilizables:

```typescript
// En cualquier proyecto
import { 
  useGenericPagination, 
  PaginatePrincipalWithQuery, 
  SortableTable 
} from '@/core/components';
```

### Hook de Paginación Genérico
```typescript
const useMiEntidadPagination = () => {
  return useGenericPagination({
    url: '/mi-entidad',
    getTableColumnsConfig: getMiEntidadTableColumns,
    queryFn: MiEntidadApiService.getMiEntidades,
    getQueryKey: (filters) => ['mi-entidad', filters],
    defaultSortBy: 'nombre',
    defaultSelectedField: 'nombre'
  });
};
```

### Configuración de Columnas
```typescript
export const getMiEntidadTableColumns = (): ExtendedTableColumn<MiEntidad>[] => {
  return [
    {
      key: 'nombre',
      name: 'Nombre',
      searchKey: 'nombre',
      sortable: true,
    },
    // ... más columnas
  ];
};
```

## 🧪 Testing

Para agregar tests al módulo:

```typescript
// usuarios.test.ts
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UsuariosLista } from './pages/UsuariosLista';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

test('renderiza la lista de usuarios', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <UsuariosLista />
    </QueryClientProvider>
  );
  
  expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
});
```

## 📝 Próximos Pasos

1. **Tests unitarios**: Agregar cobertura de tests
2. **Exportación de datos**: Función para exportar usuarios a Excel/CSV
3. **Importación masiva**: Subir usuarios desde archivos
4. **Auditoría**: Registro de cambios y histórico
5. **Roles granulares**: Sistema de permisos más detallado

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. Seguir la estructura modular existente
2. Mantener los componentes core genéricos
3. Agregar validaciones con Zod
4. Documentar nuevos hooks y componentes
5. Actualizar los tipos TypeScript

---

Este módulo de usuarios demuestra un patrón escalable y reutilizable que puede aplicarse a cualquier entidad del sistema (sedes, ligas, equipos, etc.).
