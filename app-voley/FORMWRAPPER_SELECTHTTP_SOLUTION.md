# FormWrapperSelectHttp - Solución de Problemas de Datos

## Problemas Identificados y Solucionados

### 1. **Estructura de Datos de la API**
**Problema**: La API retornaba datos con estructura de paginación `{items: [...], meta: {...}}` pero el componente esperaba directamente un array.

**Solución**: 
- Modificamos `FormWrapperSelectHttp` para manejar ambos formatos:
  - Arrays directos: `[{id: 1, nombre: "..."}, ...]`
  - Objetos con paginación: `{items: [{id: 1, nombre: "..."}], meta: {...}}`

```typescript
// Extraer items, manejando tanto arrays directos como objetos con estructura {items: [...]}
let items: any[] = [];
if (queryResult.data) {
  if (Array.isArray(queryResult.data)) {
    // Si data es directamente un array
    items = queryResult.data;
  } else if (queryResult.data && typeof queryResult.data === 'object') {
    // Si data es un objeto con propiedad items (paginación)
    const dataObj = queryResult.data as any;
    if ('items' in dataObj && Array.isArray(dataObj.items)) {
      items = dataObj.items;
    }
  }
}
```

### 2. **Input No Permitía Escribir**
**Problema**: El `useEffect` que actualizaba el `displayValue` interfería con la escritura del usuario.

**Solución**:
- Agregamos estado `isUserTyping` para rastrear cuando el usuario está escribiendo
- El `useEffect` solo actualiza el valor cuando el usuario NO está escribiendo
- Se resetea `isUserTyping` cuando:
  - El usuario selecciona un item
  - El usuario hace click fuera del componente
  - El usuario pierde el foco

### 3. **Prevenir Edición Después de Selección**
**Problema**: Después de seleccionar un item, el usuario podía editar el texto, lo cual no debería ser posible.

**Solución**:
- Input se vuelve `readOnly` cuando hay una selección: `readOnly={!!selectedItem}`
- Estilo visual diferente cuando hay selección (fondo azul claro)
- Dropdown no se abre cuando hay una selección
- Solo se puede deseleccionar usando el botón X

```typescript
// Input readonly cuando hay selección
<input
  readOnly={!!selectedItem}
  className={`... ${selectedItem ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' : ''}`}
/>

// Dropdown solo se abre si no hay selección
{isOpen && !disabled && !selectedItem && (
  <div className="dropdown">...</div>
)}
```

### 4. **Búsqueda con Debounce**
**Problema**: No había debounce en la búsqueda, podía causar demasiadas consultas.

**Solución**:
- Implementamos debounce de 300ms para la búsqueda
- Cancelación de búsquedas previas cuando se inicia una nueva
- Cleanup apropiado de timeouts

```typescript
// Debounce para búsqueda
if (searchTimeoutRef.current) {
  clearTimeout(searchTimeoutRef.current);
}

searchTimeoutRef.current = window.setTimeout(() => {
  // Lógica de búsqueda
}, 300);
```

### 5. **Configuración del Componente**
**Agregamos las props necesarias**:
```typescript
<FormWrapperSelectHttp
  name="sedeId"
  label="Sede Principal"
  required
  placeholder="Buscar sede..."
  disabled={loading}
  useQuery={useSedesLite}
  valueKey="id"              // ← Agregado
  displayKey="nombre"        // ← Agregado
  searchFields={["nombre", "direccion"]} // ← Agregado
  textHelp="Selecciona la sede donde se realizarán los partidos"
/>
```

## Estado Actual

✅ **Funcionando**:
- El componente maneja correctamente datos con estructura de paginación
- El input permite escribir solo cuando no hay selección
- Búsqueda con debounce para mejor performance
- La selección bloquea la edición (solo se puede deseleccionar)
- Los datos se muestran en el dropdown
- La búsqueda funciona por nombre y dirección
- Estilo visual claro para items seleccionados

## Comportamiento del Usuario

### Flujo Normal:
1. **Usuario hace click** en el input → se abre el dropdown con opciones
2. **Usuario escribe** → filtra resultados en tiempo real con debounce
3. **Usuario selecciona** un item → input se vuelve readonly, dropdown se cierra
4. **Usuario ve selección** → input con fondo azul y botón X para limpiar
5. **Usuario puede limpiar** → click en X vuelve al estado inicial

### Estados del Input:
- **Vacío**: Editable, placeholder visible, dropdown se abre al escribir
- **Escribiendo**: Editable, muestra texto, dropdown con resultados filtrados
- **Seleccionado**: ReadOnly, fondo azul, texto del item seleccionado, botón X visible

## Uso del Componente

El `FormWrapperSelectHttp` ahora es completamente funcional y puede ser usado con cualquier API que retorne:

1. **Arrays directos**: `SedeLite[]`
2. **Objetos con paginación**: `{items: SedeLite[], meta: PaginationMeta}`

### Ejemplo de Uso Completo:
```typescript
<FormWrapperSelectHttp
  name="campoId"
  label="Seleccionar Campo"
  required
  placeholder="Buscar..."
  useQuery={useApiQuery}
  valueKey="id"
  displayKey="nombre"
  searchFields={["nombre", "descripcion", "codigo"]}
  textHelp="Texto de ayuda opcional"
  onItemSelect={(item) => console.log('Seleccionado:', item)}
/>
```

## Próximos Pasos

1. **Testear** el componente con diferentes APIs
2. **Implementar** búsqueda dinámica real (queries a la API mientras se escribe)
3. **Considerar** soporte para selección múltiple
4. **Documentar** casos de uso avanzados
