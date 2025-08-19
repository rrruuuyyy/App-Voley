import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { 
  useEstadoGrupos, 
  useValidacionGrupos, 
  useAsignarGruposAutomatico 
} from '../../../../hooks/useLigaQueries';
import EstadoGrupos from './EstadoGrupos';
import AsignacionAutomatica from './AsignacionAutomatica';
import ValidacionGrupos from './ValidacionGrupos';
import type { MetodoAsignacion } from '../../../../types';

interface ConfiguracionGruposProps {
  ligaId: number;
  onConfiguracionCompleta?: () => void;
}

const ConfiguracionGrupos: React.FC<ConfiguracionGruposProps> = ({ 
  ligaId, 
  onConfiguracionCompleta 
}) => {
  const [activeTab, setActiveTab] = useState<'estado' | 'asignacion' | 'validacion'>('estado');

  // Queries
  const { 
    data: estadoGrupos, 
    isLoading: isLoadingEstado, 
    refetch: refetchEstado 
  } = useEstadoGrupos(ligaId);
  
  const { 
    data: validacionGrupos, 
    isLoading: isLoadingValidacion, 
    refetch: refetchValidacion 
  } = useValidacionGrupos(ligaId);

  // Mutations
  const asignarAutomaticoMutation = useAsignarGruposAutomatico({
    onSuccess: (result) => {
      toast.success(result.message);
      refetchEstado();
      refetchValidacion();
      if (result.resumenGrupos.every(g => g.cantidadEquipos >= 2)) {
        onConfiguracionCompleta?.();
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al asignar grupos');
    }
  });

  const isLoading = isLoadingEstado || isLoadingValidacion || asignarAutomaticoMutation.isPending;

  const handleAsignacionAutomatica = async (metodo: MetodoAsignacion) => {
    if (!ligaId) return;
    
    try {
      await asignarAutomaticoMutation.mutateAsync({
        ligaId,
        metodo
      });
    } catch (error) {
      // Error handled in onError callback
    }
  };

  const handleActualizar = () => {
    refetchEstado();
    refetchValidacion();
  };

  // Auto switch to validation tab if estado is loaded and has assignments
  useEffect(() => {
    if (estadoGrupos && estadoGrupos.equiposAsignados > 0 && activeTab === 'estado') {
      setActiveTab('validacion');
    }
  }, [estadoGrupos, activeTab]);

  if (isLoadingEstado && !estadoGrupos) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-500">Cargando configuración de grupos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-600 p-6">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Configuración de Grupos
          </h2>
          {estadoGrupos && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({estadoGrupos.liga.numeroGrupos} grupos • {estadoGrupos.totalEquipos} equipos)
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('estado')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'estado'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Estado Actual</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('asignacion')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'asignacion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Asignación</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('validacion')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'validacion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {validacionGrupos?.validacion.esValida ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              )}
              <span>Validación</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'estado' && (
          <EstadoGrupos 
            estadoGrupos={estadoGrupos} 
            isLoading={isLoadingEstado}
            onActualizar={handleActualizar}
          />
        )}

        {activeTab === 'asignacion' && (
          <AsignacionAutomatica 
            estadoGrupos={estadoGrupos}
            onAsignar={handleAsignacionAutomatica}
            isLoading={asignarAutomaticoMutation.isPending}
          />
        )}

        {activeTab === 'validacion' && (
          <ValidacionGrupos 
            validacionGrupos={validacionGrupos}
            isLoading={isLoadingValidacion}
            onActualizar={handleActualizar}
            onConfiguracionCompleta={onConfiguracionCompleta}
          />
        )}
      </div>

      {/* Global loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Procesando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracionGrupos;
