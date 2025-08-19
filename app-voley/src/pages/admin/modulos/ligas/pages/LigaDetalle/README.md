# LigaDetalle - Componente Refactorizado

## 📋 Visión General

El componente `LigaDetalle` ha sido completamente refactorizado para ser más modular, mantenible y escalable. Ahora está organizado en una estructura de carpetas que separa responsabilidades y facilita futuras implementaciones.

## 🏗️ Estructura del Proyecto

```
LigaDetalle/
├── components/
│   ├── index.ts                 # Exportaciones de componentes
│   ├── LigaInformacion.tsx      # Información general de la liga
│   ├── LigaCapitanes.tsx        # Lista y gestión de capitanes
│   ├── CapitanesModal.tsx       # Modal para asignar capitanes
│   └── CreateUserForm.tsx       # Formulario para crear usuarios
├── hooks/
│   ├── index.ts                 # Exportaciones de hooks
│   ├── useLigaDetalle.ts        # Hook principal con lógica del componente
│   └── useLigaActions.ts        # Hook para acciones de liga (iniciar/finalizar)
└── index.ts                     # Exportaciones principales
```

## 🧩 Componentes

### LigaInformacion
- **Responsabilidad**: Mostrar información general de la liga
- **Props**: `liga`
- **Características**:
  - Información de fechas, sede, administrador
  - Estado visual de la liga con colores
  - Descripción detallada

### LigaCapitanes
- **Responsabilidad**: Mostrar y gestionar la lista de capitanes
- **Props**: `capitanes`, `canManageCapitanes`, handlers
- **Características**:
  - Lista de capitanes con información de equipos
  - Botones de acción (crear/gestionar equipo, eliminar)
  - Estado visual de equipos (creado/sin crear)

### CapitanesModal
- **Responsabilidad**: Modal para asignar nuevos capitanes
- **Props**: estados del modal, handlers, configuración
- **Características**:
  - Búsqueda de usuarios existentes
  - Formulario para crear nuevos usuarios
  - Lista de capitanes seleccionados

### CreateUserForm
- **Responsabilidad**: Formulario para crear nuevos capitanes
- **Props**: form handlers, validación
- **Características**:
  - Validación con React Hook Form + Zod
  - Asignación automática de rol "Capitán"
  - Manejo de errores

## 🎣 Hooks Personalizados

### useLigaDetalle
Hook principal que maneja toda la lógica del componente:

```typescript
const {
  // Estados
  liga, capitanes, ligaLoading, ligaError,
  showCapitanesModal, selectedCapitanes,
  showCreateUserForm, showEquipoModal,
  
  // Mutations
  asignarCapitanesMutation,
  createUsuarioMutation,
  eliminarCapitanMutation,
  
  // Handlers
  handleOpenCapitanesModal,
  handleSaveCapitanes,
  handleCreateCapitan,
  // ... más handlers
  
  // Utilidades
  canManageCapitanes,
  canEditLiga,
  currentCapitanesIds
} = useLigaDetalle();
```

### useLigaActions
Hook especializado para acciones de liga:

```typescript
const {
  iniciarLigaMutation,
  finalizarLigaMutation,
  handleIniciarLiga,
  handleFinalizarLiga
} = useLigaActions();
```

## 🔒 Gestión de Permisos

El sistema maneja permisos basados en el estado de la liga:

- **canManageCapitanes**: Solo cuando la liga está "PROGRAMADA"
- **canEditLiga**: Solo cuando la liga está "PROGRAMADA"  
- **canStartLiga**: Liga "PROGRAMADA" + tiene capitanes
- **canFinishLiga**: Liga "EN_CURSO"

## 🎯 Beneficios de la Refactorización

### ✅ Modularidad
- Cada componente tiene una responsabilidad específica
- Fácil reutilización en otros contextos
- Testing más sencillo y enfocado

### ✅ Mantenibilidad
- Código más legible y organizado
- Separación clara de concerns
- Hooks reutilizables

### ✅ Escalabilidad
- Estructura preparada para nuevas funcionalidades
- Fácil agregar nuevos componentes/hooks
- Patrones consistentes

### ✅ Developer Experience
- Intellisense mejorado
- Imports más claros
- Documentación integrada

## 🚀 Próximas Implementaciones

La estructura está preparada para:

1. **Gestión de Partidos** - Componente `LigaPartidos`
2. **Estadísticas Avanzadas** - Componente `LigaEstadisticas`
3. **Calendario de Liga** - Componente `LigaCalendario`
4. **Clasificación** - Componente `LigaClasificacion`
5. **Configuración de Liga** - Hook `useLigaSettings`

## 📝 Uso

```typescript
import LigaDetalle from './pages/admin/modulos/ligas/pages/LigaDetalle';

// O importar componentes específicos
import { 
  LigaInformacion, 
  LigaCapitanes, 
  useLigaDetalle 
} from './pages/admin/modulos/ligas/pages/LigaDetalle';
```

## 🔄 Migración

El componente mantiene la misma API externa, por lo que no se requieren cambios en:
- Rutas existentes
- Componentes padre
- Props del componente principal

La refactorización es completamente transparente para el resto de la aplicación.
