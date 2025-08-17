# Módulo de Sedes - VoleyApp

Este módulo implementa la gestión completa de sedes para la aplicación de voleibol, utilizando el mismo patrón modular y reutilizable que el módulo de usuarios con paginación, filtrado, ordenamiento y operaciones CRUD.

## 🏗️ Arquitectura

El módulo está organizado siguiendo el mismo patrón modular que el módulo de usuarios:

```
src/pages/admin/modulos/sedes/
├── api/
│   └── sedeApi.ts                 # Servicios de API
├── components/
│   └── SedeForm.tsx               # Formulario de sede
├── hooks/
│   ├── useSedeQueries.ts          # Hooks de React Query
│   ├── useSedePagination.ts       # Hook de paginación específico
│   └── useSedeTableColumns.ts     # Configuración de columnas
├── pages/
│   └── SedesLista.tsx             # Página principal
├── schemas/
│   └── sede.schema.ts             # Esquemas de validación Zod
├── types/
│   └── index.ts                   # Tipos TypeScript
├── utils/
│   └── tableColumns.tsx           # Utilidades para columnas de tabla
├── index.ts                       # Punto de entrada del módulo
└── README.md                      # Esta documentación
```

## 🚀 Características Principales

### 1. Operaciones CRUD Completas
- ✅ Crear sedes
- ✅ Leer sedes con paginación y filtros
- ✅ Actualizar sedes existentes
- ✅ Eliminar sedes (desactivación)
- ✅ Cambiar estado activo/inactivo

### 2. Sistema de Paginación Avanzado
- **Paginación servidor**: Reduce carga de red y memoria
- **Filtros dinámicos**: Búsqueda por nombre, dirección, teléfono
- **Ordenamiento**: Por cualquier columna sorteable
- **Límites configurables**: 10, 25, 50, 100 elementos por página
- **Navegación intuitiva**: Controles de página anterior/siguiente

### 3. Validación Robusta
- **Esquemas Zod**: Validación en tiempo real del formulario
- **Validación servidor**: Manejo de errores de API
- **Feedback visual**: Mensajes de error específicos por campo

### 4. Interfaz de Usuario Optimizada
- **Responsive design**: Adaptable a diferentes tamaños de pantalla
- **Dark mode**: Soporte completo para tema oscuro
- **Loading states**: Indicadores de carga en operaciones asíncronas
- **Confirmaciones**: Dialogs de confirmación para acciones destructivas

## 🎯 Campos de Sede

| Campo | Tipo | Validación | Descripción |
|-------|------|------------|-------------|
| `nombre` | string | Requerido, 1-100 chars | Nombre de la sede |
| `direccion` | string | Requerido, 1-255 chars | Dirección completa |
| `telefono` | string | Opcional, max 20 chars | Teléfono de contacto |
| `numeroCancha` | number | Requerido, 1-50 | Cantidad de canchas |
| `active` | boolean | Requerido | Estado activo/inactivo |

## 📋 API Endpoints Utilizados

Según la documentación de la API, este módulo utiliza:

- `GET /sede` - Lista paginada de sedes
- `GET /sede/{id}` - Obtener sede por ID
- `POST /sede` - Crear nueva sede
- `PATCH /sede/{id}` - Actualizar sede
- `DELETE /sede/{id}` - Eliminar sede (desactivar)

### Ejemplo de datos de sede:

```json
{
  "id": 1,
  "nombre": "Polideportivo Central",
  "direccion": "Av. Principal 123, Centro, Ciudad",
  "telefono": "+591 555-0123",
  "numeroCancha": 2,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔄 Flujo de Trabajo

### Crear Nueva Sede
1. Click en "Nueva Sede"
2. Llenar formulario con validación en tiempo real
3. Submit → Validación Zod → API call → Actualización cache
4. Cierre automático del modal y refresh de datos

### Editar Sede Existente
1. Click en botón "Editar" en la fila de la tabla
2. Modal se abre con datos pre-cargados
3. Modificar campos necesarios
4. Submit → Validación → API call → Actualización cache

### Eliminar Sede
1. Click en botón "Eliminar"
2. Confirmación con dialog nativo
3. API call → Eliminación suave (desactivación)
4. Actualización automática de la tabla

### Cambiar Estado
1. Click en badge de estado en la tabla
2. Toggle automático activo ↔ inactivo
3. Feedback visual inmediato

## 🎨 Componentes UI

### SedeForm
- Formulario reutilizable para crear/editar
- Validación con React Hook Form + Zod
- Estados de loading integrados
- Modo claro/oscuro

### SedesLista
- Tabla sorteable con columnas personalizables
- Paginación integrada con TanStack Query
- Búsqueda y filtros en tiempo real
- Acciones por fila (ver, editar, eliminar)

## 🔧 Hooks Personalizados

### useSedeQueries
- `useSedes()` - Lista paginada con filtros
- `useSede(id)` - Sede individual por ID
- `useSedesLite()` - Lista simplificada para selects
- `useCreateSede()` - Crear nueva sede
- `useUpdateSede()` - Actualizar sede
- `useDeleteSede()` - Eliminar sede
- `useToggleSedeStatus()` - Cambiar estado

### useSedePagination
- Encapsula toda la lógica de paginación
- Integración completa con TanStack Query
- Estado persistente durante la sesión
- Optimizaciones de rendimiento

## 🧪 Testing

Para testing, el módulo incluye:
- **Tipos TypeScript**: Verificación estática de tipos
- **Validación Zod**: Esquemas reutilizables para testing
- **API mocks**: Estructura clara para mockear servicios
- **Componentes aislados**: Fácil testing unitario

## 🔗 Integración

### Uso en rutas:
```tsx
import { SedesLista } from './pages/admin/modulos/sedes';

// En el router
<Route path="/admin/sedes" element={<SedesLista />} />
```

### Uso como selector:
```tsx
import { useSedesLite } from './pages/admin/modulos/sedes';

const { data: sedes } = useSedesLite();
```

## 📚 Extensibilidad

El módulo está diseñado para ser fácilmente extensible:

1. **Nuevos campos**: Agregar en types, schema, form y columnas
2. **Nuevas validaciones**: Extender esquemas Zod
3. **Nuevas operaciones**: Agregar hooks y servicios API
4. **Nueva UI**: Componentes modulares y reutilizables

## 🔒 Permisos

- Solo usuarios con rol `ADMINISTRADOR` pueden gestionar sedes
- Validación de permisos en backend
- UI condicional basada en roles de usuario

---

Este módulo sigue exactamente el mismo patrón que el módulo de usuarios, garantizando consistencia y mantenibilidad en toda la aplicación.
