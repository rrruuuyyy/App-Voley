# FormWrapperSelectHttp - Búsqueda Dinámica Implementada

## Funcionalidad Implementada

### 🚀 **Búsqueda Dinámica con Fetch Real**

Hemos implementado búsqueda dinámica que hace peticiones HTTP reales a la API cuando el usuario escribe, siguiendo el patrón:

```
http://localhost:3000/sede?page=1&limit=10&fields=nombre&filter={searchTerm}&orderBy=nombre&order=asc
```

### 📋 **Componentes Creados/Modificados**

1. **`FormWrapperSelectHttp`** - Componente principal mejorado
2. **`SedeApiService.searchSedesWithParams()`** - Nuevo método de API
3. **`searchSedesForSelect()`** - Función de búsqueda para el componente
4. **`LigaForm`** - Actualizado para usar búsqueda dinámica

### 🔧 **Implementación Técnica**

#### 1. Nueva Prop `searchFunction`
```typescript
interface FormWrapperSelectHttpProps<TFieldValues, TItem extends SelectItem> {
  // ... otras props
  searchFunction?: (searchTerm: string) => Promise<{ items: TItem[]; meta?: any }>;
}
```

#### 2. API de Búsqueda
```typescript
// En sedeApi.ts
static async searchSedesWithParams(params: {
  page?: number;
  limit?: number;
  fields?: string;
  filter?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}): Promise<ResponsePaginate<SedeLite>>
```

#### 3. Función de Búsqueda Específica
```typescript
// En searchUtils.ts
export const searchSedesForSelect = async (searchTerm: string): Promise<{ items: SedeLite[]; meta?: any }> => {
  const result = await SedeApiService.searchSedesWithParams({
    page: 1,
    limit: 10,
    fields: 'nombre',
    filter: searchTerm,
    orderBy: 'nombre',
    order: 'asc'
  });

  return {
    items: result.items || [],
    meta: result.meta
  };
};
```

### 🎯 **Comportamiento del Usuario**

#### Flujo de Búsqueda:
1. **Usuario escribe** → Debounce de 300ms → Fetch a la API
2. **API responde** → Items se muestran en dropdown filtrados por el servidor
3. **Usuario selecciona** → Input se vuelve readonly, dropdown se cierra
4. **Usuario puede limpiar** → Botón X vuelve al estado inicial

#### Estados del Componente:
- **Carga inicial**: Usa `useQuery` (datos estáticos o cache)
- **Búsqueda activa**: Usa `searchFunction` (fetch dinámico)
- **Selección**: Input readonly, solo opción de limpiar

### 📝 **Uso en LigaForm**

```typescript
<FormWrapperSelectHttp
  name="sedeId"
  label="Sede Principal"
  required
  placeholder="Buscar sede..."
  disabled={loading}
  useQuery={useSedesLite}              // Para carga inicial/cache
  searchFunction={searchSedesForSelect} // Para búsqueda dinámica
  valueKey="id"
  displayKey="nombre"
  searchFields={["nombre", "direccion"]}
  textHelp="Selecciona la sede donde se realizarán los partidos"
/>
```

### 🔄 **Lógica de Datos**

El componente maneja inteligentemente dos fuentes de datos:

```typescript
// Usar items de búsqueda si hay un término de búsqueda activo
const activeItems = searchTerm.trim() && searchFunction ? searchItems : items;
const isLoading = searchTerm.trim() && searchFunction ? isSearching : queryResult.isLoading;

// Filtrado inteligente
const filteredItems = activeItems.filter(item => {
  // Si estamos usando búsqueda dinámica, no filtrar aquí (ya viene filtrado del servidor)
  if (searchTerm.trim() && searchFunction) return true;
  
  // Si no hay búsqueda dinámica, filtrar localmente
  if (!searchTerm.trim()) return true;
  
  return searchFields.some(field => {
    const fieldValue = item[field];
    if (typeof fieldValue === 'string') {
      return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });
});
```

### ⚡ **Optimizaciones Implementadas**

1. **Debounce**: 300ms para evitar consultas excesivas
2. **Cancelación**: AbortController para cancelar requests previos
3. **Estados de carga**: Indicadores visuales separados para cada tipo de búsqueda
4. **Cleanup**: Limpieza apropiada de timeouts y controllers
5. **Caché inteligente**: Usa useQuery para datos estáticos y fetch directo para búsquedas

### 🧪 **Testing API**

La API responde correctamente a búsquedas:

```bash
# Buscar "centro" → Encuentra "Cancha Centro"
GET /sede?page=1&limit=10&fields=nombre&filter=centro&orderBy=nombre&order=asc

# Respuesta:
{
  "items": [
    {
      "id": 1,
      "nombre": "Cancha Centro",
      "direccion": "Col. Centro",
      "telefono": "9582220485",
      "numeroCancha": 1,
      "active": true,
      "createdAt": "2025-08-17T01:00:56.249Z",
      "deletedAt": null
    }
  ],
  "meta": { ... }
}
```

### 🎨 **UX Mejorada**

- ✅ Búsqueda en tiempo real con resultados del servidor
- ✅ Estados de carga diferenciados
- ✅ Input readonly después de selección
- ✅ Estilo visual claro para selecciones
- ✅ Cancelación automática de requests
- ✅ Manejo de errores robusto

### 📈 **Próximos Pasos**

1. **Implementar** en otros módulos (usuarios, equipos, etc.)
2. **Agregar** soporte para selección múltiple
3. **Considerar** caché de búsquedas recientes
4. **Documentar** patrones de uso para otros desarrolladores

El componente `FormWrapperSelectHttp` ahora es una solución completa y robusta para búsquedas dinámicas con fetch real, compatible tanto con datos estáticos como con búsquedas en tiempo real.
