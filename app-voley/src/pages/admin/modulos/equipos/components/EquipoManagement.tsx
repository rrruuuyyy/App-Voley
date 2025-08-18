import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Plus, Trash2 } from 'lucide-react';
import { UserSearchDropdown } from '../../../../../common/components/UserSearchDropdown';
import { useCreateEquipo, useJugadoresEquipo, useAddJugadorToEquipo, useRemoveJugadorFromEquipo } from '../../equipos';
import { useCreateUsuario } from '../../usuarios/hooks/useUsuarioQueries';
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

export const EquipoManagement: React.FC<EquipoManagementProps> = ({
  ligaId,
  capitan,
  equipo,
  onEquipoCreated,
  onClose
}) => {
  const [showCreateEquipoForm, setShowCreateEquipoForm] = useState(!equipo);
  const [showCreateJugadorForm, setShowCreateJugadorForm] = useState(false);
  const [selectedJugadores, setSelectedJugadores] = useState<Usuario[]>([]);
  const [removingJugadorId, setRemovingJugadorId] = useState<number | null>(null);

  // Queries
  const { data: jugadores, isLoading: isLoadingJugadores } = useJugadoresEquipo(
    equipo?.id || 0,
    { enabled: !!equipo?.id }
  );

  // Mutations
  const createEquipoMutation = useCreateEquipo();
  const createUsuarioMutation = useCreateUsuario();
  const addJugadorMutation = useAddJugadorToEquipo();
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

  const handleCreateEquipo = handleSubmitEquipo(async (data) => {
    try {
      const newEquipo = await createEquipoMutation.mutateAsync({
        nombre: data.nombre,
        color: data.color,
        descripcion: data.descripcion,
        ligaId,
        capitanId: capitan.id
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
              <button
                onClick={() => setShowCreateJugadorForm(!showCreateJugadorForm)}
                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              >
                <Plus className="w-3 h-3 mr-1" />
                {showCreateJugadorForm ? 'Cancelar' : 'Crear Jugador'}
              </button>
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
                {jugadores.map((jugadorEquipo: JugadorEquipo) => (
                  <div
                    key={jugadorEquipo.id}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {jugadorEquipo.jugador.nombre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {jugadorEquipo.jugador.correo}
                        </p>
                        {(jugadorEquipo.numeroJugador || jugadorEquipo.posicion) && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            {jugadorEquipo.numeroJugador && `#${jugadorEquipo.numeroJugador}`}
                            {jugadorEquipo.numeroJugador && jugadorEquipo.posicion && ' • '}
                            {jugadorEquipo.posicion}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <Users className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
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
                      </div>
                    </div>
                  </div>
                ))}
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
