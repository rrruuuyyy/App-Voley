# Componente PageHeader

El componente `PageHeader` es un header reutilizable para todas las páginas de la aplicación que proporciona una interfaz consistente con título, subtítulo, acciones y controles.

## Características

- ✅ Título y subtítulo personalizables
- ✅ Toggle de dark mode integrado
- ✅ Indicador de estado con animación
- ✅ Soporte para acciones personalizadas (botones, etc.)
- ✅ Totalmente responsive
- ✅ Soporte para dark mode
- ✅ TypeScript completo

## Uso Básico

```tsx
import { PageHeader } from '../common';

<PageHeader 
  title="Mi Página"
  subtitle="Descripción de la página"
/>
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `title` | `string` | ✅ | Título principal de la página |
| `subtitle` | `string` | ❌ | Subtítulo opcional |
| `actions` | `React.ReactNode` | ❌ | Botones o elementos de acción |
| `showDarkModeToggle` | `boolean` | ❌ | Mostrar toggle de dark mode (default: true) |
| `statusIndicator` | `StatusIndicator` | ❌ | Indicador de estado del sistema |
| `className` | `string` | ❌ | Clases CSS adicionales |

### StatusIndicator

```tsx
interface StatusIndicator {
  label: string;
  color: 'green' | 'blue' | 'yellow' | 'red';
  isActive?: boolean; // Muestra animación de pulso
}
```

## Ejemplos de Uso

### Dashboard con Estado
```tsx
<PageHeader 
  title="Dashboard Administrador"
  subtitle="Gestión general del sistema"
  statusIndicator={{
    label: "Sistema Activo",
    color: "green",
    isActive: true
  }}
/>
```

### Página con Acción
```tsx
<PageHeader 
  title="Gestión de Usuarios"
  subtitle="Administra todos los usuarios del sistema"
  actions={
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
      <Plus className="h-4 w-4" />
      <span>Nuevo Usuario</span>
    </button>
  }
/>
```

### Múltiples Acciones
```tsx
<PageHeader 
  title="Panel de Control"
  subtitle="Herramientas de administración"
  actions={
    <>
      <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg">
        Exportar
      </button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Configurar
      </button>
    </>
  }
/>
```

### Sin Dark Mode Toggle
```tsx
<PageHeader 
  title="Página Especial"
  subtitle="Sin control de tema"
  showDarkModeToggle={false}
/>
```

## Colores de Estado

- **green**: Sistema activo, operación exitosa
- **blue**: Información, estado normal
- **yellow**: Advertencia, mantenimiento
- **red**: Error, problema

## Layout

El PageHeader se integra perfectamente en el layout de páginas:

```tsx
return (
  <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
    <PageHeader 
      title="Mi Página"
      subtitle="Descripción"
    />
    
    {/* Resto del contenido */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Cards, etc. */}
    </div>
  </div>
);
```

## Mejores Prácticas

1. **Títulos claros**: Usa títulos descriptivos y concisos
2. **Subtítulos útiles**: Proporciona contexto adicional cuando sea necesario
3. **Acciones relevantes**: Solo incluye acciones principales en el header
4. **Estados apropiados**: Usa indicadores de estado cuando aporten valor
5. **Consistencia**: Mantén el mismo patrón en todas las páginas

## Integración con Dark Mode

El componente funciona automáticamente con el sistema de temas de la aplicación. No necesitas configuración adicional para el dark mode.
