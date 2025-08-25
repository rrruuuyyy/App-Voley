import React from 'react';
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

// Interfaces
interface Liga {
  id: number;
  nombre: string;
  vueltas: number;
}

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
}

interface PartidoSlot {
  id: string;
  horario: string;
  equipoLocal?: Equipo | null;
  equipoVisitante?: Equipo | null;
}

interface Conflicto {
  equipoId: number;
  equipoNombre: string;
  fechaConflicto: string;
  partidoExistente: number;
}

interface ResumenJornadaProps {
  liga: Liga;
  config: JornadaConfig;
  slots: PartidoSlot[];
  conflictos?: {
    valido: boolean;
    conflictos: Conflicto[];
  } | null;
}

export const ResumenJornada: React.FC<ResumenJornadaProps> = ({
  liga,
  config,
  slots,
  conflictos
}) => {
  // Calcular estadísticas
  const partidosConfigurados = slots.filter(slot => slot.equipoLocal && slot.equipoVisitante);
  const equiposParticipantes = new Set([
    ...slots.flatMap(slot => [slot.equipoLocal, slot.equipoVisitante].filter(Boolean))
  ]);

  // Calcular hora de finalización
  const calcularHoraFinalizacion = () => {
    if (!config.horaInicio || !config.numeroPartidos) return '';
    
    const [horas, minutos] = config.horaInicio.split(':').map(Number);
    const inicioEnMinutos = horas * 60 + minutos;
    
    const duracionTotal = config.numeroPartidos * config.duracionPartido + 
                         (config.numeroPartidos - 1) * config.descansoEntrePartidos;
    
    const finEnMinutos = inicioEnMinutos + duracionTotal;
    const horaFin = Math.floor(finEnMinutos / 60);
    const minutoFin = finEnMinutos % 60;
    
    return `${horaFin.toString().padStart(2, '0')}:${minutoFin.toString().padStart(2, '0')}`;
  };

  // Validar si la jornada está lista
  const jornadaCompleta = partidosConfigurados.length === config.numeroPartidos;
  const sinConflictos = !conflictos || conflictos.valido;

  return (
    <div className="space-y-6">
      {/* Header con estado */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Resumen de Jornada
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Revisa la configuración antes de crear la jornada
          </p>
        </div>
        
        <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
          jornadaCompleta && sinConflictos
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
        }`}>
          {jornadaCompleta && sinConflictos ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Listo para crear
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Requiere atención
            </>
          )}
        </div>
      </div>

      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de la jornada */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Información de la Jornada
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Liga:</span>
              <span className="font-medium text-gray-900 dark:text-white">{liga.nombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(config.fecha).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Hora de inicio:</span>
              <span className="font-medium text-gray-900 dark:text-white">{config.horaInicio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Hora de finalización:</span>
              <span className="font-medium text-gray-900 dark:text-white">{calcularHoraFinalizacion()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Duración total:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.floor((config.numeroPartidos * config.duracionPartido + 
                 (config.numeroPartidos - 1) * config.descansoEntrePartidos) / 60)}h {
                 (config.numeroPartidos * config.duracionPartido + 
                 (config.numeroPartidos - 1) * config.descansoEntrePartidos) % 60}min
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Estadísticas
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Partidos programados:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {partidosConfigurados.length} de {config.numeroPartidos}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Equipos participantes:</span>
              <span className="font-medium text-gray-900 dark:text-white">{equiposParticipantes.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Duración por partido:</span>
              <span className="font-medium text-gray-900 dark:text-white">{config.duracionPartido} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Descanso entre partidos:</span>
              <span className="font-medium text-gray-900 dark:text-white">{config.descansoEntrePartidos} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de partidos */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Partidos Programados
          </h4>
        </div>
        
        <div className="p-4 space-y-4">
          {slots.map((slot, index) => (
            <div
              key={slot.id}
              className={`border rounded-lg p-4 ${
                slot.equipoLocal && slot.equipoVisitante
                  ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    <Clock className="w-5 h-5 inline mr-2" />
                    {slot.horario}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Partido {index + 1}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {slot.equipoLocal && slot.equipoVisitante ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-5 gap-2 items-center">
                {/* Equipo Local */}
                <div className="col-span-2">
                  {slot.equipoLocal ? (
                    <div className="text-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                      <div className="font-medium text-blue-900 dark:text-blue-100">
                        {slot.equipoLocal.nombre}
                      </div>
                      {slot.equipoLocal.capitan && (
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          {slot.equipoLocal.capitan.nombre}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Sin asignar</span>
                    </div>
                  )}
                </div>

                {/* VS */}
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-400 dark:text-gray-500">VS</div>
                </div>

                {/* Equipo Visitante */}
                <div className="col-span-2">
                  {slot.equipoVisitante ? (
                    <div className="text-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                      <div className="font-medium text-blue-900 dark:text-blue-100">
                        {slot.equipoVisitante.nombre}
                      </div>
                      {slot.equipoVisitante.capitan && (
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          {slot.equipoVisitante.capitan.nombre}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Sin asignar</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {slots.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay partidos configurados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alertas y conflictos */}
      {(!jornadaCompleta || !sinConflictos) && (
        <div className="space-y-3">
          {!jornadaCompleta && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <div>
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Partidos incompletos
                  </h5>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Faltan {config.numeroPartidos - partidosConfigurados.length} partido(s) por configurar. 
                    Regresa al paso anterior para completar la asignación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {conflictos && !conflictos.valido && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-red-800 dark:text-red-200">
                    Conflictos de horarios detectados
                  </h5>
                  <div className="mt-2 space-y-1">
                    {conflictos.conflictos.map((conflicto, index) => (
                      <p key={index} className="text-sm text-red-700 dark:text-red-300">
                        • {conflicto.equipoNombre} ya tiene un partido programado en {conflicto.fechaConflicto}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmación final */}
      {jornadaCompleta && sinConflictos && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h5 className="font-medium text-green-800 dark:text-green-200">
                Jornada lista para crear
              </h5>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Todos los partidos están configurados correctamente y no hay conflictos de horarios.
                Puedes proceder a crear la jornada.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
