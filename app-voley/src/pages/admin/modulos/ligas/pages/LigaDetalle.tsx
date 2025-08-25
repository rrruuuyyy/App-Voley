import React from 'react';
import { ArrowLeft, Edit3, PlayCircle, StopCircle } from 'lucide-react';
import { PageHeader } from '../../../../../common';
import { Modal } from '../../../../../common/components/Modal';
import { EquipoManagement } from '../../equipos/components/EquipoManagement';
import { LigaStatusEnum } from '../types';
import { 
  LigaInformacion, 
  LigaCapitanes, 
  CapitanesModal, 
  CreateUserForm,
  GestionJornadas
} from './LigaDetalle/components';
import { ConfiguracionGrupos } from './LigaDetalle/components/grupos';
import { 
  useLigaDetalle,
  useLigaActions
} from './LigaDetalle/hooks';

const LigaDetalle: React.FC = () => {
  const {
    liga,
    capitanes,
    ligaLoading,
    ligaError,
    showCapitanesModal,
    selectedCapitanes,
    showCreateUserForm,
    showEquipoModal,
    selectedCapitanForEquipo,
    asignarCapitanesMutation,
    createUsuarioMutation,
    eliminarCapitanMutation,
    register,
    handleSubmit,
    errors,
    handleOpenCapitanesModal,
    handleCloseCapitanesModal,
    handleAddCapitan,
    handleRemoveCapitan,
    handleSaveCapitanes,
    handleEliminarCapitan,
    handleToggleCreateUserForm,
    handleCreateCapitan,
    handleOpenEquipoModal,
    handleCloseEquipoModal,
    handleEquipoCreated,
    handleGoBack,
    handleEditLiga,
    currentCapitanesIds,
    getCapitanEquipo,
    canManageCapitanes,
    canEditLiga,
    ligaId,
  } = useLigaDetalle();

  const {
    iniciarLigaMutation,
    finalizarLigaMutation,
    handleIniciarLiga,
    handleFinalizarLiga,
  } = useLigaActions();

  if (ligaLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando información de la liga...</p>
        </div>
      </div>
    );
  }

  if (ligaError || !liga) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error al cargar la liga</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a ligas
          </button>
        </div>
      </div>
    );
  }

  // Permisos adicionales para acciones
  const canStartLiga = liga.status === LigaStatusEnum.PROGRAMADA && capitanes.length > 0;
  const canFinishLiga = liga.status === LigaStatusEnum.EN_CURSO;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <PageHeader
          title={liga.nombre}
          subtitle={liga.descripcion || 'Información de la liga'}
          actions={
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              
              {canEditLiga && (
                <button
                  onClick={handleEditLiga}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </button>
              )}

              {canStartLiga && (
                <button
                  onClick={() => handleIniciarLiga(ligaId)}
                  disabled={iniciarLigaMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {iniciarLigaMutation.isPending ? 'Iniciando...' : 'Iniciar Liga'}
                </button>
              )}

              {canFinishLiga && (
                <button
                  onClick={() => handleFinalizarLiga(ligaId)}
                  disabled={finalizarLigaMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  {finalizarLigaMutation.isPending ? 'Finalizando...' : 'Finalizar Liga'}
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-6 space-y-6">
          {/* Información General */}
          <LigaInformacion liga={liga} />

          {/* Configuración de Grupos - Solo si hay más de 1 grupo */}
          {liga.numeroGrupos > 1 && liga.status === LigaStatusEnum.PROGRAMADA && (
            <ConfiguracionGrupos 
              ligaId={liga.id}
              onConfiguracionCompleta={() => {
                // Callback cuando la configuración esté completa
                console.log('Configuración de grupos completada');
              }}
            />
          )}

          {/* Capitanes de Equipos */}
          <LigaCapitanes
            capitanes={capitanes}
            canManageCapitanes={canManageCapitanes}
            onOpenCapitanesModal={handleOpenCapitanesModal}
            onOpenEquipoModal={handleOpenEquipoModal}
            onEliminarCapitan={handleEliminarCapitan}
            isEliminating={eliminarCapitanMutation.isPending}
          />

          {/* Gestión de Jornadas - Solo si la liga está en curso */}
          {liga.status === LigaStatusEnum.EN_CURSO && (
            <GestionJornadas liga={liga} />
          )}
        </div>
      </div>

      {/* Modal de Asignar Capitanes */}
      <CapitanesModal
        isOpen={showCapitanesModal}
        onClose={handleCloseCapitanesModal}
        selectedCapitanes={selectedCapitanes}
        showCreateUserForm={showCreateUserForm}
        currentCapitanesIds={currentCapitanesIds}
        isLoading={asignarCapitanesMutation.isPending}
        isCreatingUser={createUsuarioMutation.isPending}
        onAddCapitan={handleAddCapitan}
        onRemoveCapitan={handleRemoveCapitan}
        onToggleCreateUserForm={handleToggleCreateUserForm}
        onSave={handleSaveCapitanes}
      >
        {showCreateUserForm && (
          <CreateUserForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={handleCreateCapitan}
            onCancel={handleToggleCreateUserForm}
            isLoading={createUsuarioMutation.isPending}
          />
        )}
      </CapitanesModal>

      {/* Modal de Gestión de Equipos */}
      <Modal
        isOpen={showEquipoModal}
        onClose={handleCloseEquipoModal}
        title={selectedCapitanForEquipo ? `Gestionar Equipo - ${selectedCapitanForEquipo.nombre}` : 'Gestionar Equipo'}
        size="xl"
      >
        {selectedCapitanForEquipo && (
          <EquipoManagement
            ligaId={ligaId}
            capitan={{
              id: selectedCapitanForEquipo.id,
              nombre: selectedCapitanForEquipo.nombre,
              correo: selectedCapitanForEquipo.correo
            }}
            equipo={getCapitanEquipo(selectedCapitanForEquipo.id) as any}
            onEquipoCreated={handleEquipoCreated}
            onClose={handleCloseEquipoModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default LigaDetalle;
