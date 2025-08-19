import React, { useState } from 'react';
import { Shuffle, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import type { EstadoGrupos, MetodoAsignacion } from '../../../../types';
import { MetodoAsignacionEnum } from '../../../../types';

interface AsignacionAutomaticaProps {
  estadoGrupos?: EstadoGrupos;
  onAsignar: (metodo: MetodoAsignacion) => void;
  isLoading: boolean;
}

const AsignacionAutomatica: React.FC<AsignacionAutomaticaProps> = ({
  estadoGrupos,
  onAsignar,
  isLoading
}) => {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoAsignacion>(MetodoAsignacionEnum.BALANCEADO);

  const metodos = [
    {
      value: MetodoAsignacionEnum.BALANCEADO,
      label: 'Balanceado',
      description: 'Distribuye equipos equitativamente entre grupos',
      icon: Shuffle,
      enabled: true
    },
    {
      value: MetodoAsignacionEnum.ALEATORIO,
      label: 'Aleatorio',
      description: 'Asignación completamente aleatoria',
      icon: Zap,
      enabled: true
    },
    {
      value: MetodoAsignacionEnum.POR_RANKING,
      label: 'Por Ranking',
      description: 'Basado en estadísticas históricas (próximamente)',
      icon: TrendingUp,
      enabled: false
    }
  ];

  const canAssign = estadoGrupos && estadoGrupos.totalEquipos > 0;
  const hasUnassignedTeams = estadoGrupos && estadoGrupos.equiposSinAsignar > 0;

  const handleAsignar = () => {
    if (!canAssign) return;
    onAsignar(metodoSeleccionado);
  };

  if (!estadoGrupos) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-500">Cargando información de grupos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información actual */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Estado Actual
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Total de equipos:</span>
            <div className="text-blue-900 dark:text-blue-100 font-semibold">
              {estadoGrupos.totalEquipos}
            </div>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Ya asignados:</span>
            <div className="text-blue-900 dark:text-blue-100 font-semibold">
              {estadoGrupos.equiposAsignados}
            </div>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Sin asignar:</span>
            <div className="text-blue-900 dark:text-blue-100 font-semibold">
              {estadoGrupos.equiposSinAsignar}
            </div>
          </div>
        </div>
      </div>

      {/* Advertencia si no hay equipos */}
      {!canAssign && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <h4 className="text-orange-800 dark:text-orange-200 font-medium">
                No hay equipos para asignar
              </h4>
              <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                Primero debes crear equipos asignando capitanes a la liga.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Métodos de asignación */}
      {canAssign && (
        <>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Selecciona el método de asignación:
            </h4>
            
            <div className="space-y-3">
              {metodos.map(metodo => {
                const IconComponent = metodo.icon;
                const isSelected = metodoSeleccionado === metodo.value;
                
                return (
                  <label
                    key={metodo.value}
                    className={`
                      flex items-start p-4 border rounded-lg cursor-pointer transition-all
                      ${metodo.enabled ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-600'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={metodo.value}
                      checked={isSelected}
                      onChange={(e) => setMetodoSeleccionado(e.target.value as MetodoAsignacion)}
                      disabled={!metodo.enabled}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {metodo.label}
                        </span>
                        {!metodo.enabled && (
                          <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-2 py-1 rounded">
                            Próximamente
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {metodo.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Acción */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                ¿Proceder con la asignación?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {hasUnassignedTeams 
                  ? `Se asignarán ${estadoGrupos.equiposSinAsignar} equipos pendientes`
                  : 'Se reasignarán todos los equipos según el método seleccionado'
                }
              </p>
            </div>
            
            <button
              onClick={handleAsignar}
              disabled={isLoading || !metodos.find(m => m.value === metodoSeleccionado)?.enabled}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Asignando...</span>
                </div>
              ) : (
                'Asignar Grupos'
              )}
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <p>
              <strong>Nota:</strong> La asignación automática redistribuirá todos los equipos. 
              Si ya tienes equipos asignados manualmente y quieres mantener esas asignaciones, 
              usa la asignación manual desde la pestaña "Estado Actual".
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AsignacionAutomatica;
