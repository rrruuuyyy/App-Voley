# Componentes de Formulario Reutilizables - VoleyApp

## Descripción
Sistema de componentes de formulario reutilizables construidos sobre React Hook Form y Zod para una gestión consistente de formularios en toda la aplicación.

## Componentes Disponibles

### 1. FormWrapper
Wrapper principal que proporciona contexto de formulario y validación con Zod.

```tsx
import { FormWrapper } from '../../common';
import { mySchema } from './schemas';

<FormWrapper
  schema={mySchema}
  onSubmit={handleSubmit}
  defaultValues={defaultValues}
>
  {(methods) => {
    const { setValue, watch } = methods;
    return (
      <div>
        {/* Contenido del formulario */}
      </div>
    );
  }}
</FormWrapper>
```

#### Props:
- `schema`: Schema de Zod para validación
- `onSubmit`: Función que se ejecuta al enviar el formulario
- `defaultValues`: Valores por defecto del formulario
- `children`: Función render que recibe los métodos de React Hook Form
- `className`: Clases CSS adicionales
- `renderAsDiv`: Si renderizar como div en lugar de form (para secciones anidadas)

### 2. FormWrapperInput
Componente de input con validación integrada.

```tsx
<FormWrapperInput
  name="nombre"
  label="Nombre"
  type="text"
  required
  placeholder="Ingrese el nombre"
  disabled={loading}
  textHelp="Texto de ayuda opcional"
/>
```

#### Props:
- `name`: Nombre del campo (debe coincidir con el schema)
- `label`: Etiqueta del campo
- `type`: Tipo de input (text, number, email, password, date, etc.)
- `required`: Si el campo es requerido
- `placeholder`: Texto placeholder
- `disabled`: Si el campo está deshabilitado
- `textHelp`: Texto de ayuda que aparece debajo del input
- `min`, `max`, `step`: Atributos para inputs numéricos

### 3. FormWrapperSelect
Componente de select con opciones estáticas.

```tsx
const options = [
  { value: 'opcion1', label: 'Opción 1' },
  { value: 'opcion2', label: 'Opción 2' },
];

<FormWrapperSelect
  name="categoria"
  label="Categoría"
  options={options}
  required
  placeholder="Seleccione una opción"
  disabled={loading}
  isNumber={false} // Si el valor debe ser numérico
/>
```

#### Props:
- `name`: Nombre del campo
- `label`: Etiqueta del select
- `options`: Array de opciones con `value` y `label`
- `required`: Si el campo es requerido
- `placeholder`: Texto cuando no hay selección
- `disabled`: Si está deshabilitado
- `textHelp`: Texto de ayuda
- `isNumber`: Si convertir el valor a número

### 4. FormWrapperTextArea
Componente de textarea con validación.

```tsx
<FormWrapperTextArea
  name="descripcion"
  label="Descripción"
  placeholder="Ingrese la descripción"
  rows={4}
  required
  disabled={loading}
/>
```

#### Props:
- `name`: Nombre del campo
- `label`: Etiqueta del textarea
- `placeholder`: Texto placeholder
- `rows`: Número de filas
- `required`: Si es requerido
- `disabled`: Si está deshabilitado
- `textHelp`: Texto de ayuda

### 5. FormWrapperSelectHttp
Componente de select con búsqueda y carga de datos dinámicos vía HTTP.

```tsx
import { useSedesLite } from './hooks/useSedeQueries';

<FormWrapperSelectHttp
  name="sedeId"
  label="Sede"
  required
  placeholder="Buscar sede..."
  useQuery={useSedesLite}
  textHelp="Selecciona la sede principal"
  disabled={loading}
  searchFields={['nombre', 'codigo']}
  valueKey="id"
  displayKey="nombre"
  onItemSelect={(sede) => console.log('Sede seleccionada:', sede)}
/>
```

#### Props:
- `name`: Nombre del campo
- `label`: Etiqueta del campo
- `required`: Si es requerido
- `placeholder`: Texto placeholder
- `useQuery`: Hook de TanStack Query que retorna los datos
- `textHelp`: Texto de ayuda
- `disabled`: Si está deshabilitado
- `searchFields`: Campos por los que buscar (por defecto: ['nombre'])
- `valueKey`: Campo que se usa como valor (por defecto: 'id')
- `displayKey`: Campo que se muestra al usuario (por defecto: 'nombre')
- `onItemSelect`: Callback cuando se selecciona un item

## Ejemplo Completo: Formulario de Liga

```tsx
import React from 'react';
import { 
  FormWrapper, 
  FormWrapperInput, 
  FormWrapperSelect, 
  FormWrapperTextArea,
  FormWrapperSelectHttp 
} from '../../common';
import { ligaSchema } from './schemas';
import { useSedesLite } from '../sedes/hooks/useSedeQueries';

export const LigaForm = ({ initialData, onSubmit, loading }) => {
  const sistemaPuntosOptions = [
    { value: 'fivb', label: 'Sistema FIVB (3-1-0)' },
    { value: 'simple', label: 'Sistema Simple (1-0)' },
  ];

  return (
    <FormWrapper
      schema={ligaSchema}
      onSubmit={onSubmit}
      defaultValues={initialData}
    >
      {(methods) => {
        const { watch } = methods;
        const fechaInicio = watch('fechaInicio');

        return (
          <div className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormWrapperInput
                  name="nombre"
                  label="Nombre de la Liga"
                  required
                  placeholder="Ej: Liga Juvenil 2024"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <FormWrapperTextArea
                  name="descripcion"
                  label="Descripción"
                  placeholder="Descripción de la liga..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormWrapperSelect
                name="sistemaPuntos"
                label="Sistema de Puntos"
                options={sistemaPuntosOptions}
                required
                disabled={loading}
              />

              <FormWrapperSelectHttp
                name="sedeId"
                label="Sede Principal"
                required
                placeholder="Buscar sede..."
                disabled={loading}
                useQuery={useSedesLite}
                textHelp="Selecciona la sede donde se realizarán los partidos"
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormWrapperInput
                name="fechaInicio"
                label="Fecha de Inicio"
                type="date"
                required
                disabled={loading}
              />

              <FormWrapperInput
                name="fechaFin"
                label="Fecha de Finalización"
                type="date"
                min={fechaInicio}
                required
                disabled={loading}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onCancel}>
                Cancelar
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        );
      }}
    </FormWrapper>
  );
};
```

## Características

### ✅ Ventajas:
- **Consistencia**: Todos los formularios tienen el mismo look & feel
- **Validación automática**: Integración directa con Zod
- **Manejo de errores**: Mensajes de error consistentes
- **Accesibilidad**: Labels, IDs y ARIA attributes automáticos
- **Responsive**: Diseño adaptativo incluido
- **Dark mode**: Soporte completo para modo oscuro
- **TypeScript**: Tipado estricto y autocompletado
- **Reutilizable**: Componentes modulares y extensibles

### 🎯 Casos de uso:
- Formularios CRUD de entidades
- Formularios de búsqueda y filtros
- Formularios de configuración
- Formularios multi-paso (con FormSection)

### 🔧 Personalización:
- **Estilos**: Usar `className` para estilos adicionales
- **Validación**: Personalizar schemas de Zod
- **Comportamiento**: Props específicas por componente
- **Datos dinámicos**: Hooks de TanStack Query compatibles

## Próximas mejoras:
- [ ] FormWrapperRadio - Componente de radio buttons
- [ ] FormWrapperCheckbox - Componente de checkboxes múltiples
- [ ] FormWrapperDateRange - Selector de rango de fechas
- [ ] FormWrapperFile - Upload de archivos
- [ ] FormWrapperAutocomplete - Autocompletado avanzado

---

**Nota**: Estos componentes están diseñados para trabajar con React Hook Form v7+ y Zod v3+. Son totalmente compatibles con el patrón establecido en la aplicación VoleyApp.
