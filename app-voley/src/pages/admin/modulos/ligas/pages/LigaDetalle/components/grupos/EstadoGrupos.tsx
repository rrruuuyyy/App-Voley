import React from 'react';
import { Users, RefreshCw, AlertCircle } from 'lucide-react';
import type { EstadoGrupos as EstadoGruposType } from '../../../../types';

interface EstadoGruposProps {
  estadoGrupos?: EstadoGruposType;
  isLoading: boolean;
  onActualizar: () => void;
}

const EstadoGrupos: React.FC<EstadoGruposProps> = ({ 
  estadoGrupos, 
  isLoading, 
  onActualizar 
}) => {
  if (isLoading && !estadoGrupos) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-500">Cargando estado de grupos...</span>
      </div>
    );
  }

  if (!estadoGrupos) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          No se pudo cargar el estado de grupos
        </p>
        <button
          onClick={onActualizar}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {estadoGrupos.liga.nombre}
            </h3>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Total equipos: {estadoGrupos.totalEquipos}</span>
              <span>Equipos asignados: {estadoGrupos.equiposAsignados}</span>
              <span>Sin asignar: {estadoGrupos.equiposSinAsignar}</span>
            </div>
          </div>
          <button
            onClick={onActualizar}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            title="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estadoGrupos.grupos.map(grupo => (
          <div
            key={grupo.grupoNumero}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Grupo {grupo.grupoNumero}
              </h4>
              <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                {grupo.cantidadEquipos} equipos
              </span>
            </div>

            <div className="space-y-2">
              {grupo.equipos.length > 0 ? (
                grupo.equipos.map(equipo => (
                  <div
                    key={equipo.id}
                    className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    {equipo.color && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: equipo.color }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {equipo.nombre}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Cap: {equipo.capitan.nombre}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Sin equipos asignados</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Equipos sin grupo */}
      {estadoGrupos.equiposSinGrupo.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <h4 className="flex items-center text-orange-800 dark:text-orange-200 font-medium mb-3">
            <AlertCircle className="w-4 h-4 mr-2" />
            Equipos sin asignar ({estadoGrupos.equiposSinGrupo.length})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {estadoGrupos.equiposSinGrupo.map(equipo => (
              <div
                key={equipo.id}
                className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border border-orange-200 dark:border-orange-700"
              >
                {equipo.color && (
                  <div
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: equipo.color }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {equipo.nombre}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Cap: {equipo.capitan.nombre}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {estadoGrupos.totalEquipos === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay equipos en esta liga
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Primero debes crear equipos asignando capitanes antes de poder configurar grupos.
          </p>
        </div>
      )}
    </div>
  );
};

export default EstadoGrupos;
