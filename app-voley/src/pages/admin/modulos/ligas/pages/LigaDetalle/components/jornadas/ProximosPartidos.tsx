import React, { useState } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp, Trophy, MapPin, Upload } from 'lucide-react';
import { useProximosPartidos } from '../../hooks';
import ModalSubirResultado from './ModalSubirResultado';
import type { Liga } from '../../../../types';

interface Partido {
  id: number;
  jornada: number;
  vuelta: number;
  fechaHora: string;
  equipoLocal: {
    id: number;
    nombre: string;
  };
  equipoVisitante: {
    id: number;
    nombre: string;
  };
  status: 'programado' | 'en_curso' | 'finalizado';
}

interface ProximosPartidosProps {
  liga: Liga;
}

export const ProximosPartidos: React.FC<ProximosPartidosProps> = ({ liga }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showModalResultado, setShowModalResultado] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);
  
  // Usar el hook para obtener próximos partidos
  const { data: partidosData, isLoading, refetch } = useProximosPartidos(liga.id);
  
  // Ser flexible con la estructura de respuesta de la API
  // Puede ser un array directo o un objeto con propiedad 'partidos'
  const proximosPartidos: Partido[] = Array.isArray(partidosData) 
    ? partidosData 
    : partidosData?.partidos || [];

  console.log('Datos de partidos recibidos:', partidosData); // Para debugging

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubirResultado = (partido: Partido) => {
    setPartidoSeleccionado(partido);
    setShowModalResultado(true);
  };

  const handleCloseModal = () => {
    setShowModalResultado(false);
    setPartidoSeleccionado(null);
  };

  const handleResultadoGuardado = () => {
    refetch(); // Refrescar la lista de partidos
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'programado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'en_curso':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'programado':
        return 'Programado';
      case 'en_curso':
        return 'En Curso';
      case 'finalizado':
        return 'Finalizado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Header expandible */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Próximos Partidos ({proximosPartidos.length})
          </h2>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Liga en curso
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
            En Curso
          </span>
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando partidos...</span>
            </div>
          ) : proximosPartidos.length > 0 ? (
            <div className="space-y-4">
              {proximosPartidos.map((partido) => (
                <div
                  key={partido.id}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Jornada {partido.jornada} - Vuelta {partido.vuelta}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(partido.status)}`}>
                        {getStatusText(partido.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(partido.fechaHora)}</span>
                    </div>
                  </div>

                  {/* Equipos enfrentados */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {partido.equipoLocal.nombre}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Local</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-lg font-bold text-gray-500 dark:text-gray-400">VS</span>
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {partido.equipoVisitante.nombre}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Visitante</div>
                    </div>
                  </div>

                  {/* Fecha y ubicación */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(partido.fechaHora)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Sede Principal</span>
                      </div>
                    </div>

                    {/* Botón para subir resultado */}
                    {partido.status === 'programado' && (
                      <button
                        onClick={() => handleSubirResultado(partido)}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Subir Resultado</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                No hay partidos programados próximamente
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Los partidos aparecerán aquí cuando se creen las jornadas
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal para subir resultado */}
      <ModalSubirResultado
        isOpen={showModalResultado}
        onClose={handleCloseModal}
        partido={partidoSeleccionado}
        onResultadoGuardado={handleResultadoGuardado}
      />
    </div>
  );
};

export default ProximosPartidos;
