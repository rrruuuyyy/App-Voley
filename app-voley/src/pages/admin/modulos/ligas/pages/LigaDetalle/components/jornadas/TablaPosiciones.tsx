import React, { useState } from 'react';
import { Trophy, ChevronDown, ChevronUp, Medal, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import httpRest from '../../../../../../../../services/httpRest';
import type { Liga } from '../../../../types';

interface EquipoPosicion {
  equipo: {
    id: number;
    nombre: string;
    capitan: {
      nombre: string;
    };
  };
  partidosJugados: number;
  victorias: number;          // Cambio: API usa 'victorias' no 'partidosGanados'
  derrotas: number;           // Cambio: API usa 'derrotas' no 'partidosPerdidos'
  setsGanados: number;
  setsPerdidos: number;
  puntosAFavor: number;
  puntosEnContra: number;
  puntosLiga: number;
  setRatio: number;           // Cambio: API usa 'setRatio' no 'razonSets'
  pointRatio: number;         // Cambio: API usa 'pointRatio' no 'razonPuntos'
}

interface TablaPosicionesProps {
  liga: Liga;
}

const useTablaposiciones = (ligaId: number) => {
  return useQuery({
    queryKey: ['tablaposiciones', ligaId],
    queryFn: async (): Promise<EquipoPosicion[]> => {  // Cambio: retorna array directo
      return await httpRest.get(`/partido/tabla/${ligaId}`);
    },
    enabled: !!ligaId,
    refetchInterval: 60000, // Refrescar cada minuto
  });
};

export const TablaPosiciones: React.FC<TablaPosicionesProps> = ({ liga }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: tablaData, isLoading, error } = useTablaposiciones(liga.id);

  // Para debugging - ver qué datos llegan de la API
  console.log('Datos de tabla recibidos:', tablaData);
  console.log('Error en tabla:', error);

  // Ser flexible con la estructura de respuesta de la API
  // Puede ser un array directo o un objeto con propiedad 'tabla'
  const tabla = Array.isArray(tablaData) 
    ? tablaData 
    : tablaData?.tabla || [];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getPosicionIcon = (posicion: number) => {
    switch (posicion) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">{posicion}</span>;
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
          <Trophy className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tabla de Posiciones ({tabla.length} equipos)
          </h2>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total de equipos: {tabla.length}
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando tabla...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm text-red-600 dark:text-red-400">Error al cargar la tabla de posiciones</p>
            </div>
          ) : tabla.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Pos</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Equipo</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">PJ</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">PG</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">PP</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">SG</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">SP</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Ratio Sets</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">PA</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">PC</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300">Ratio Pts</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/50">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {tabla.map((equipo: EquipoPosicion, index: number) => (
                    <tr 
                      key={equipo.equipo.id}
                      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        index < 3 ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          {getPosicionIcon(index + 1)}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {equipo.equipo.nombre}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Cap: {equipo.equipo.capitan.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2 text-gray-900 dark:text-white">{equipo.partidosJugados}</td>
                      <td className="text-center py-3 px-2 text-green-600 dark:text-green-400 font-medium">{equipo.victorias}</td>
                      <td className="text-center py-3 px-2 text-red-600 dark:text-red-400">{equipo.derrotas}</td>
                      <td className="text-center py-3 px-2 text-gray-900 dark:text-white">{equipo.setsGanados}</td>
                      <td className="text-center py-3 px-2 text-gray-900 dark:text-white">{equipo.setsPerdidos}</td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-300">{equipo.setRatio.toFixed(2)}</td>
                      <td className="text-center py-3 px-2 text-gray-900 dark:text-white">{equipo.puntosAFavor}</td>
                      <td className="text-center py-3 px-2 text-gray-900 dark:text-white">{equipo.puntosEnContra}</td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-300">{equipo.pointRatio.toFixed(2)}</td>
                      <td className="text-center py-3 px-2 bg-blue-50 dark:bg-blue-900/50">
                        <span className="font-bold text-lg text-blue-700 dark:text-blue-300">
                          {equipo.puntosLiga}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Leyenda */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <span><strong>PJ:</strong> Partidos Jugados</span>
                    <span><strong>PG:</strong> Partidos Ganados</span>
                    <span><strong>PP:</strong> Partidos Perdidos</span>
                    <span><strong>SG:</strong> Sets Ganados</span>
                    <span><strong>SP:</strong> Sets Perdidos</span>
                    <span><strong>PA:</strong> Puntos A Favor</span>
                    <span><strong>PC:</strong> Puntos En Contra</span>
                    <span><strong>Puntos:</strong> Puntos de Liga</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                No hay datos en la tabla de posiciones
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Los datos aparecerán cuando se jueguen partidos
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TablaPosiciones;
