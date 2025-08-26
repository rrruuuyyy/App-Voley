import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

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
  enfrentamientosRealizados?: Set<string>;
  vueltaActual?: number;
}

// Componente para mostrar una tarjeta de equipo
const EquipoCard: React.FC<{
  equipo?: Equipo | null;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ equipo, onClick, disabled = false }) => {
  if (!equipo) {
    return (
      <div
        onClick={disabled ? undefined : onClick}
        className={`
          h-20 border-2 border-dashed rounded-lg p-3 flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${disabled 
            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
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
        transition-all duration-200 relative group cursor-pointer
        ${disabled 
          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
          : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500'
        }
      `}
    >
      <div className="text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
        {equipo.nombre}
      </div>
      {equipo.capitan && (
        <div className="text-xs text-blue-700 dark:text-blue-300 truncate">
          Cap: {equipo.capitan.nombre}
        </div>
      )}
      
      {!disabled && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implementar remover equipo
          }}
          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export const AsignacionPartidos: React.FC<AsignacionPartidosProps> = ({
  config,
  slots: initialSlots,
  equiposDisponibles,
  onSlotsChange,
  enfrentamientosRealizados = new Set(),
  vueltaActual = 1
}) => {
  const [slots, setSlots] = useState<PartidoSlot[]>(initialSlots);

  // Función para verificar si dos equipos pueden enfrentarse
  const puedenEnfrentarse = (equipoA: Equipo, equipoB: Equipo): boolean => {
    if (!equipoA || !equipoB || equipoA.id === equipoB.id) return false;
    
    const equipoMenor = Math.min(equipoA.id, equipoB.id);
    const equipoMayor = Math.max(equipoA.id, equipoB.id);
    const claveEnfrentamiento = `${equipoMenor}-${equipoMayor}`;
    
    return !enfrentamientosRealizados.has(claveEnfrentamiento);
  };

  // Sincronizar slots con el componente padre
  useEffect(() => {
    setSlots(initialSlots);
  }, [initialSlots]);

  // Notificar cambios al componente padre
  useEffect(() => {
    onSlotsChange(slots);
  }, [slots, onSlotsChange]);

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
            {config.numeroPartidos} partido(s) programado(s) • Vuelta {vueltaActual}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {equiposDisponibles.length} equipos disponibles
          </p>
        </div>
      </div>

      {/* Información sobre enfrentamientos */}
      {enfrentamientosRealizados.size > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                Enfrentamientos ya realizados en esta vuelta
              </h4>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Se evitarán automáticamente los partidos repetidos. 
                {enfrentamientosRealizados.size} enfrentamiento(s) ya completado(s).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Slots de partidos */}
      <div className="grid gap-4">
        {slots.map((slot, index) => (
          <div key={slot.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Partido {index + 1} - {slot.horario}
                </span>
              </div>
              {slot.equipoLocal && slot.equipoVisitante && (
                <div className="flex items-center space-x-2">
                  {puedenEnfrentarse(slot.equipoLocal, slot.equipoVisitante) ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Equipo Local */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Equipo Local
                </label>
                <EquipoCard 
                  equipo={slot.equipoLocal}
                  onClick={() => {/* TODO: Implementar selección */}}
                />
              </div>

              {/* VS */}
              <div className="text-center">
                <span className="text-lg font-bold text-gray-400 dark:text-gray-500">VS</span>
              </div>

              {/* Equipo Visitante */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Equipo Visitante
                </label>
                <EquipoCard 
                  equipo={slot.equipoVisitante}
                  onClick={() => {/* TODO: Implementar selección */}}
                />
              </div>
            </div>

            {/* Validación del enfrentamiento */}
            {slot.equipoLocal && slot.equipoVisitante && (
              <div className="mt-4">
                {puedenEnfrentarse(slot.equipoLocal, slot.equipoVisitante) ? (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Enfrentamiento válido</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Estos equipos ya se enfrentaron en la vuelta {vueltaActual}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen de equipos */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Equipos disponibles
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {equiposDisponibles.map((equipo) => (
            <div key={equipo.id} className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-white dark:bg-gray-700 rounded border">
              {equipo.nombre}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          💡 Los partidos se validarán automáticamente para evitar enfrentamientos repetidos en la vuelta {vueltaActual}.
        </p>
      </div>
    </div>
  );
};
