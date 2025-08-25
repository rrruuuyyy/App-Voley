import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, Save, RotateCcw } from 'lucide-react';
import { Modal } from '../../../../../../../../common/components/Modal';
import { ConfiguracionJornada } from './ConfiguracionJornada';
import { AsignacionPartidos } from './AsignacionPartidos';
import { ResumenJornada } from './ResumenJornada';
import { useJornadasGestion } from '../../../../hooks/useJornadasGestion';
import type { Liga } from '../../../../types';

interface GestionJornadasProps {
  liga: Liga;
}

export const GestionJornadas: React.FC<GestionJornadasProps> = ({ liga }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [paso, setPaso] = useState<'configuracion' | 'asignacion' | 'resumen'>('configuracion');

  const {
    jornadaConfig,
    partidosSlots,
    estadoLiga,
    equiposDisponibles,
    isCreatingJornada,
    updateJornadaConfig,
    resetJornadaConfig,
    generarSlotsPartidos,
    setPartidosSlots,
    crearJornada,
    conflictosValidation,
    estadoLoading,
    equiposLoading,
    estadoError
  } = useJornadasGestion(liga.id);

  // Resetear al cerrar modal
  const handleCerrarModal = () => {
    setMostrarModal(false);
    setPaso('configuracion');
    resetJornadaConfig();
  };

  // Avanzar al siguiente paso
  const handleSiguientePaso = () => {
    if (paso === 'configuracion') {
      generarSlotsPartidos();
      setPaso('asignacion');
    } else if (paso === 'asignacion') {
      setPaso('resumen');
    }
  };

  // Retroceder al paso anterior
  const handlePasoAnterior = () => {
    if (paso === 'asignacion') {
      setPaso('configuracion');
    } else if (paso === 'resumen') {
      setPaso('asignacion');
    }
  };

  // Crear la jornada
  const handleCrearJornada = () => {
    // Construir los datos de la jornada
    const jornadaData = {
      nombre: `Jornada del ${new Date(jornadaConfig.fecha).toLocaleDateString()}`,
      descripcion: `Jornada personalizada con ${jornadaConfig.numeroPartidos} partidos`,
      ligaId: liga.id,
      fechaProgramada: jornadaConfig.fecha,
      horaProgramada: jornadaConfig.horaInicio,
      partidos: partidosSlots
        .filter(slot => slot.equipoLocal && slot.equipoVisitante)
        .map(slot => ({
          equipoLocalId: slot.equipoLocal!.id,
          equipoVisitanteId: slot.equipoVisitante!.id,
          vuelta: 1, // Por defecto primera vuelta
          fechaHora: `${jornadaConfig.fecha}T${slot.horario}:00`
        }))
    };

    crearJornada(jornadaData);
  };

  // Validar si se puede continuar según el paso actual
  const puedeAvanzar = () => {
    switch (paso) {
      case 'configuracion':
        return jornadaConfig.fecha && jornadaConfig.horaInicio && jornadaConfig.numeroPartidos > 0;
      case 'asignacion':
        return true; // Por ahora siempre true
      case 'resumen':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Gestión de Jornadas
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Crea y gestiona jornadas personalizadas para la liga
            </p>
          </div>
          <button
            onClick={() => setMostrarModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Jornada
          </button>
        </div>

        {/* Estadísticas rápidas */}
        {estadoLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : estadoLiga ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                  {estadoLiga.resumen.equiposTotal} Equipos
                </span>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="ml-2 text-sm font-medium text-green-900 dark:text-green-100">
                  {estadoLiga.resumen.partidosCompletados} Completados
                </span>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="ml-2 text-sm font-medium text-yellow-900 dark:text-yellow-100">
                  {estadoLiga.resumen.partidosPendientes} Pendientes
                </span>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {estadoLiga.resumen.porcentajeCompletado.toFixed(1)}% Progreso
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full"
                  style={{ width: `${estadoLiga.resumen.porcentajeCompletado}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No se pudo cargar la información de la liga
            </p>
            {estadoError && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Error: {estadoError.message || 'Error desconocido'}
                </p>
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer">Ver detalles técnicos</summary>
                  <pre className="text-xs mt-1 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-auto">
                    {JSON.stringify(estadoError, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para crear jornada */}
      <Modal
        isOpen={mostrarModal}
        onClose={handleCerrarModal}
        title="Crear Jornada Personalizada"
        size="xl"
      >
        <div className="space-y-6">
          {/* Indicador de pasos */}
          <div className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'configuracion', label: 'Configuración', icon: Calendar },
              { key: 'asignacion', label: 'Asignación', icon: Users },
              { key: 'resumen', label: 'Resumen', icon: Save }
            ].map(({ key, label, icon: Icon }, index) => (
              <div key={key} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${paso === key 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : index < ['configuracion', 'asignacion', 'resumen'].indexOf(paso)
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  paso === key 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {label}
                </span>
                {index < 2 && (
                  <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 ml-4" />
                )}
              </div>
            ))}
          </div>

          {/* Contenido según el paso */}
          <div className="min-h-[400px]">
            {paso === 'configuracion' && (
              <ConfiguracionJornada 
                liga={liga} 
                config={jornadaConfig}
                onConfigChange={updateJornadaConfig}
              />
            )}
            {paso === 'asignacion' && (
              equiposLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Cargando equipos disponibles...</p>
                  </div>
                </div>
              ) : (
                <AsignacionPartidos 
                  config={jornadaConfig}
                  slots={partidosSlots}
                  equiposDisponibles={equiposDisponibles}
                  onSlotsChange={setPartidosSlots}
                />
              )
            )}
            {paso === 'resumen' && (
              <ResumenJornada 
                liga={liga}
                config={jornadaConfig}
                slots={partidosSlots}
                conflictos={conflictosValidation}
              />
            )}
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              {paso !== 'configuracion' && (
                <button
                  onClick={handlePasoAnterior}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Anterior
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCerrarModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>

              {paso === 'resumen' ? (
                <button
                  onClick={handleCrearJornada}
                  disabled={isCreatingJornada}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isCreatingJornada ? 'Creando...' : 'Crear Jornada'}
                </button>
              ) : (
                <button
                  onClick={handleSiguientePaso}
                  disabled={!puedeAvanzar()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
