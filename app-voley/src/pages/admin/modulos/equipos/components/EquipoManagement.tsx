import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { UserSearchDropdown } from '../../../../../common/components/UserSearchDropdown';
import { useCreateEquipo, useJugadoresEquipo, useAddJugadorToEquipo, useUpdateJugadorEquipo, useRemoveJugadorFromEquipo } from '../../equipos';
import { useCreateUsuario, useCreateUsuarioTemporal } from '../../usuarios/hooks/useUsuarioQueries';
import { UserRolesEnum, type Usuario } from '../../usuarios/types';
import type { Equipo, JugadorEquipo } from '../../equipos/types';

interface EquipoManagementProps {
  ligaId: number;
  capitan: {
    id: number;
    nombre: string;
    correo: string;
  };
  equipo?: Equipo | null;
  onEquipoCreated?: (equipo: Equipo) => void;
  onClose?: () => void;
}

// Schema para crear equipo
const equipoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  color: z.string().min(1, "El color es requerido"),
  descripcion: z.string().optional()
});

// Schema para crear jugador
const jugadorSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  correo: z.string().email("Debe ser un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  numeroJugador: z.string().optional(),
  posicion: z.string().optional()
});

// Schema para crear jugador temporal
const jugadorTemporalSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  numeroJugador: z.string().optional(),
  posicion: z.string().optional()
});

export const EquipoManagement: React.FC<EquipoManagementProps> = ({
  ligaId,
  capitan,
  equipo,
  onEquipoCreated,
  onClose
}) => {
  const [showCreateEquipoForm, setShowCreateEquipoForm] = useState(!equipo);
  const [showCreateJugadorForm, setShowCreateJugadorForm] = useState(false);
  const [showCreateJugadorTemporalForm, setShowCreateJugadorTemporalForm] = useState(false);
  const [usuarioTemporalCreado, setUsuarioTemporalCreado] = useState<{
    usuario: Usuario;
    qrCode: string;
    urlRegistro: string;
  } | null>(null);
  const [selectedJugadores, setSelectedJugadores] = useState<Usuario[]>([]);
  const [removingJugadorId, setRemovingJugadorId] = useState<number | null>(null);
  const [editingJugadorId, setEditingJugadorId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<{ numeroJugador: string; posicion: string }>({ numeroJugador: '', posicion: '' });

  const queryClient = useQueryClient();

  // Queries
  const { data: jugadores, isLoading: isLoadingJugadores } = useJugadoresEquipo(
    equipo?.id || 0,
    { enabled: !!equipo?.id }
  );

  // Mutations
  const createEquipoMutation = useCreateEquipo();
  const createUsuarioMutation = useCreateUsuario();
  const createUsuarioTemporalMutation = useCreateUsuarioTemporal();
  const addJugadorMutation = useAddJugadorToEquipo();
  const updateJugadorMutation = useUpdateJugadorEquipo();
  const removeJugadorMutation = useRemoveJugadorFromEquipo();

  // Form para crear equipo
  const {
    register: registerEquipo,
    handleSubmit: handleSubmitEquipo,
    formState: { errors: errorsEquipo },
    reset: resetEquipoForm
  } = useForm({
    resolver: zodResolver(equipoSchema),
    defaultValues: {
      nombre: '',
      color: '#3B82F6',
      descripcion: ''
    }
  });

  // Form para crear jugador
  const {
    register: registerJugador,
    handleSubmit: handleSubmitJugador,
    formState: { errors: errorsJugador },
    reset: resetJugadorForm
  } = useForm({
    resolver: zodResolver(jugadorSchema),
    defaultValues: {
      nombre: '',
      correo: '',
      password: '',
      numeroJugador: '',
      posicion: ''
    }
  });

  // Form para crear jugador temporal
  const {
    register: registerJugadorTemporal,
    handleSubmit: handleSubmitJugadorTemporal,
    formState: { errors: errorsJugadorTemporal },
    reset: resetJugadorTemporalForm
  } = useForm({
    resolver: zodResolver(jugadorTemporalSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      numeroJugador: '',
      posicion: ''
    }
  });

  const handleCreateEquipo = handleSubmitEquipo(async (data) => {
    try {
      const newEquipo = await createEquipoMutation.mutateAsync({
        nombre: data.nombre,
        color: data.color,
        descripcion: data.descripcion,
        ligaId,
        capitanId: capitan.id
      });

      // Invalidar la query de capitanes para actualizar la vista
      await queryClient.invalidateQueries({
        queryKey: ['liga', ligaId, 'capitanes']
      });

      setShowCreateEquipoForm(false);
      resetEquipoForm();
      onEquipoCreated?.(newEquipo);
    } catch (error) {
      console.error('Error al crear equipo:', error);
      alert('Error al crear el equipo');
    }
  });

  const handleAddJugador = (user: Usuario) => {
    if (!selectedJugadores.find(j => j.id === user.id)) {
      setSelectedJugadores(prev => [...prev, user]);
    }
  };

  const handleRemoveJugador = (userId: number) => {
    setSelectedJugadores(prev => prev.filter(j => j.id !== userId));
  };

  const handleCreateJugador = handleSubmitJugador(async (data) => {
    try {
      const newUser = await createUsuarioMutation.mutateAsync({
        nombre: data.nombre,
        correo: data.correo,
        password: data.password,
        rol: UserRolesEnum.JUGADOR
      });

      // Agregar el jugador al equipo inmediatamente
      if (equipo) {
        await addJugadorMutation.mutateAsync({
          equipoId: equipo.id,
          data: {
            jugadorId: newUser.id,
            numeroJugador: data.numeroJugador,
            posicion: data.posicion
          }
        });
      } else {
        // Si no hay equipo, agregarlo a la lista de seleccionados
        handleAddJugador(newUser);
      }

      resetJugadorForm();
      setShowCreateJugadorForm(false);
    } catch (error) {
      console.error('Error al crear jugador:', error);
      alert('Error al crear el jugador');
    }
  });

  const handleCreateJugadorTemporal = handleSubmitJugadorTemporal(async (data) => {
    try {
      const response = await createUsuarioTemporalMutation.mutateAsync({
        nombre: data.nombre,
        rol: UserRolesEnum.JUGADOR,
        descripcion: data.descripcion || `Jugador temporal${data.numeroJugador ? ` #${data.numeroJugador}` : ''}${data.posicion ? ` - ${data.posicion}` : ''}`
      });

      // Guardar los datos del usuario temporal creado
      setUsuarioTemporalCreado({
        usuario: response.usuario,
        qrCode: response.qrCode,
        urlRegistro: response.urlRegistro
      });

      // Si hay equipo, agregar el jugador temporal inmediatamente
      if (equipo) {
        await addJugadorMutation.mutateAsync({
          equipoId: equipo.id,
          data: {
            jugadorId: response.usuario.id,
            numeroJugador: data.numeroJugador,
            posicion: data.posicion
          }
        });
      } else {
        // Si no hay equipo, agregarlo a la lista de seleccionados
        handleAddJugador(response.usuario);
      }

      resetJugadorTemporalForm();
      setShowCreateJugadorTemporalForm(false);
    } catch (error) {
      console.error('Error al crear jugador temporal:', error);
      alert('Error al crear el jugador temporal');
    }
  });

  const handleSaveJugadores = async () => {
    if (!equipo || selectedJugadores.length === 0) return;

    try {
      for (const jugador of selectedJugadores) {
        await addJugadorMutation.mutateAsync({
          equipoId: equipo.id,
          data: {
            jugadorId: jugador.id
          }
        });
      }
      setSelectedJugadores([]);
    } catch (error) {
      console.error('Error al agregar jugadores:', error);
      alert('Error al agregar jugadores');
    }
  };

  const handleRemoveJugadorFromEquipo = async (jugadorId: number, jugadorNombre: string) => {
    if (!equipo) return;

    const confirmMessage = `¿Está seguro de que desea remover a "${jugadorNombre}" del equipo?\n\nEsta acción no se puede deshacer.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setRemovingJugadorId(jugadorId);
        await removeJugadorMutation.mutateAsync({
          equipoId: equipo.id,
          jugadorId: jugadorId
        });
      } catch (error) {
        console.error('Error al remover jugador:', error);
        alert('Error al remover el jugador del equipo');
      } finally {
        setRemovingJugadorId(null);
      }
    }
  };

  const handleStartEditJugador = (jugadorEquipo: JugadorEquipo) => {
    setEditingJugadorId(jugadorEquipo.jugador.id);
    setEditingData({
      numeroJugador: jugadorEquipo.numeroJugador || '',
      posicion: jugadorEquipo.posicion || ''
    });
  };

  const handleCancelEditJugador = () => {
    setEditingJugadorId(null);
    setEditingData({ numeroJugador: '', posicion: '' });
  };

  const handleSaveEditJugador = async (jugadorId: number) => {
    if (!equipo) return;

    try {
      const dataToUpdate: any = {};
      if (editingData.numeroJugador.trim()) {
        dataToUpdate.numeroJugador = editingData.numeroJugador.trim();
      }
      if (editingData.posicion.trim()) {
        dataToUpdate.posicion = editingData.posicion.trim();
      }

      if (Object.keys(dataToUpdate).length === 0) {
        handleCancelEditJugador();
        return;
      }

      await updateJugadorMutation.mutateAsync({
        equipoId: equipo.id,
        jugadorId: jugadorId,
        data: dataToUpdate
      });

      handleCancelEditJugador();
    } catch (error) {
      console.error('Error al actualizar jugador:', error);
      alert('Error al actualizar la información del jugador');
    }
  };

  // Función para verificar si un jugador es el capitán
  const isCapitan = (jugadorId: number) => {
    return jugadorId === capitan.id;
  };

  // IDs de jugadores actuales para filtrarlos
  const currentJugadoresIds = jugadores?.map(j => j.jugador.id) || [];

  return (
    <div className="space-y-6">
      {/* Información del Capitán */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
          Capitán Asignado
        </h3>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              {capitan.nombre}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {capitan.correo}
            </p>
          </div>
        </div>
      </div>

      {/* Crear Equipo */}
      {showCreateEquipoForm && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            Crear Equipo para {capitan.nombre}
          </h3>

          <form onSubmit={handleCreateEquipo} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del Equipo *
              </label>
              <input
                id="nombre"
                type="text"
                {...registerEquipo('nombre')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Los Tigres"
              />
              {errorsEquipo.nombre && (
                <p className="text-red-500 text-xs mt-1">{errorsEquipo.nombre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color del Equipo *
              </label>
              <input
                id="color"
                type="color"
                {...registerEquipo('color')}
                className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errorsEquipo.color && (
                <p className="text-red-500 text-xs mt-1">{errorsEquipo.color.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                id="descripcion"
                {...registerEquipo('descripcion')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Descripción del equipo..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={createEquipoMutation.isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createEquipoMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createEquipoMutation.isPending ? 'Creando...' : 'Crear Equipo'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gestionar Jugadores del Equipo */}
      {equipo && !showCreateEquipoForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Equipo: {equipo.nombre}
            </h3>
            <div className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: equipo.color }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {jugadores?.length || 0} jugador{(jugadores?.length || 0) !== 1 ? 'es' : ''}
                {(jugadores?.length || 0) > 0 && ' registrados'}
              </span>
            </div>
          </div>

          {/* Agregar Jugadores */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Agregar Jugadores
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setShowCreateJugadorForm(!showCreateJugadorForm);
                    if (showCreateJugadorTemporalForm) setShowCreateJugadorTemporalForm(false);
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {showCreateJugadorForm ? 'Cancelar' : 'Crear Jugador'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateJugadorTemporalForm(!showCreateJugadorTemporalForm);
                    if (showCreateJugadorForm) setShowCreateJugadorForm(false);
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {showCreateJugadorTemporalForm ? 'Cancelar' : 'Jugador Temporal'}
                </button>
              </div>
            </div>

            {!showCreateJugadorForm && (
              <div className="space-y-4">
                <UserSearchDropdown
                  onUserSelect={handleAddJugador}
                  selectedUsers={selectedJugadores}
                  placeholder="Buscar jugadores..."
                  filterRole="jugador"
                  excludeUserIds={currentJugadoresIds}
                  className="w-full"
                />

                {selectedJugadores.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Jugadores seleccionados ({selectedJugadores.length})
                    </p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedJugadores.map((jugador) => (
                        <div
                          key={jugador.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <span className="text-sm text-gray-900 dark:text-white">
                            {jugador.nombre}
                          </span>
                          <button
                            onClick={() => handleRemoveJugador(jugador.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSaveJugadores}
                      disabled={addJugadorMutation.isPending}
                      className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {addJugadorMutation.isPending ? 'Agregando...' : 'Agregar al Equipo'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Formulario crear jugador */}
            {showCreateJugadorForm && (
              <form onSubmit={handleCreateJugador} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      {...registerJugador('nombre')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Nombre del jugador"
                    />
                    {errorsJugador.nombre && (
                      <p className="text-red-500 text-xs mt-1">{errorsJugador.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Correo *
                    </label>
                    <input
                      type="email"
                      {...registerJugador('correo')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="correo@ejemplo.com"
                    />
                    {errorsJugador.correo && (
                      <p className="text-red-500 text-xs mt-1">{errorsJugador.correo.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      {...registerJugador('password')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Mínimo 6 caracteres"
                    />
                    {errorsJugador.password && (
                      <p className="text-red-500 text-xs mt-1">{errorsJugador.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número (Opcional)
                    </label>
                    <input
                      type="text"
                      {...registerJugador('numeroJugador')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="7"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Posición (Opcional)
                    </label>
                    <input
                      type="text"
                      {...registerJugador('posicion')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Atacante, Defensor, etc."
                    />
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Rol:</strong> Jugador (asignado automáticamente)
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateJugadorForm(false)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled={createUsuarioMutation.isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createUsuarioMutation.isPending || addJugadorMutation.isPending}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {createUsuarioMutation.isPending ? 'Creando...' : 'Crear y Agregar'}
                  </button>
                </div>
              </form>
            )}

            {/* Formulario crear jugador temporal */}
            {showCreateJugadorTemporalForm && (
              <form onSubmit={handleCreateJugadorTemporal} className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md mb-4">
                  <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Jugador Temporal
                  </h5>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Se creará un usuario temporal sin credenciales. El jugador podrá completar su registro posteriormente usando un código QR.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      {...registerJugadorTemporal('nombre')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Nombre del jugador"
                    />
                    {errorsJugadorTemporal.nombre && (
                      <p className="text-red-500 text-xs mt-1">{errorsJugadorTemporal.nombre.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Número (Opcional)
                    </label>
                    <input
                      type="text"
                      {...registerJugadorTemporal('numeroJugador')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="7"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Posición (Opcional)
                    </label>
                    <input
                      type="text"
                      {...registerJugadorTemporal('posicion')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Atacante, Defensor, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción (Opcional)
                    </label>
                    <input
                      type="text"
                      {...registerJugadorTemporal('descripcion')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Información adicional del jugador"
                    />
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Rol:</strong> Jugador (asignado automáticamente)
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateJugadorTemporalForm(false)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    disabled={createUsuarioTemporalMutation.isPending}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createUsuarioTemporalMutation.isPending || addJugadorMutation.isPending}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {createUsuarioTemporalMutation.isPending ? 'Creando...' : 'Crear Temporal'}
                  </button>
                </div>
              </form>
            )}

            {/* Modal para mostrar información del usuario temporal creado */}
            {usuarioTemporalCreado && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    ¡Jugador Temporal Creado!
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Jugador:</strong> {usuarioTemporalCreado.usuario.nombre}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Código QR:</strong> {usuarioTemporalCreado.qrCode}
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                        URL de Registro:
                      </p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={usuarioTemporalCreado.urlRegistro}
                          readOnly
                          className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(usuarioTemporalCreado.urlRegistro);
                            alert('URL copiada al portapapeles');
                          }}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Comparte esta URL con el jugador para que complete su registro con correo y contraseña.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setUsuarioTemporalCreado(null)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Jugadores Actuales */}
          {isLoadingJugadores ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : jugadores && jugadores.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Jugadores del Equipo ({jugadores.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jugadores.map((jugadorEquipo: JugadorEquipo) => {
                  const isEditingThisJugador = editingJugadorId === jugadorEquipo.jugador.id;
                  const isCapitanJugador = isCapitan(jugadorEquipo.jugador.id);

                  return (
                    <div
                      key={jugadorEquipo.id}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="space-y-3">
                        {/* Información básica del jugador */}
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {jugadorEquipo.jugador.nombre}
                              {isCapitanJugador && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                                  Capitán
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {jugadorEquipo.jugador.correo}
                            </p>
                          </div>
                        </div>

                        {/* Número y posición - editable */}
                        {isEditingThisJugador ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Número
                                </label>
                                <input
                                  type="text"
                                  value={editingData.numeroJugador}
                                  onChange={(e) => setEditingData(prev => ({ ...prev, numeroJugador: e.target.value }))}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                  placeholder="Ej: 7"
                                />
                              </div>
                              {!isCapitanJugador && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Posición
                                  </label>
                                  <input
                                    type="text"
                                    value={editingData.posicion}
                                    onChange={(e) => setEditingData(prev => ({ ...prev, posicion: e.target.value }))}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Ej: Atacante"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleCancelEditJugador}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                title="Cancelar edición"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleSaveEditJugador(jugadorEquipo.jugador.id)}
                                disabled={updateJugadorMutation.isPending}
                                className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50"
                                title="Guardar cambios"
                              >
                                {updateJugadorMutation.isPending ? (
                                  <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              {(jugadorEquipo.numeroJugador || jugadorEquipo.posicion) ? (
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  {jugadorEquipo.numeroJugador && `#${jugadorEquipo.numeroJugador}`}
                                  {jugadorEquipo.numeroJugador && jugadorEquipo.posicion && ' • '}
                                  {jugadorEquipo.posicion}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                                  Sin número ni posición asignados
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <Users className="w-3 h-3 text-green-600 dark:text-green-400" />
                              </div>
                              <button
                                onClick={() => handleStartEditJugador(jugadorEquipo)}
                                className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                title={`Editar datos de ${jugadorEquipo.jugador.nombre}`}
                              >
                                <Edit3 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              </button>
                              {!isCapitanJugador && (
                                <button
                                  onClick={() => handleRemoveJugadorFromEquipo(jugadorEquipo.jugador.id, jugadorEquipo.jugador.nombre)}
                                  disabled={removingJugadorId === jugadorEquipo.jugador.id}
                                  className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                                  title={`Remover a ${jugadorEquipo.jugador.nombre} del equipo`}
                                >
                                  {removingJugadorId === jugadorEquipo.jugador.id ? (
                                    <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 border border-gray-200 dark:border-gray-600 rounded-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay jugadores en este equipo
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
