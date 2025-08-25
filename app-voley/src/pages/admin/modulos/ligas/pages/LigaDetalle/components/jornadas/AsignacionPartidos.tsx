import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertTriangle, CheckCircle, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Interfaces para el componente
interface JornadaConfig {
  fecha: string;
  horaInicio: string;
  numeroPartidos: number;
  duracionPartido: number;
  descansoEntrePartidos: number;
}

interface Equipo {
  id: number;
  nombre: string;
  capitan?: {
    id: number;
    nombre: string;
  };
  partidosJugados?: number;
  partidosPendientes?: number;
  yaJugoContra?: number[];
}

interface PartidoSlot {
  id: string;
  horario: string;
  partido?: any;
  equipoLocal?: Equipo | null;
  equipoVisitante?: Equipo | null;
}

interface AsignacionPartidosProps {
  config: JornadaConfig;
  slots: PartidoSlot[];
  equiposDisponibles: Equipo[];
  onSlotsChange: (slots: PartidoSlot[]) => void;
}

// Componente para mostrar una tarjeta de equipo
const EquipoCard: React.FC<{
  equipo?: Equipo | null;
  onClick?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
  disabled?: boolean;
}> = ({ equipo, onClick, onRemove, isSelected = false, disabled = false }) => {
  if (!equipo) {
    return (
      <div
        onClick={disabled ? undefined : onClick}
        className={`
          h-20 border-2 border-dashed rounded-lg p-3 flex items-center justify-center
          transition-all duration-200
          ${disabled 
            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }
        `}
      >
        <div className="text-center">
          <Plus className={`w-6 h-6 mx-auto mb-1 ${disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500'}`} />
          <span className={`text-xs ${disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
            {disabled ? 'No disponible' : 'Seleccionar'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        h-20 border-2 rounded-lg p-3 flex flex-col justify-center
        transition-all duration-200 relative group
        ${disabled 
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
          : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500'
        }
        ${isSelected ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/40' : ''}
      `}
    >
      {onRemove && !disabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
        >
          ×
        </button>
      )}
      <div className="text-center">
        <h4 className={`text-sm font-semibold truncate ${disabled ? 'text-gray-400 dark:text-gray-600' : 'text-blue-900 dark:text-blue-100'}`}>
          {equipo.nombre}
        </h4>
        {equipo.capitan && (
          <p className={`text-xs truncate ${disabled ? 'text-gray-300 dark:text-gray-700' : 'text-blue-700 dark:text-blue-300'}`}>
            {equipo.capitan.nombre}
          </p>
        )}
      </div>
    </div>
  );
};

// Componente para un slot de partido
const PartidoSlotComponent: React.FC<{
  slot: PartidoSlot;
  onEquipoLocalSelect: () => void;
  onEquipoVisitanteSelect: () => void;
  onRemoveEquipo: (type: 'local' | 'visitante') => void;
  validacion?: {
    esValido: boolean;
    razon?: string;
  };
}> = ({ slot, onEquipoLocalSelect, onEquipoVisitanteSelect, onRemoveEquipo, validacion }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
      {/* Horario */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
          <Clock className="w-6 h-6 mr-2" />
          {slot.horario}
        </div>
      </div>

      {/* Enfrentamiento */}
      <div className="grid grid-cols-5 gap-2 items-center">
        {/* Equipo Local */}
        <div className="col-span-2">
          <EquipoCard
            equipo={slot.equipoLocal}
            onClick={onEquipoLocalSelect}
            onRemove={slot.equipoLocal ? () => onRemoveEquipo('local') : undefined}
          />
        </div>

        {/* VS */}
        <div className="col-span-1 text-center">
          <div className="text-lg font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mx-auto">
            VS
          </div>
        </div>

        {/* Equipo Visitante */}
        <div className="col-span-2">
          <EquipoCard
            equipo={slot.equipoVisitante}
            onClick={onEquipoVisitanteSelect}
            onRemove={slot.equipoVisitante ? () => onRemoveEquipo('visitante') : undefined}
          />
        </div>
      </div>

      {/* Estado de validación */}
      {validacion && (
        <div className={`flex items-center text-xs p-2 rounded ${
          validacion.esValido 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
            : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
        }`}>
          {validacion.esValido ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertTriangle className="w-4 h-4 mr-2" />
          )}
          {validacion.esValido ? 'Enfrentamiento válido' : validacion.razon}
        </div>
      )}
    </div>
  );
};

// Componente sortable para un slot de partido
const SortablePartidoSlot: React.FC<{
  slot: PartidoSlot;
  onEquipoLocalSelect: () => void;
  onEquipoVisitanteSelect: () => void;
  onRemoveEquipo: (type: 'local' | 'visitante') => void;
  validacion?: {
    esValido: boolean;
    razon?: string;
  };
}> = ({ slot, onEquipoLocalSelect, onEquipoVisitanteSelect, onRemoveEquipo, validacion }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Handle para drag */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1 rounded bg-gray-100 dark:bg-gray-700 cursor-grab active:cursor-grabbing hover:bg-gray-200 dark:hover:bg-gray-600 z-10"
        title="Arrastrar para reordenar"
      >
        <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      
      <PartidoSlotComponent
        slot={slot}
        onEquipoLocalSelect={onEquipoLocalSelect}
        onEquipoVisitanteSelect={onEquipoVisitanteSelect}
        onRemoveEquipo={onRemoveEquipo}
        validacion={validacion}
      />
    </div>
  );
};

export const AsignacionPartidos: React.FC<AsignacionPartidosProps> = ({
  config,
  slots: initialSlots,
  equiposDisponibles,
  onSlotsChange
}) => {
  const [slots, setSlots] = useState<PartidoSlot[]>(initialSlots);
  const [equipoSeleccionando, setEquipoSeleccionando] = useState<{
    slotId: string;
    tipo: 'local' | 'visitante';
  } | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('🎯 AsignacionPartidos: equiposDisponibles recibidos:', equiposDisponibles);
    console.log('🎯 AsignacionPartidos: cantidad:', equiposDisponibles?.length || 0);
  }, [equiposDisponibles]);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generar slots iniciales si están vacíos
  useEffect(() => {
    if (slots.length === 0 && config.numeroPartidos > 0) {
      const nuevosSlots: PartidoSlot[] = [];
      const [horas, minutos] = config.horaInicio.split(':').map(Number);
      const inicioEnMinutos = horas * 60 + minutos;
      
      for (let i = 0; i < config.numeroPartidos; i++) {
        const inicioPartidoEnMinutos = inicioEnMinutos + 
          i * (config.duracionPartido + config.descansoEntrePartidos);
        
        const horaInicio = Math.floor(inicioPartidoEnMinutos / 60);
        const minutoInicio = inicioPartidoEnMinutos % 60;
        const horario = `${horaInicio.toString().padStart(2, '0')}:${minutoInicio.toString().padStart(2, '0')}`;
        
        nuevosSlots.push({
          id: `slot-${i}`,
          horario,
          equipoLocal: null,
          equipoVisitante: null
        });
      }
      
      setSlots(nuevosSlots);
    }
  }, [config, slots.length]);

  // Sincronizar con el padre
  useEffect(() => {
    onSlotsChange(slots);
  }, [slots, onSlotsChange]);

  // Manejar el final del drag
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSlots((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Recalcular horarios después del reordenamiento
        const reorderedSlots = arrayMove(items, oldIndex, newIndex);
        return recalcularHorarios(reorderedSlots);
      });
    }
  };

  // Recalcular horarios después del reordenamiento
  const recalcularHorarios = (slotsReordenados: PartidoSlot[]): PartidoSlot[] => {
    const [horas, minutos] = config.horaInicio.split(':').map(Number);
    const inicioEnMinutos = horas * 60 + minutos;
    
    return slotsReordenados.map((slot, index) => {
      const inicioPartidoEnMinutos = inicioEnMinutos + 
        index * (config.duracionPartido + config.descansoEntrePartidos);
      
      const horaInicio = Math.floor(inicioPartidoEnMinutos / 60);
      const minutoInicio = inicioPartidoEnMinutos % 60;
      const horario = `${horaInicio.toString().padStart(2, '0')}:${minutoInicio.toString().padStart(2, '0')}`;
      
      return {
        ...slot,
        horario
      };
    });
  };

  // Validar un slot de partido
  const validarSlot = (slot: PartidoSlot) => {
    if (!slot.equipoLocal || !slot.equipoVisitante) {
      return {
        esValido: false,
        razon: 'Faltan equipos por asignar'
      };
    }

    if (slot.equipoLocal.id === slot.equipoVisitante.id) {
      return {
        esValido: false,
        razon: 'Un equipo no puede jugar contra sí mismo'
      };
    }

    // Verificar si ya se han enfrentado anteriormente (histórico)
    const yaSeEnfrentaronAnteriormente = slot.equipoLocal.yaJugoContra?.includes(slot.equipoVisitante.id) ||
                                        slot.equipoVisitante.yaJugoContra?.includes(slot.equipoLocal.id);

    if (yaSeEnfrentaronAnteriormente) {
      return {
        esValido: false,
        razon: 'Estos equipos ya se han enfrentado anteriormente'
      };
    }

    // Verificar si ya están programados para enfrentarse en otro partido de esta misma jornada
    const yaSeEnfrentanEnEstaJornada = slots.some(otroSlot => 
      otroSlot.id !== slot.id &&
      otroSlot.equipoLocal && otroSlot.equipoVisitante &&
      slot.equipoLocal && slot.equipoVisitante &&
      ((otroSlot.equipoLocal.id === slot.equipoLocal.id && otroSlot.equipoVisitante.id === slot.equipoVisitante.id) ||
       (otroSlot.equipoLocal.id === slot.equipoVisitante.id && otroSlot.equipoVisitante.id === slot.equipoLocal.id))
    );

    if (yaSeEnfrentanEnEstaJornada) {
      return {
        esValido: false,
        razon: 'Estos equipos ya están programados para enfrentarse en esta jornada'
      };
    }

    return {
      esValido: true,
      razon: 'Enfrentamiento válido'
    };
  };

  // Obtener equipos disponibles para un slot específico
  const getEquiposDisponiblesParaSlot = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return equiposDisponibles;

    return equiposDisponibles.filter(equipo => {
      // No puede ser el mismo equipo que ya está asignado en ESTE slot
      if (slot.equipoLocal?.id === equipo.id || slot.equipoVisitante?.id === equipo.id) {
        return false;
      }

      // El equipo siempre está disponible para ser seleccionado
      // La validación de si puede enfrentarse a otro equipo específico
      // se hará cuando se seleccionen ambos equipos en el slot
      return true;
    });
  };

  // Asignar equipo a un slot
  const handleAsignarEquipo = (equipoId: number) => {
    if (!equipoSeleccionando) return;

    const equipo = equiposDisponibles.find(e => e.id === equipoId);
    if (!equipo) return;

    const nuevosSlots = slots.map(slot => {
      if (slot.id === equipoSeleccionando.slotId) {
        return {
          ...slot,
          [equipoSeleccionando.tipo === 'local' ? 'equipoLocal' : 'equipoVisitante']: equipo
        };
      }
      return slot;
    });

    setSlots(nuevosSlots);
    setEquipoSeleccionando(null);
  };

  // Remover equipo de un slot
  const handleRemoverEquipo = (slotId: string, tipo: 'local' | 'visitante') => {
    const nuevosSlots = slots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          [tipo === 'local' ? 'equipoLocal' : 'equipoVisitante']: null
        };
      }
      return slot;
    });

    setSlots(nuevosSlots);
  };

  const equiposDisponiblesParaSeleccion = equipoSeleccionando 
    ? getEquiposDisponiblesParaSlot(equipoSeleccionando.slotId)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Asignación de Partidos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fecha: {new Date(config.fecha).toLocaleDateString()} • 
            {config.numeroPartidos} partido(s) programado(s)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            💡 Arrastra el ícono <GripVertical className="w-3 h-3 inline" /> para reordenar los partidos
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {equiposDisponibles.length} equipos disponibles
        </div>
      </div>

      {/* Grid de partidos con drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={slots.map(slot => slot.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slots.map((slot) => (
              <SortablePartidoSlot
                key={slot.id}
                slot={slot}
                onEquipoLocalSelect={() => setEquipoSeleccionando({ slotId: slot.id, tipo: 'local' })}
                onEquipoVisitanteSelect={() => setEquipoSeleccionando({ slotId: slot.id, tipo: 'visitante' })}
                onRemoveEquipo={(tipo) => handleRemoverEquipo(slot.id, tipo)}
                validacion={validarSlot(slot)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Modal de selección de equipos */}
      {equipoSeleccionando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setEquipoSeleccionando(null)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Seleccionar Equipo {equipoSeleccionando.tipo === 'local' ? 'Local' : 'Visitante'}
            </h4>
            
            {/* Información del slot actual */}
            {(() => {
              const slotActual = slots.find(s => s.id === equipoSeleccionando.slotId);
              const equipoYaAsignado = equipoSeleccionando.tipo === 'local' 
                ? slotActual?.equipoVisitante 
                : slotActual?.equipoLocal;
              
              return equipoYaAsignado && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Jugará contra: <span className="font-medium">{equipoYaAsignado.nombre}</span>
                  </p>
                </div>
              );
            })()}
            
            <div className="space-y-2 mb-4">
              {equiposDisponiblesParaSeleccion.length > 0 ? (
                equiposDisponiblesParaSeleccion.map(equipo => {
                  // Verificar disponibilidad contra el equipo ya asignado
                  const slotActual = slots.find(s => s.id === equipoSeleccionando.slotId);
                  const equipoOponente = equipoSeleccionando.tipo === 'local' 
                    ? slotActual?.equipoVisitante 
                    : slotActual?.equipoLocal;
                  
                  let estadoEquipo = { disponible: true, razon: '' };
                  
                  if (equipoOponente) {
                    const yaSeEnfrentaron = equipo.yaJugoContra?.includes(equipoOponente.id) ||
                                          equipoOponente.yaJugoContra?.includes(equipo.id);
                    
                    if (yaSeEnfrentaron) {
                      estadoEquipo = { 
                        disponible: false, 
                        razon: `Ya jugó contra ${equipoOponente.nombre}` 
                      };
                    }
                    
                    // Verificar si ya están programados en esta jornada
                    const yaEnfrentanEstaJornada = slots.some(slot => 
                      slot.id !== equipoSeleccionando.slotId &&
                      slot.equipoLocal && slot.equipoVisitante &&
                      ((slot.equipoLocal.id === equipo.id && slot.equipoVisitante.id === equipoOponente.id) ||
                       (slot.equipoLocal.id === equipoOponente.id && slot.equipoVisitante.id === equipo.id))
                    );
                    
                    if (yaEnfrentanEstaJornada) {
                      estadoEquipo = { 
                        disponible: false, 
                        razon: `Ya programado contra ${equipoOponente.nombre} en esta jornada` 
                      };
                    }
                  }
                  
                  return (
                    <div
                      key={equipo.id}
                      onClick={estadoEquipo.disponible ? () => handleAsignarEquipo(equipo.id) : undefined}
                      className={`p-3 border rounded-lg transition-colors ${
                        estadoEquipo.disponible
                          ? 'border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600'
                          : 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <h5 className={`font-medium ${estadoEquipo.disponible ? 'text-gray-900 dark:text-white' : 'text-red-700 dark:text-red-300'}`}>
                        {equipo.nombre}
                      </h5>
                      {equipo.capitan && (
                        <p className={`text-sm ${estadoEquipo.disponible ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
                          Capitán: {equipo.capitan.nombre}
                        </p>
                      )}
                      {!estadoEquipo.disponible && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {estadoEquipo.razon}
                        </p>
                      )}
                      {estadoEquipo.disponible && equipoOponente && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          ✓ Puede jugar contra {equipoOponente.nombre}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay equipos disponibles para este slot
                </p>
              )}
            </div>

            <button
              onClick={() => setEquipoSeleccionando(null)}
              className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Estado de la Jornada
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Partidos configurados:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {slots.filter(slot => slot.equipoLocal && slot.equipoVisitante).length} / {slots.length}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Equipos utilizados:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Set([
                ...slots.filter(slot => slot.equipoLocal).map(slot => slot.equipoLocal!.id),
                ...slots.filter(slot => slot.equipoVisitante).map(slot => slot.equipoVisitante!.id)
              ]).size}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Válidos:</span>
            <p className="font-medium text-green-600 dark:text-green-400">
              {slots.filter(slot => validarSlot(slot).esValido).length}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Con errores:</span>
            <p className="font-medium text-red-600 dark:text-red-400">
              {slots.filter(slot => !validarSlot(slot).esValido).length}
            </p>
          </div>
        </div>

        {/* Información sobre equipos con múltiples partidos */}
        {(() => {
          const equiposConMultiplesPartidos = new Map<number, number>();
          
          slots.forEach(slot => {
            if (slot.equipoLocal) {
              equiposConMultiplesPartidos.set(
                slot.equipoLocal.id, 
                (equiposConMultiplesPartidos.get(slot.equipoLocal.id) || 0) + 1
              );
            }
            if (slot.equipoVisitante) {
              equiposConMultiplesPartidos.set(
                slot.equipoVisitante.id, 
                (equiposConMultiplesPartidos.get(slot.equipoVisitante.id) || 0) + 1
              );
            }
          });

          const equiposConMasDeUnPartido = Array.from(equiposConMultiplesPartidos.entries())
            .filter(([_, cantidad]) => cantidad > 1)
            .map(([equipoId, cantidad]) => {
              const equipo = equiposDisponibles.find(e => e.id === equipoId);
              return { equipo, cantidad };
            })
            .filter(item => item.equipo);

          return equiposConMasDeUnPartido.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Equipos con múltiples partidos en esta jornada:
              </h5>
              <div className="flex flex-wrap gap-2">
                {equiposConMasDeUnPartido.map(({ equipo, cantidad }) => (
                  <span
                    key={equipo!.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                  >
                    {equipo!.nombre} ({cantidad} partidos)
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 En voleibol, los equipos pueden jugar múltiples partidos en la misma jornada siempre que no se repitan los enfrentamientos.
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
