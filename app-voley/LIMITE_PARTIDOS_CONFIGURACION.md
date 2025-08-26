# Límite Dinámico de Partidos por Vuelta en ConfiguracionJornada

## Cambio implementado

Se ha modificado el componente `ConfiguracionJornada` para que el **máximo número de partidos** que se puede configurar esté limitado por los **partidos pendientes (sin crear)** de la vuelta actual.

## Cambios realizados

### 1. **Nuevo prop en ConfiguracionJornada**
```typescript
interface ConfiguracionJornadaProps {
  // ... props existentes
  partidosVueltaInfo?: {
    vuelta: any;
    partidos: any[];
    partidosSinCrear: number;
    partidosCreados: number;
    maxPartidos: number;
  } | null;
}
```

### 2. **Cálculo dinámico del máximo permitido**
```typescript
const maxPartidosPermitidos = partidosVueltaInfo?.partidosSinCrear || liga.maxPartidosPorDia || 10;
```

### 3. **Input con límite dinámico**
```typescript
<input
  type="number"
  min="1"
  max={maxPartidosPermitidos}  // ← Límite dinámico
  value={config.numeroPartidos}
  onChange={(e) => {
    const valor = parseInt(e.target.value) || 1;
    const valorLimitado = Math.min(valor, maxPartidosPermitidos); // ← Validación
    onConfigChange({ numeroPartidos: valorLimitado });
  }}
/>
```

### 4. **Información visual mejorada**
- **Máximo visible**: `partidos (máx: {maxPartidosPermitidos})`
- **Estado de la vuelta**: Muestra partidos creados, pendientes y total
- **Alertas**: Aviso cuando no hay partidos pendientes por crear

### 5. **Integración con GestionJornadas**
```typescript
<ConfiguracionJornada 
  // ... props existentes
  partidosVueltaInfo={partidosVueltaInfo}  // ← Nueva información
/>
```

## Funcionalidad resultante

### ✅ **Límites dinámicos**
- **Máximo**: Basado en `partidosVueltaInfo.partidosSinCrear`
- **Fallback**: `liga.maxPartidosPorDia` si no hay información de vuelta
- **Mínimo**: Siempre 1 partido

### 📊 **Información visual**
```
Vuelta Actual: 1
┌─────────┬───────────┬───────┐
│ Creados │ Pendientes│ Total │
│    4    │     2     │   6   │
└─────────┴───────────┴───────┘

Número de Partidos: [2] partidos (máx: 2)
Partidos disponibles en Vuelta 1: 2
Ya creados: 4 / 6
```

### ⚠️ **Validaciones**
- **No permite exceder**: El input no acepta valores mayores al límite
- **Auto-corrección**: Si se ingresa un valor mayor, se ajusta automáticamente
- **Alerta visual**: Muestra advertencia cuando no hay partidos pendientes

## Casos de uso

### **Caso 1: Vuelta con partidos pendientes**
```
Partidos pendientes: 3
Máximo permitido: 3
Usuario puede crear: 1, 2 o 3 partidos
```

### **Caso 2: Vuelta completa**
```
Partidos pendientes: 0
Máximo permitido: 0
Usuario ve: "⚠️ No hay partidos pendientes por crear en esta vuelta"
```

### **Caso 3: Sin información de vuelta**
```
Partidos pendientes: N/A
Máximo permitido: liga.maxPartidosPorDia (fallback)
Comportamiento normal
```

## Beneficios

1. **Previene configuraciones inválidas**: No se pueden crear más partidos de los disponibles
2. **Información clara**: El usuario ve exactamente cuántos partidos puede crear
3. **Feedback inmediato**: Alertas y límites visibles en tiempo real
4. **Integración perfecta**: Usa la información del endpoint de vuelta específica
5. **Fallback robusto**: Funciona aunque no haya información de vuelta

El sistema ahora respeta completamente los límites de partidos por vuelta y proporciona una experiencia de usuario más guiada y sin errores.
