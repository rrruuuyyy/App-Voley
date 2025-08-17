# Implementación de Página de Detalles de Liga y Componente de Búsqueda de Usuarios

## 📋 Resumen

Se han implementado las siguientes funcionalidades:

### 1. **UserSearchDropdown** - Componente Reutilizable
- **Ubicación**: `src/common/components/UserSearchDropdown.tsx`
- **Funcionalidad**: Búsqueda dinámica de usuarios con dropdown
- **Características**:
  - Búsqueda en tiempo real con debounce (300ms)
  - Filtrado por rol específico
  - Exclusión de usuarios ya seleccionados
  - Visualización de usuarios seleccionados
  - Estados de carga y error
  - Manejo de clicks fuera del componente

### 2. **LigaDetalle** - Página de Información de Liga
- **Ubicación**: `src/pages/admin/modulos/ligas/pages/LigaDetalle.tsx`
- **Funcionalidad**: Vista detallada de una liga específica
- **Características**:
  - Información general de la liga
  - Gestión de capitanes (asignar/ver)
  - Acciones de liga (iniciar/finalizar)
  - Estados visuales según el status de la liga
  - Modal para asignar capitanes

## 🚀 Funcionalidades Implementadas

### Componente UserSearchDropdown

```tsx
<UserSearchDropdown
  onUserSelect={handleUserSelect}
  selectedUsers={selectedUsers}
  filterRole="capitan"
  excludeUserIds={currentCaptainIds}
  placeholder="Buscar capitanes..."
/>
```

**Props principales:**
- `onUserSelect`: Callback cuando se selecciona un usuario
- `selectedUsers`: Array de usuarios ya seleccionados
- `filterRole`: Filtrar por rol específico (ej: "capitan")
- `excludeUserIds`: Excluir usuarios específicos
- `placeholder`: Texto del placeholder

### Página LigaDetalle

**Secciones principales:**

1. **Header con acciones**:
   - Botón "Volver" a la lista de ligas
   - Botón "Editar" (solo en estado programada)
   - Botón "Iniciar Liga" (solo en estado programada)
   - Botón "Finalizar Liga" (solo en estado en_curso)

2. **Información General**:
   - Fechas de inicio y fin
   - Sede asignada
   - Administrador de liga
   - Configuración (vueltas, grupos, sistema de puntos)
   - Estadísticas calculadas (cuando la liga está iniciada)

3. **Gestión de Capitanes**:
   - Lista de capitanes asignados
   - Botón "Asignar Capitanes" (solo en estado programada)
   - Modal para búsqueda y asignación de capitanes

## 🔗 Navegación Implementada

### Rutas Agregadas
```tsx
// En App.tsx
<Route 
  path="/admin/ligas/:id" 
  element={
    <ProtectedRoute roles={['administrador']}>
      <LigaDetalle />
    </ProtectedRoute>
  } 
/>
```

### Navegación desde Lista
```tsx
// En LigasLista.tsx
const handleViewDetails = (id: number) => {
  navigate(`/admin/ligas/${id}`);
};
```

## 📦 Archivos Modificados/Creados

### Archivos Nuevos
1. `src/common/components/UserSearchDropdown.tsx`
2. `src/pages/admin/modulos/ligas/pages/LigaDetalle.tsx`
3. `USER_SEARCH_DROPDOWN_DOCUMENTATION.md`

### Archivos Modificados
1. `src/common/components/index.ts` - Exportar UserSearchDropdown
2. `src/pages/admin/modulos/ligas/index.ts` - Exportar LigaDetalle
3. `src/pages/admin/modulos/ligas/pages/LigasLista.tsx` - Navegación a detalles
4. `src/App.tsx` - Ruta para página de detalles

## 🎯 Flujo de Uso

### Asignar Capitanes a una Liga

1. **Navegar a lista de ligas**: `/admin/ligas`
2. **Ver detalles**: Click en "Ver detalles" de una liga
3. **Asignar capitanes**: Click en "Asignar Capitanes" (solo ligas programadas)
4. **Buscar usuarios**: Escribir en el campo de búsqueda
5. **Filtrar por rol**: Automáticamente filtra solo usuarios con rol "capitan"
6. **Seleccionar**: Click en un usuario para agregarlo a la selección
7. **Quitar si es necesario**: Click en "Quitar" en la lista de seleccionados
8. **Guardar**: Click en "Asignar X Capitán(es)"

### Estados de Liga y Acciones Disponibles

| Estado | Editar | Asignar Capitanes | Iniciar | Finalizar |
|--------|--------|-------------------|---------|-----------|
| Programada | ✅ | ✅ | ✅ | ❌ |
| En Curso | ❌ | ❌ | ❌ | ✅ |
| Finalizada | ❌ | ❌ | ❌ | ❌ |
| Cancelada | ❌ | ❌ | ❌ | ❌ |

## 🔌 Integración con API

### Endpoints Utilizados
- `GET /usuario` - Búsqueda de usuarios con filtros
- `GET /liga/:id` - Información de liga específica
- `GET /liga/:id/capitanes` - Capitanes asignados a la liga
- `POST /liga/:id/capitanes` - Asignar capitanes a la liga
- `PUT /liga/:id/iniciar` - Iniciar liga
- `PUT /liga/:id/finalizar` - Finalizar liga

### Hooks TanStack Query Utilizados
- `useLiga(id)` - Obtener información de liga
- `useCapitanesLiga(id)` - Obtener capitanes de liga
- `useAsignarCapitanes()` - Asignar capitanes
- `useIniciarLiga()` - Iniciar liga
- `useFinalizarLiga()` - Finalizar liga

## 🎨 Estilos y UX

### Componente UserSearchDropdown
- **Estados visuales**: Usuarios seleccionados aparecen deshabilitados con check verde
- **Loading**: Spinner durante búsqueda
- **Error**: Mensaje de error en caso de fallo
- **Responsive**: Adaptable a diferentes tamaños de pantalla

### Página LigaDetalle
- **Status badges**: Colores diferentes según el estado de la liga
- **Acciones contextuales**: Solo se muestran botones relevantes al estado
- **Loading states**: Spinners en botones durante operaciones
- **Cards organizadas**: Información agrupada en secciones claras

## 🛡️ Validaciones

### UserSearchDropdown
- Mínimo 2 caracteres para buscar
- Previene selección duplicada
- Excluye usuarios ya asignados

### LigaDetalle
- Validación de permisos por estado de liga
- Confirmación para acciones críticas (iniciar/finalizar)
- Mínimo 1 capitán requerido para asignar

## 🔄 Estado y Gestión de Datos

### Cache de TanStack Query
- Invalidación automática tras mutaciones
- Sincronización entre vista lista y detalle
- Optimistic updates para mejor UX

### Estado Local
- Gestión de modales y formularios
- Control de usuarios seleccionados temporalmente
- Manejo de estados de carga

## 📝 Próximos Pasos Sugeridos

1. **Implementar edición de liga**: Modal o página para modificar datos de liga
2. **Gestión de equipos**: Vista para ver/gestionar equipos de la liga
3. **Calendario de partidos**: Vista de fixtures y resultados
4. **Tabla de posiciones**: Ranking de equipos
5. **Estadísticas avanzadas**: Métricas detalladas de la liga
