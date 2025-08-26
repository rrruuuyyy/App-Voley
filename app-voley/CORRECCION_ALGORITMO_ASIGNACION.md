# Corrección: Algoritmo de Asignación de Equipos

## Problema identificado

El algoritmo anterior era **demasiado restrictivo** y bloqueaba escenarios válidos:

- **Problema**: Un equipo no podía jugar múltiples partidos en la misma jornada
- **Error**: Al seleccionar un equipo, se removía automáticamente de otros slots
- **Resultado**: Mensaje incorrecto "Este enfrentamiento ya está programado en esta jornada"

## Reglas correctas del voleibol

### ✅ **Permitido:**
- Un equipo **SÍ puede jugar múltiples partidos** en la misma jornada
- Ejemplo válido:
  - Partido 1: Julian Team vs Equipo Capitan 3
  - Partido 2: Julian Team vs Adrian Team

### ❌ **No permitido:**
- **Mismo enfrentamiento exacto** repetido en la jornada
- Ejemplo inválido:
  - Partido 1: Julian Team vs Adrian Team
  - Partido 2: Julian Team vs Adrian Team (DUPLICADO)

## Correcciones implementadas

### 1. **Filtrado de equipos en modal**
```typescript
// ANTES: Bloqueaba equipos ya asignados en jornada
const yaAsignadoEnJornada = slots.some(otherSlot => 
  otherSlot.id !== slotSeleccionado && 
  (otherSlot.equipoLocal?.id === equipo.id || otherSlot.equipoVisitante?.id === equipo.id)
);

// AHORA: Solo verifica enfrentamientos específicos
// Un equipo SÍ puede jugar múltiples partidos en la misma jornada
return equiposConRivales.filter(equipo => {
  // Solo verificar que no sea el mismo lado del mismo partido
  // y que puedan enfrentarse si hay otro equipo seleccionado
});
```

### 2. **Función seleccionarEquipo**
```typescript
// ANTES: Auto-limpiaba equipo de otros slots
else {
  const slotLimpio = { ...slot };
  if (slotLimpio.equipoLocal?.id === equipo.id) {
    slotLimpio.equipoLocal = null; // ❌ Incorrecto
  }
  return slotLimpio;
}

// AHORA: NO limpia equipo de otros slots
// NO limpiar el equipo de otros slots - un equipo puede jugar múltiples partidos
return slot;
```

### 3. **Validaciones visuales simplificadas**
- **Removido**: Alertas sobre "equipos duplicados" (que están permitidos)
- **Mantenido**: Solo alertas sobre enfrentamientos específicos duplicados

### 4. **Mensajes actualizados**
```typescript
// ANTES:
"Solo se muestran equipos que tienen rivales disponibles y no están ya asignados en esta jornada."

// AHORA:
"Los equipos pueden jugar múltiples partidos en la misma jornada, solo se evitan enfrentamientos duplicados."
```

## Validación de enfrentamientos

La función `puedenEnfrentarse` ahora verifica correctamente:

```typescript
const puedenEnfrentarse = (equipoA: Equipo, equipoB: Equipo): boolean => {
  // 1. No pueden ser el mismo equipo
  if (equipoA.id === equipoB.id) return false;
  
  const enfrentamientoKey = `${equipoMenor}-${equipoMayor}`;
  
  // 2. No pueden haber jugado en la vuelta (histórico)
  // 3. No pueden tener el mismo enfrentamiento en esta jornada
  return !enfrentamientosRealizados.has(enfrentamientoKey) && 
         !enfrentamientosEnJornada.has(enfrentamientoKey);
};
```

## Ejemplos de casos válidos ahora

### ✅ **Jornada válida:**
```
Partido 1 - 18:00
Local: Julian Team vs Visitante: Equipo Capitan 3

Partido 2 - 20:00  
Local: Julian Team vs Visitante: Adrian Team
```

### ❌ **Jornada inválida:**
```
Partido 1 - 18:00
Local: Julian Team vs Visitante: Adrian Team

Partido 2 - 20:00  
Local: Julian Team vs Visitante: Adrian Team  ← DUPLICADO
```

## Resultado

Ahora el sistema permite correctamente que:
1. **Equipos jueguen múltiples partidos** en la misma jornada
2. **Previene enfrentamientos duplicados** específicos
3. **Respeta la lógica real** del voleibol
4. **Proporciona mensajes claros** sobre qué está permitido

El problema reportado en las imágenes ahora está resuelto completamente.
