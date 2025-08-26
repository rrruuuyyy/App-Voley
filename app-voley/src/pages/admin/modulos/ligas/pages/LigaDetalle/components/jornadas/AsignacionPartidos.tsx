import React, { useState, useEffect, useMemo } from 'react';
import { Clock, AlertTriangle, CheckCircle, Plus, Users, X, Info } from 'lucide-react';
import { Modal } from '../../../../../../../../common/components';

// Interfaces para el componente
interface JornadaConfig {
  fecha: string;
  horaInicio: string;
  numeroPartidos: number;
  duracionPartido: number;
  descansoEntrePartidos: number;
  vuelta?: number;
}

interface Equipo {
  id: number;
  nombre: string;
  capitan?: {
    id: number;
    nombre: string;
  } | string;
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
  enfrentamientosRealizados?: Set<string>;
  vueltaActual?: number;
  partidosVueltaInfo?: {
    vuelta: any;
    partidos: any[];
    partidosSinCrear: number;
    partidosCreados: number;
    maxPartidos: number;
  } | null;
}

// Componente para mostrar una tarjeta de equipo
const EquipoCard: React.FC<{
  equipo?: Equipo | null;
  onClick?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}> = ({ equipo, onClick, onRemove, disabled = false }) => {
  if (!equipo) {
    return (
      <div 
        onClick={disabled ? undefined : onClick}
        className={`
          border-2 border-dashed border-gray-300 dark:border-gray-600 
          rounded-lg p-4 h-20 flex items-center justify-center
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500'}
          transition-colors
        `}
      >
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Plus className="w-5 h-5" />
          <span className="text-sm">Seleccionar equipo</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {equipo.nombre}
          </div>
          {equipo.capitan && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Capitán: {typeof equipo.capitan === 'object' ? equipo.capitan.nombre : equipo.capitan}
            </div>
          )}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const AsignacionPartidos: React.FC<AsignacionPartidosProps> = ({
  config,
  slots: initialSlots,
  equiposDisponibles,
  onSlotsChange,
  enfrentamientosRealizados = new Set(),
  vueltaActual = 1,
  partidosVueltaInfo
}) => {
  const [slots, setSlots] = useState<PartidoSlot[]>(initialSlots);
  const [modalEquipoAbierto, setModalEquipoAbierto] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState<string | null>(null);
  const [tipoEquipo, setTipoEquipo] = useState<'local' | 'visitante'>('local');

  // Verificar límites de partidos basándose en la vuelta
  const puedeCrearMasPartidos = partidosVueltaInfo 
    ? partidosVueltaInfo.partidosSinCrear > 0 
    : true;

  const maxPartidosPermitidos = partidosVueltaInfo 
    ? Math.min(config.numeroPartidos, partidosVueltaInfo.partidosSinCrear)
    : config.numeroPartidos;

  // Obtener enfrentamientos ya asignados en la jornada actual
  const enfrentamientosEnJornada = useMemo(() => {
    const enfrentamientos = new Set<string>();
    
    slots.forEach(slot => {
      if (slot.equipoLocal && slot.equipoVisitante) {
        const equipoA = Math.min(slot.equipoLocal.id, slot.equipoVisitante.id);
        const equipoB = Math.max(slot.equipoLocal.id, slot.equipoVisitante.id);
        enfrentamientos.add(`${equipoA}-${equipoB}`);
      }
    });
    
    return enfrentamientos;
  }, [slots]);

  // Verificar si ya jugaron entre sí en esta vuelta O en esta jornada
  const puedenEnfrentarse = (equipoA: Equipo, equipoB: Equipo): boolean => {
    if (equipoA.id === equipoB.id) return false;
    
    const equipoMenor = Math.min(equipoA.id, equipoB.id);
    const equipoMayor = Math.max(equipoA.id, equipoB.id);
    const enfrentamientoKey = `${equipoMenor}-${equipoMayor}`;
    
    // No pueden enfrentarse si ya jugaron en la vuelta O si ya están asignados en esta jornada
    return !enfrentamientosRealizados.has(enfrentamientoKey) && 
           !enfrentamientosEnJornada.has(enfrentamientoKey);
  };

  // Calcular equipos que tienen rivales disponibles
  const equiposConRivalesDisponibles = useMemo(() => {
    return equiposDisponibles.filter(equipo => {
      const rivalesDisponibles = equiposDisponibles.filter(otroEquipo => {
        if (equipo.id === otroEquipo.id) return false;
        return puedenEnfrentarse(equipo, otroEquipo);
      });
      
      return rivalesDisponibles.length > 0;
    });
  }, [equiposDisponibles, enfrentamientosRealizados, enfrentamientosEnJornada]);

  // Actualizar slots cuando cambien los iniciales
  useEffect(() => {
    setSlots(initialSlots);
  }, [initialSlots]);

  // Notificar cambios
  useEffect(() => {
    onSlotsChange(slots);
  }, [slots, onSlotsChange]);

  const abrirModalEquipo = (slotId: string, tipo: 'local' | 'visitante') => {
    setSlotSeleccionado(slotId);
    setTipoEquipo(tipo);
    setModalEquipoAbierto(true);
  };

  const seleccionarEquipo = (equipo: Equipo) => {
    if (!slotSeleccionado) return;

    setSlots(prevSlots => 
      prevSlots.map(slot => {
        if (slot.id === slotSeleccionado) {
          const nuevoSlot = { ...slot };
          if (tipoEquipo === 'local') {
            nuevoSlot.equipoLocal = equipo;
            // Si el visitante ya no puede enfrentarse al nuevo local, limpiarlo
            if (nuevoSlot.equipoVisitante && !puedenEnfrentarse(equipo, nuevoSlot.equipoVisitante)) {
              nuevoSlot.equipoVisitante = null;
            }
          } else {
            nuevoSlot.equipoVisitante = equipo;
            // Si el local ya no puede enfrentarse al nuevo visitante, limpiarlo
            if (nuevoSlot.equipoLocal && !puedenEnfrentarse(nuevoSlot.equipoLocal, equipo)) {
              nuevoSlot.equipoLocal = null;
            }
          }
          return nuevoSlot;
        }
        // NO limpiar el equipo de otros slots - un equipo puede jugar múltiples partidos
        return slot;
      })
    );

    setModalEquipoAbierto(false);
    setSlotSeleccionado(null);
  };

  const removerEquipo = (slotId: string, tipo: 'local' | 'visitante') => {
    setSlots(prevSlots => 
      prevSlots.map(slot => {
        if (slot.id === slotId) {
          return {
            ...slot,
            [tipo === 'local' ? 'equipoLocal' : 'equipoVisitante']: null
          };
        }
        return slot;
      })
    );
  };

  // Filtrar equipos disponibles para el modal
  const equiposFiltrados = useMemo(() => {
    // Usar equipos con rivales disponibles como base
    const equiposConRivales = equiposConRivalesDisponibles;
    
    return equiposConRivales.filter(equipo => {
      const slot = slots.find(s => s.id === slotSeleccionado);
      if (!slot) return true;

      // No puede ser el mismo equipo del otro lado del mismo partido
      const otroEquipo = tipoEquipo === 'local' ? slot.equipoVisitante : slot.equipoLocal;
      if (otroEquipo && equipo.id === otroEquipo.id) return false;

      // Debe poder enfrentarse al equipo del otro lado (si ya hay uno seleccionado)
      if (otroEquipo && !puedenEnfrentarse(equipo, otroEquipo)) return false;

      // NOTA: Removemos la restricción de equipo ya asignado en jornada
      // Un equipo SÍ puede jugar múltiples partidos en la misma jornada
      // Solo importa que no repita el mismo enfrentamiento específico

      return true;
    });
  }, [equiposConRivalesDisponibles, slots, slotSeleccionado, tipoEquipo]);

  // Resumen de enfrentamientos para mostrar información útil
  const resumenEnfrentamientos = useMemo(() => {
    if (!partidosVueltaInfo?.partidos) return null;
    
    const enfrentamientosPartidos = partidosVueltaInfo.partidos.map(partido => 
      `${partido.equipoLocal.nombre} vs ${partido.equipoVisitante.nombre}`
    );
    
    return {
      total: enfrentamientosPartidos.length,
      enfrentamientos: enfrentamientosPartidos
    };
  }, [partidosVueltaInfo]);

  // Mostrar solo los slots permitidos según el límite
  const slotsLimitados = slots.slice(0, maxPartidosPermitidos);

  return (
    <div className="space-y-6">
      {/* Información de la vuelta */}
      {partidosVueltaInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              Vuelta {vueltaActual} - Estado de Partidos
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {partidosVueltaInfo.partidosCreados}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Partidos creados
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {partidosVueltaInfo.partidosSinCrear}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                Partidos pendientes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {partidosVueltaInfo.maxPartidos}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Total esperados
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((partidosVueltaInfo.partidosCreados / partidosVueltaInfo.maxPartidos) * 100)}%
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Progreso
              </div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>Progreso de la vuelta</span>
              <span>{partidosVueltaInfo.partidosCreados} de {partidosVueltaInfo.maxPartidos} partidos</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(partidosVueltaInfo.partidosCreados / partidosVueltaInfo.maxPartidos) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Alerta si se alcanzó el límite */}
      {config.numeroPartidos > maxPartidosPermitidos && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <div className="text-yellow-800 dark:text-yellow-200">
              <div className="font-medium">Límite de partidos ajustado</div>
              <div className="text-sm">
                Solo se pueden crear {maxPartidosPermitidos} partidos de los {config.numeroPartidos} configurados 
                (hay {partidosVueltaInfo?.partidosSinCrear || 0} partidos pendientes en esta vuelta).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información de enfrentamientos ya realizados */}
      {resumenEnfrentamientos && resumenEnfrentamientos.total > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Enfrentamientos ya programados en Vuelta {vueltaActual}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {resumenEnfrentamientos.enfrentamientos.map((enfrentamiento, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 rounded px-3 py-2">
                <Users className="w-4 h-4 inline mr-2" />
                {enfrentamiento}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de partidos con horarios */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Partidos Programados ({slotsLimitados.length})
        </h3>
        
        {slotsLimitados.map((slot, index) => (
          <div key={slot.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Partido {index + 1} - {slot.horario}
                </span>
              </div>
              
              {/* Validación visual - solo para enfrentamientos válidos/inválidos */}
              {slot.equipoLocal && slot.equipoVisitante && (() => {
                // Crear un Set de enfrentamientos excluyendo el slot actual
                const enfrentamientosExcluyendoActual = new Set<string>();
                slots.forEach((otherSlot, otherIndex) => {
                  if (otherIndex !== index && otherSlot.equipoLocal && otherSlot.equipoVisitante) {
                    const equipoA = Math.min(otherSlot.equipoLocal.id, otherSlot.equipoVisitante.id);
                    const equipoB = Math.max(otherSlot.equipoLocal.id, otherSlot.equipoVisitante.id);
                    enfrentamientosExcluyendoActual.add(`${equipoA}-${equipoB}`);
                  }
                });
                
                const equipoMenor = Math.min(slot.equipoLocal.id, slot.equipoVisitante.id);
                const equipoMayor = Math.max(slot.equipoLocal.id, slot.equipoVisitante.id);
                const enfrentamientoKey = `${equipoMenor}-${equipoMayor}`;
                
                const esValido = !enfrentamientosRealizados.has(enfrentamientoKey) && 
                                !enfrentamientosExcluyendoActual.has(enfrentamientoKey);
                
                return esValido ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                );
              })()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Equipo Local */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Equipo Local
                </label>
                <EquipoCard
                  equipo={slot.equipoLocal}
                  onClick={() => abrirModalEquipo(slot.id, 'local')}
                  onRemove={slot.equipoLocal ? () => removerEquipo(slot.id, 'local') : undefined}
                  disabled={!puedeCrearMasPartidos && !slot.equipoLocal}
                />
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                  VS
                </div>
              </div>

              {/* Equipo Visitante */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Equipo Visitante
                </label>
                <EquipoCard
                  equipo={slot.equipoVisitante}
                  onClick={() => abrirModalEquipo(slot.id, 'visitante')}
                  onRemove={slot.equipoVisitante ? () => removerEquipo(slot.id, 'visitante') : undefined}
                  disabled={!puedeCrearMasPartidos && !slot.equipoVisitante}
                />
              </div>
            </div>

            {/* Mensajes de error solo para enfrentamientos inválidos */}
            <div className="mt-3 space-y-1">
              {slot.equipoLocal && slot.equipoVisitante && (() => {
                // Crear un Set de enfrentamientos excluyendo el slot actual para validación
                const enfrentamientosExcluyendoActual = new Set<string>();
                slots.forEach((otherSlot, otherIndex) => {
                  if (otherIndex !== index && otherSlot.equipoLocal && otherSlot.equipoVisitante) {
                    const equipoA = Math.min(otherSlot.equipoLocal.id, otherSlot.equipoVisitante.id);
                    const equipoB = Math.max(otherSlot.equipoLocal.id, otherSlot.equipoVisitante.id);
                    enfrentamientosExcluyendoActual.add(`${equipoA}-${equipoB}`);
                  }
                });
                
                const equipoMenor = Math.min(slot.equipoLocal.id, slot.equipoVisitante.id);
                const equipoMayor = Math.max(slot.equipoLocal.id, slot.equipoVisitante.id);
                const enfrentamientoKey = `${equipoMenor}-${equipoMayor}`;
                
                const yaEnVuelta = enfrentamientosRealizados.has(enfrentamientoKey);
                const yaEnJornada = enfrentamientosExcluyendoActual.has(enfrentamientoKey);
                
                return (yaEnVuelta || yaEnJornada) && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">
                      {yaEnVuelta 
                        ? 'Estos equipos ya se enfrentaron en esta vuelta'
                        : 'Este enfrentamiento ya está programado en esta jornada'
                      }
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de selección de equipos */}
      <Modal
        isOpen={modalEquipoAbierto}
        onClose={() => {
          // Solo cerrar con botón, no con ESC
        }}
        title={`Seleccionar ${tipoEquipo === 'local' ? 'Equipo Local' : 'Equipo Visitante'}`}
        closeOnBackdropClick={false}
        showCloseButton={false}
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Selecciona un equipo para asignar a este partido. 
            <span className="block mt-1 text-xs">
              Los equipos pueden jugar múltiples partidos en la misma jornada, solo se evitan enfrentamientos duplicados.
            </span>
          </div>
          
          {equiposFiltrados.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  No hay equipos disponibles
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Los equipos pueden no estar disponibles porque:
                  <ul className="list-disc list-inside mt-1 text-left">
                    <li>Ya agotaron todos sus enfrentamientos en esta vuelta</li>
                    <li>Ya se enfrentaron al equipo seleccionado en esta vuelta</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {equiposFiltrados.map((equipo) => {
              // Calcular enfrentamientos disponibles para este equipo (excluyendo los ya asignados en esta jornada)
              const enfrentamientosDisponibles = equiposDisponibles.filter(otroEquipo => {
                if (equipo.id === otroEquipo.id) return false;
                
                // Verificar si pueden enfrentarse (no jugaron en vuelta y no están en jornada)
                if (!puedenEnfrentarse(equipo, otroEquipo)) return false;
                
                // Verificar que el otro equipo no esté ya asignado en esta jornada
                const otroEquipoAsignado = slots.some(slot => 
                  slot.equipoLocal?.id === otroEquipo.id || slot.equipoVisitante?.id === otroEquipo.id
                );
                
                return !otroEquipoAsignado;
              }).length;

              // Calcular total de enfrentamientos en la vuelta (sin restricción de jornada)
              const totalRivalesEnVuelta = equiposDisponibles.filter(otroEquipo => {
                if (equipo.id === otroEquipo.id) return false;
                const equipoMenor = Math.min(equipo.id, otroEquipo.id);
                const equipoMayor = Math.max(equipo.id, otroEquipo.id);
                const enfrentamientoKey = `${equipoMenor}-${equipoMayor}`;
                return !enfrentamientosRealizados.has(enfrentamientoKey);
              }).length;
              
              return (
                <button
                  key={equipo.id}
                  onClick={() => seleccionarEquipo(equipo)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {equipo.nombre}
                        </div>
                        {equipo.capitan && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Capitán: {typeof equipo.capitan === 'object' ? equipo.capitan.nombre : equipo.capitan}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {enfrentamientosDisponibles} disponibles ahora
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {totalRivalesEnVuelta} en toda la vuelta
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => {
                setModalEquipoAbierto(false);
                setSlotSeleccionado(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AsignacionPartidos;