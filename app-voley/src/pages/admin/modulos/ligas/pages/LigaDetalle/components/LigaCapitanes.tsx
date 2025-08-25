import React, { useState } from 'react';
import { Users, UserPlus, CheckCircle, XCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { CapitanLiga } from '../../../types';

interface LigaCapitanesProps {
  capitanes: CapitanLiga[];
  canManageCapitanes: boolean;
  onOpenCapitanesModal: () => void;
  onOpenEquipoModal: (capitan: CapitanLiga) => void;
  onEliminarCapitan: (capitanId: number) => void;
  isEliminating: boolean;
}

const LigaCapitanes: React.FC<LigaCapitanesProps> = ({
  capitanes,
  canManageCapitanes,
  onOpenCapitanesModal,
  onOpenEquipoModal,
  onEliminarCapitan,
  isEliminating
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Header expandible */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Capitanes de Equipos ({capitanes.length})
          </h2>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
        {canManageCapitanes && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCapitanesModal();
            }}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Asignar Capitanes
          </button>
        )}
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {capitanes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {capitanes.map((capitan) => (
                <div
                  key={capitan.id}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  {/* Header del card con nombre y estado */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {capitan.nombre}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {capitan.correo}
                      </p>
                    </div>
                    
                    {/* Eliminar capitán */}
                    {canManageCapitanes && (
                      <button
                        onClick={() => onEliminarCapitan(capitan.id)}
                        disabled={isEliminating}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 ml-2"
                        title="Eliminar capitán"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Estado del equipo */}
                  <div className="mb-3">
                    {capitan.equipo ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs font-medium">Equipo Creado</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-orange-500">
                        <XCircle className="w-3 h-3" />
                        <span className="text-xs font-medium">Sin Equipo</span>
                      </div>
                    )}
                  </div>

                  {/* Información del equipo */}
                  {capitan.equipo && (
                    <div className="mb-3 p-2 bg-white dark:bg-gray-600 rounded text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Equipo:</span>
                      <div className="text-gray-600 dark:text-gray-400 truncate">
                        {capitan.equipo.nombre}
                      </div>
                    </div>
                  )}

                  {/* Botón de acción */}
                  <button
                    onClick={() => onOpenEquipoModal(capitan)}
                    className="w-full px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {capitan.equipo ? 'Gestionar Equipo' : 'Crear Equipo'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                No hay capitanes asignados a esta liga
              </p>
              {canManageCapitanes && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Haz clic en "Asignar Capitanes" para comenzar
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LigaCapitanes;
