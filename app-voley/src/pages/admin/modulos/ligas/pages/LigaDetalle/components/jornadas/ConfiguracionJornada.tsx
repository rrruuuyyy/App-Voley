import React from 'react';
import { Calendar, Clock, Users, Timer } from 'lucide-react';

interface Liga {
  id: number;
  nombre: string;
  maxPartidosPorDia: number;
  duracionEstimadaPartido: number;
  descansoMinimo: number;
}

interface JornadaConfig {
  fecha: string;
  horaInicio: string;
  numeroPartidos: number;
  duracionPartido: number;
  descansoEntrePartidos: number;
  vuelta?: number;
}

interface ConfiguracionJornadaProps {
  liga: Liga;
  config: JornadaConfig;
  onConfigChange: (config: Partial<JornadaConfig>) => void;
  vueltaActual?: number;
  estadoVueltas?: any;
  partidosVueltaInfo?: {
    vuelta: any;
    partidos: any[];
    partidosSinCrear: number;
    partidosCreados: number;
    maxPartidos: number;
  } | null;
}

export const ConfiguracionJornada: React.FC<ConfiguracionJornadaProps> = ({
  liga,
  config,
  onConfigChange,
  vueltaActual,
  estadoVueltas,
  partidosVueltaInfo
}) => {
  // Calcular el máximo de partidos permitidos basado en partidos pendientes
  const maxPartidosPermitidos = partidosVueltaInfo?.partidosSinCrear || liga.maxPartidosPorDia || 10;
  // Calcular hora de finalización estimada
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

  return (
    <div className="space-y-6">
      {/* Información de vuelta actual */}
      {vueltaActual && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Vuelta Actual: {vueltaActual}
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Los partidos se programarán para esta vuelta
              </p>
            </div>
            {estadoVueltas && (
              <div className="text-right">
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Progreso: {estadoVueltas.vueltas?.find((v: any) => v.numero === vueltaActual)?.porcentajeCompletado?.toFixed(1) || 0}%
                </div>
              </div>
            )}
          </div>
          
          {/* Información de partidos de la vuelta */}
          {partidosVueltaInfo && (
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {partidosVueltaInfo.partidosCreados}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                  Creados
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {partidosVueltaInfo.partidosSinCrear}
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  Pendientes
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {partidosVueltaInfo.maxPartidos}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  Total
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulario de configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fecha de la jornada */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4 inline mr-2" />
            Fecha de la Jornada
          </label>
          <input
            type="date"
            value={config.fecha}
            onChange={(e) => onConfigChange({ fecha: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Hora de inicio */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4 inline mr-2" />
            Hora de Inicio
          </label>
          <input
            type="time"
            value={config.horaInicio}
            onChange={(e) => onConfigChange({ horaInicio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Número de partidos */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users className="w-4 h-4 inline mr-2" />
            Número de Partidos
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={maxPartidosPermitidos}
              onChange={(e) => {
                const valor = parseInt(e.target.value) || 1;
                const valorLimitado = Math.min(valor, maxPartidosPermitidos);
                onConfigChange({ numeroPartidos: valorLimitado });
              }}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              partidos (máx: {maxPartidosPermitidos})
            </span>
          </div>
          {partidosVueltaInfo ? (
            <div className="text-xs space-y-1">
              <p className="text-blue-600 dark:text-blue-400">
                Partidos disponibles en Vuelta {vueltaActual}: {partidosVueltaInfo.partidosSinCrear}
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Ya creados: {partidosVueltaInfo.partidosCreados} / {partidosVueltaInfo.maxPartidos}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Ingresa el número de partidos que deseas programar
            </p>
          )}
          
          {/* Alerta si se alcanza el límite */}
          {partidosVueltaInfo && partidosVueltaInfo.partidosSinCrear === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-2">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ No hay partidos pendientes por crear en esta vuelta
              </p>
            </div>
          )}
        </div>

        {/* Duración por partido */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Timer className="w-4 h-4 inline mr-2" />
            Duración por Partido (minutos)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="60"
              max="180"
              step="15"
              value={config.duracionPartido}
              onChange={(e) => onConfigChange({ duracionPartido: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[4rem]">
              {config.duracionPartido} min
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sugerido: {liga.duracionEstimadaPartido} minutos
          </p>
        </div>

        {/* Descanso entre partidos */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4 inline mr-2" />
            Descanso entre Partidos (minutos)
          </label>
          <div className="flex items-center space-x-2 max-w-md">
            <input
              type="number"
              min="0"
              step="5"
              value={config.descansoEntrePartidos}
              onChange={(e) => onConfigChange({ descansoEntrePartidos: parseInt(e.target.value) || 0 })}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">minutos</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Puedes configurar desde 0 minutos (partidos consecutivos) en adelante
          </p>
        </div>
      </div>

      {/* Resumen de tiempo */}
      {config.fecha && config.horaInicio && config.numeroPartidos > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h4 className="text-md font-medium text-green-900 dark:text-green-100 mb-3">
            Resumen de Tiempo
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-green-700 dark:text-green-300 font-medium">Inicio:</span>
              <p className="text-green-900 dark:text-green-100">{config.horaInicio}</p>
            </div>
            <div>
              <span className="text-green-700 dark:text-green-300 font-medium">Finalización:</span>
              <p className="text-green-900 dark:text-green-100">{calcularHoraFinalizacion()}</p>
            </div>
            <div>
              <span className="text-green-700 dark:text-green-300 font-medium">Duración total:</span>
              <p className="text-green-900 dark:text-green-100">
                {config.numeroPartidos * config.duracionPartido + 
                 (config.numeroPartidos - 1) * config.descansoEntrePartidos} min
              </p>
            </div>
            <div>
              <span className="text-green-700 dark:text-green-300 font-medium">Partidos:</span>
              <p className="text-green-900 dark:text-green-100">{config.numeroPartidos}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vista previa de horarios */}
      {config.numeroPartidos > 0 && config.horaInicio && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Vista Previa de Horarios
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: config.numeroPartidos }, (_, index) => {
              const [horas, minutos] = config.horaInicio.split(':').map(Number);
              const inicioEnMinutos = horas * 60 + minutos;
              const inicioPartidoEnMinutos = inicioEnMinutos + 
                index * (config.duracionPartido + config.descansoEntrePartidos);
              
              const horaInicio = Math.floor(inicioPartidoEnMinutos / 60);
              const minutoInicio = inicioPartidoEnMinutos % 60;
              const horaInicioStr = `${horaInicio.toString().padStart(2, '0')}:${minutoInicio.toString().padStart(2, '0')}`;
              
              const finPartidoEnMinutos = inicioPartidoEnMinutos + config.duracionPartido;
              const horaFin = Math.floor(finPartidoEnMinutos / 60);
              const minutoFin = finPartidoEnMinutos % 60;
              const horaFinStr = `${horaFin.toString().padStart(2, '0')}:${minutoFin.toString().padStart(2, '0')}`;
              
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Partido {index + 1}
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {horaInicioStr}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    hasta {horaFinStr}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
