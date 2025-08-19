import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Play, RefreshCw } from 'lucide-react';
import type { ValidacionGrupos as ValidacionGruposType } from '../../../../types';

interface ValidacionGruposProps {
  validacionGrupos?: ValidacionGruposType;
  isLoading: boolean;
  onActualizar: () => void;
  onConfiguracionCompleta?: () => void;
}

const ValidacionGrupos: React.FC<ValidacionGruposProps> = ({
  validacionGrupos,
  isLoading,
  onActualizar,
  onConfiguracionCompleta
}) => {
  if (isLoading && !validacionGrupos) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-500">Validando configuración...</span>
      </div>
    );
  }

  if (!validacionGrupos) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          No se pudo validar la configuración
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

  const { validacion } = validacionGrupos;

  return (
    <div className="space-y-6">
      {/* Estado de validación */}
      <div className={`
        border rounded-lg p-4
        ${validacion.esValida 
          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
          : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
        }
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {validacion.esValida ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
            <div>
              <h3 className={`font-semibold ${
                validacion.esValida 
                  ? 'text-green-900 dark:text-green-100' 
                  : 'text-red-900 dark:text-red-100'
              }`}>
                {validacion.esValida ? 'Configuración Válida' : 'Problemas Encontrados'}
              </h3>
              <p className={`text-sm ${
                validacion.esValida 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {validacion.puedeIniciarLiga 
                  ? 'La liga está lista para iniciar' 
                  : 'No se puede iniciar la liga aún'
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={onActualizar}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            title="Revalidar"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Resumen de equipos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {validacionGrupos.totalEquipos}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total de equipos
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {validacionGrupos.equiposAsignados}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Equipos asignados
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className={`text-2xl font-bold ${
            validacionGrupos.equiposSinAsignar === 0 ? 'text-green-600' : 'text-orange-600'
          }`}>
            {validacionGrupos.equiposSinAsignar}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Sin asignar
          </div>
        </div>
      </div>

      {/* Problemas encontrados */}
      {validacion.problemas.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h4 className="flex items-center text-red-800 dark:text-red-200 font-medium mb-3">
            <XCircle className="w-4 h-4 mr-2" />
            Problemas que deben resolverse:
          </h4>
          <ul className="space-y-2">
            {validacion.problemas.map((problema, index) => (
              <li key={index} className="flex items-start text-red-700 dark:text-red-300 text-sm">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                {problema}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recomendaciones */}
      {validacion.recomendaciones.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <h4 className="flex items-center text-orange-800 dark:text-orange-200 font-medium mb-3">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Recomendaciones:
          </h4>
          <ul className="space-y-2">
            {validacion.recomendaciones.map((recomendacion, index) => (
              <li key={index} className="flex items-start text-orange-700 dark:text-orange-300 text-sm">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                {recomendacion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grupos detallados */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Distribución de grupos:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validacionGrupos.grupos.map(grupo => (
            <div
              key={grupo.grupoNumero}
              className={`
                border rounded-lg p-4
                ${grupo.cantidadEquipos >= 2 
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                  : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  Grupo {grupo.grupoNumero}
                </h5>
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${grupo.cantidadEquipos >= 2
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }
                `}>
                  {grupo.cantidadEquipos} equipos
                </span>
              </div>
              
              {grupo.cantidadEquipos >= 2 ? (
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Válido para competencia
                </div>
              ) : (
                <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Necesita más equipos
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Acción de finalización */}
      {validacion.puedeIniciarLiga && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-green-900 dark:text-green-100 font-semibold mb-2">
                🎉 ¡Configuración completada!
              </h4>
              <p className="text-green-800 dark:text-green-200 text-sm">
                La configuración de grupos es válida. Ya puedes continuar con la inicialización de la liga.
              </p>
            </div>
            
            {onConfiguracionCompleta && (
              <button
                onClick={onConfiguracionCompleta}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                <Play className="w-4 h-4" />
                <span>Continuar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidacionGrupos;
