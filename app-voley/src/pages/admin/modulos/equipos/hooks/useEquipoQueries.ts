import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { EquipoApiService } from '../api/equipoApi';
import type { 
  Equipo, 
  CreateEquipoRequest, 
  UpdateEquipoRequest,
  JugadorEquipo,
  AddJugadorToEquipoRequest
} from '../types';

// ===========================
// QUERY HOOKS
// ===========================

/**
 * Hook to fetch equipos by liga
 */
export const useEquiposByLiga = (
  ligaId: number,
  options?: Omit<UseQueryOptions<Equipo[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['equipos', 'liga', ligaId],
    queryFn: () => EquipoApiService.getEquiposByLiga(ligaId),
    enabled: !!ligaId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single equipo by ID
 */
export const useEquipo = (
  id: number,
  options?: Omit<UseQueryOptions<Equipo, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['equipo', id],
    queryFn: () => EquipoApiService.getEquipoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch jugadores of an equipo
 */
export const useJugadoresEquipo = (
  equipoId: number,
  options?: Omit<UseQueryOptions<JugadorEquipo[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['equipo', equipoId, 'jugadores'],
    queryFn: () => EquipoApiService.getJugadoresEquipo(equipoId),
    enabled: !!equipoId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ===========================
// MUTATION HOOKS
// ===========================

/**
 * Hook to create a new equipo
 */
export const useCreateEquipo = (
  options?: UseMutationOptions<Equipo, Error, CreateEquipoRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEquipoRequest) => EquipoApiService.createEquipo(data),
    onSuccess: (newEquipo) => {
      // Update equipos cache
      queryClient.invalidateQueries({ queryKey: ['equipos', 'liga', newEquipo.ligaId] });
      
      // Set individual equipo cache
      queryClient.setQueryData(['equipo', newEquipo.id], newEquipo);
    },
    ...options,
  });
};

/**
 * Hook to update an equipo
 */
export const useUpdateEquipo = (
  options?: UseMutationOptions<Equipo, Error, { id: number; data: UpdateEquipoRequest }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEquipoRequest }) => 
      EquipoApiService.updateEquipo(id, data),
    onSuccess: (updatedEquipo) => {
      // Update individual equipo cache
      queryClient.setQueryData(['equipo', updatedEquipo.id], updatedEquipo);
      
      // Invalidate equipos list
      queryClient.invalidateQueries({ queryKey: ['equipos', 'liga', updatedEquipo.ligaId] });
    },
    ...options,
  });
};

/**
 * Hook to delete an equipo
 */
export const useDeleteEquipo = (
  options?: UseMutationOptions<void, Error, { id: number; ligaId: number }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; ligaId: number }) => EquipoApiService.deleteEquipo(id),
    onSuccess: (_, { id, ligaId }) => {
      // Remove individual equipo cache
      queryClient.removeQueries({ queryKey: ['equipo', id] });
      
      // Invalidate equipos list
      queryClient.invalidateQueries({ queryKey: ['equipos', 'liga', ligaId] });
    },
    ...options,
  });
};

/**
 * Hook to assign equipo to group
 */
export const useAssignEquipoToGroup = (
  options?: UseMutationOptions<Equipo, Error, { equipoId: number; grupoNumero: number }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipoId, grupoNumero }: { equipoId: number; grupoNumero: number }) => 
      EquipoApiService.assignEquipoToGroup(equipoId, grupoNumero),
    onSuccess: (updatedEquipo) => {
      // Update individual equipo cache
      queryClient.setQueryData(['equipo', updatedEquipo.id], updatedEquipo);
      
      // Invalidate equipos list
      queryClient.invalidateQueries({ queryKey: ['equipos', 'liga', updatedEquipo.ligaId] });
    },
    ...options,
  });
};

// ===========================
// JUGADORES MUTATIONS
// ===========================

/**
 * Hook to add jugador to equipo
 */
export const useAddJugadorToEquipo = (
  options?: UseMutationOptions<void, Error, { equipoId: number; data: AddJugadorToEquipoRequest }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipoId, data }: { equipoId: number; data: AddJugadorToEquipoRequest }) => 
      EquipoApiService.addJugadorToEquipo(equipoId, data),
    onSuccess: (_, { equipoId }) => {
      // Invalidate jugadores list
      queryClient.invalidateQueries({ queryKey: ['equipo', equipoId, 'jugadores'] });
      
      // Invalidate equipo data (might contain player count)
      queryClient.invalidateQueries({ queryKey: ['equipo', equipoId] });
    },
    ...options,
  });
};

/**
 * Hook to remove jugador from equipo
 */
export const useRemoveJugadorFromEquipo = (
  options?: UseMutationOptions<void, Error, { equipoId: number; jugadorId: number }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipoId, jugadorId }: { equipoId: number; jugadorId: number }) => 
      EquipoApiService.removeJugadorFromEquipo(equipoId, jugadorId),
    onSuccess: (_, { equipoId }) => {
      // Invalidate jugadores list
      queryClient.invalidateQueries({ queryKey: ['equipo', equipoId, 'jugadores'] });
      
      // Invalidate equipo data
      queryClient.invalidateQueries({ queryKey: ['equipo', equipoId] });
    },
    ...options,
  });
};

// ===========================
// EXPORT ALL HOOKS
// ===========================

export const equipoQueries = {
  // Queries
  useEquiposByLiga,
  useEquipo,
  useJugadoresEquipo,
  
  // Mutations
  useCreateEquipo,
  useUpdateEquipo,
  useDeleteEquipo,
  useAssignEquipoToGroup,
  useAddJugadorToEquipo,
  useRemoveJugadorFromEquipo,
};
