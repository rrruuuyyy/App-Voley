import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  Settings, 
  PlayCircle, 
  StopCircle,
  UserPlus,
  ArrowLeft,
  Edit3,
  Plus
} from 'lucide-react';
import { 
  useLiga, 
  useCapitanesLiga, 
  useAsignarCapitanes,
  useIniciarLiga,
  useFinalizarLiga
} from '../hooks/useLigaQueries';
import { PageHeader } from '../../../../../common';
import { Modal } from '../../../../../common/components/Modal';
import { UserSearchDropdown } from '../../../../../common/components/UserSearchDropdown';
import { LigaStatusEnum, type CapitanLiga } from '../types';
import type { Usuario } from '../../usuarios/types';
import { useCreateUsuario } from '../../usuarios/hooks/useUsuarioQueries';
import { UserRolesEnum } from '../../usuarios/types';

const LigaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ligaId = Number(id);

  // Estados locales
  const [showCapitanesModal, setShowCapitanesModal] = useState(false);
  const [selectedCapitanes, setSelectedCapitanes] = useState<Usuario[]>([]);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);

  // Queries
  const { data: liga, isLoading: isLoadingLiga, error: ligaError } = useLiga(ligaId);
  const { data: capitanesData, isLoading: isLoadingCapitanes } = useCapitanesLiga(ligaId);

  // Mutations
  const asignarCapitanesMutation = useAsignarCapitanes();
  const iniciarLigaMutation = useIniciarLiga();
  const finalizarLigaMutation = useFinalizarLiga();
  const createUsuarioMutation = useCreateUsuario();

  // Form para crear usuario
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetUserForm
  } = useForm({
    resolver: zodResolver(
      // Schema simple para crear capitán
      z.object({
        nombre: z.string().min(1, "El nombre es requerido"),
        correo: z.string().email("Debe ser un correo válido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
      })
    ),
    defaultValues: {
      nombre: '',
      correo: '',
      password: ''
    }
  });

  const handleGoBack = () => {
    navigate('/admin/ligas');
  };

  const handleEditLiga = () => {
    // TODO: Implementar edición de liga
    console.log('Editar liga:', ligaId);
  };

  const handleOpenCapitanesModal = () => {
    setSelectedCapitanes([]);
    setShowCapitanesModal(true);
  };

  const handleCloseCapitanesModal = () => {
    setSelectedCapitanes([]);
    setShowCapitanesModal(false);
    setShowCreateUserForm(false);
    resetUserForm();
  };

  const handleAddCapitan = (user: Usuario) => {
    if (!selectedCapitanes.find(cap => cap.id === user.id)) {
      setSelectedCapitanes(prev => [...prev, user]);
    }
  };

  const handleRemoveCapitan = (userId: number) => {
    setSelectedCapitanes(prev => prev.filter(cap => cap.id !== userId));
  };

  const handleToggleCreateUserForm = () => {
    setShowCreateUserForm(!showCreateUserForm);
    if (showCreateUserForm) {
      resetUserForm();
    }
  };

  const handleCreateCapitan = handleSubmit(async (data) => {
    try {
      const newUser = await createUsuarioMutation.mutateAsync({
        nombre: data.nombre,
        correo: data.correo,
        password: data.password,
        rol: UserRolesEnum.CAPITAN
      });
      
      // Agregar el usuario creado a la selección
      handleAddCapitan(newUser);
      
      // Limpiar y cerrar formulario
      resetUserForm();
      setShowCreateUserForm(false);
      
    } catch (error) {
      console.error('Error al crear capitán:', error);
      alert('Error al crear el capitán');
    }
  });

  const handleSaveCapitanes = async () => {
    if (selectedCapitanes.length === 0) {
      alert('Debe seleccionar al menos un capitán');
      return;
    }

    try {
      await asignarCapitanesMutation.mutateAsync({
        id: ligaId,
        data: {
          capitanesIds: selectedCapitanes.map(cap => cap.id)
        }
      });
      
      handleCloseCapitanesModal();
    } catch (error) {
      console.error('Error al asignar capitanes:', error);
      alert('Error al asignar capitanes');
    }
  };

  const handleIniciarLiga = async () => {
    if (!liga) return;

    const confirmMessage = `¿Está seguro de que desea iniciar la liga "${liga.nombre}"?\n\nEsta acción calculará automáticamente los números de juegos y no se puede deshacer.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await iniciarLigaMutation.mutateAsync(ligaId);
      } catch (error) {
        console.error('Error al iniciar liga:', error);
        alert('Error al iniciar liga');
      }
    }
  };

  const handleFinalizarLiga = async () => {
    if (!liga) return;

    const confirmMessage = `¿Está seguro de que desea finalizar la liga "${liga.nombre}"?\n\nEsta acción no se puede deshacer.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await finalizarLigaMutation.mutateAsync(ligaId);
      } catch (error) {
        console.error('Error al finalizar liga:', error);
        alert('Error al finalizar liga');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case LigaStatusEnum.PROGRAMADA:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case LigaStatusEnum.EN_CURSO:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case LigaStatusEnum.FINALIZADA:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case LigaStatusEnum.CANCELADA:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case LigaStatusEnum.PROGRAMADA:
        return 'Programada';
      case LigaStatusEnum.EN_CURSO:
        return 'En Curso';
      case LigaStatusEnum.FINALIZADA:
        return 'Finalizada';
      case LigaStatusEnum.CANCELADA:
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const canEditLiga = liga?.status === LigaStatusEnum.PROGRAMADA;
  const canStartLiga = liga?.status === LigaStatusEnum.PROGRAMADA;
  const canFinishLiga = liga?.status === LigaStatusEnum.EN_CURSO;
  const canManageCapitanes = liga?.status === LigaStatusEnum.PROGRAMADA;

  // Obtener IDs de capitanes actuales para filtrarlos en el dropdown
  const currentCapitanesIds = capitanesData?.capitanes.map(cap => cap.id) || [];

  if (isLoadingLiga) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-6">
          <PageHeader
            title="Cargando..."
            subtitle="Obteniendo información de la liga"
          />
        </div>
        <div className="px-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (ligaError || !liga) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-6">
          <PageHeader
            title="Error"
            subtitle="No se pudo cargar la información de la liga"
          />
        </div>
        <div className="px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">Liga no encontrada</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                La liga solicitada no existe o no tienes permisos para verla.
              </p>
              <button
                onClick={handleGoBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Volver a Ligas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
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
                  onClick={handleIniciarLiga}
                  disabled={iniciarLigaMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {iniciarLigaMutation.isPending ? 'Iniciando...' : 'Iniciar Liga'}
                </button>
              )}

              {canFinishLiga && (
                <button
                  onClick={handleFinalizarLiga}
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
      <div className="px-6 py-6 space-y-6">
        {/* Información General */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Información General
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(liga.status)}`}>
              {getStatusText(liga.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fechas */}
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Fechas</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(liga.fechaInicio)} - {formatDate(liga.fechaFin)}
                </p>
              </div>
            </div>

            {/* Sede */}
            {liga.sede && (
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Sede</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {liga.sede.nombre}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {liga.sede.direccion}
                  </p>
                </div>
              </div>
            )}

            {/* Admin Liga */}
            {liga.adminLiga && (
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Administrador</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {liga.adminLiga.nombre}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {liga.adminLiga.correo}
                  </p>
                </div>
              </div>
            )}

            {/* Configuración */}
            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Configuración</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {liga.vueltas} vuelta{liga.vueltas > 1 ? 's' : ''} • {liga.numeroGrupos} grupo{liga.numeroGrupos > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                  Sistema: {liga.sistemaPuntos}
                </p>
              </div>
            </div>

            {/* Estadísticas calculadas */}
            {liga.calculado && (
              <div className="flex items-start space-x-3">
                <Trophy className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Estadísticas</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {liga.numeroEquipos} equipos • {liga.partidosTotales} partidos
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {liga.totalJornadas} jornadas
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Capitanes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Capitanes Asignados
            </h2>
            {canManageCapitanes && (
              <button
                onClick={handleOpenCapitanesModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Asignar Capitanes
              </button>
            )}
          </div>

          {isLoadingCapitanes ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : capitanesData && capitanesData.capitanes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capitanesData.capitanes.map((capitan: CapitanLiga) => (
                <div
                  key={capitan.id}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {capitan.nombre}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {capitan.correo}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Asignado: {formatDate(capitan.fechaAsignacion)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
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
      </div>

      {/* Modal de Asignar Capitanes */}
      <Modal
        isOpen={showCapitanesModal}
        onClose={handleCloseCapitanesModal}
        title="Asignar Capitanes"
        size="lg"
      >
        <div className="p-6 space-y-6">
          {/* Selector de búsqueda existente */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Buscar Capitanes Existentes
              </label>
              <button
                onClick={handleToggleCreateUserForm}
                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              >
                <Plus className="w-3 h-3 mr-1" />
                {showCreateUserForm ? 'Cancelar' : 'Crear Nuevo Capitán'}
              </button>
            </div>
            
            {!showCreateUserForm && (
              <>
                <UserSearchDropdown
                  onUserSelect={handleAddCapitan}
                  selectedUsers={selectedCapitanes}
                  placeholder="Buscar usuarios con rol de capitán..."
                  filterRole="capitan"
                  excludeUserIds={currentCapitanesIds}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Solo se mostrarán usuarios con rol de "Capitán"
                </p>
              </>
            )}
          </div>

          {/* Formulario para crear nuevo capitán */}
          {showCreateUserForm && (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Crear Nuevo Capitán
              </h3>
              
              <form onSubmit={handleCreateCapitan} className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    {...register('nombre')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Ingrese el nombre completo"
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    id="correo"
                    type="email"
                    {...register('correo')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.correo && (
                    <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contraseña *
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Rol:</strong> Capitán (asignado automáticamente)
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleToggleCreateUserForm}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled={createUsuarioMutation.isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createUsuarioMutation.isPending}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {createUsuarioMutation.isPending ? 'Creando...' : 'Crear y Agregar'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de capitanes seleccionados */}
          {selectedCapitanes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capitanes a Asignar ({selectedCapitanes.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedCapitanes.map((capitan) => (
                  <div
                    key={capitan.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {capitan.nombre}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {capitan.correo}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveCapitan(capitan.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botones del modal */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleCloseCapitanesModal}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              disabled={asignarCapitanesMutation.isPending || createUsuarioMutation.isPending}
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCapitanes}
              disabled={selectedCapitanes.length === 0 || asignarCapitanesMutation.isPending || createUsuarioMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {asignarCapitanesMutation.isPending ? 'Asignando...' : `Asignar ${selectedCapitanes.length} Capitán${selectedCapitanes.length > 1 ? 'es' : ''}`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LigaDetalle;
