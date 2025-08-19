import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { LigaApiService } from '../api/ligaApi';
import type { 
  Liga, 
  CreateLigaRequest, 
  UpdateLigaRequest, 
  LigaLite,
  CapitanLiga,
  AsignarCapitanesRequest,
  LigaEstadisticas,
  EstadoGrupos,
  AsignarGruposAutomaticoRequest,
  AsignarGruposMasivoRequest,
  AsignacionAutomaticaResult,
  AsignacionMasivaResult,
  ValidacionGrupos
} from '../types';
import type { 
  ResponsePaginate, 
  ListFiltersPaginate 
} from '../../../../../core/components/pagination';

// ===========================
// QUERY HOOKS
// ===========================

/**
 * Hook to fetch list of ligas with pagination and filters
 */
export const useLigas = (
  filters: ListFiltersPaginate = {},
  options?: Omit<UseQueryOptions<ResponsePaginate<Liga>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['ligas', filters],
    queryFn: () => LigaApiService.getLigas(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single liga by ID
 */
export const useLiga = (
  id: number,
  options?: Omit<UseQueryOptions<Liga, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['liga', id],
    queryFn: () => LigaApiService.getLigaById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch simplified list of ligas
 */
export const useLigasLite = (
  options?: Omit<UseQueryOptions<LigaLite[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['ligas', 'lite'],
    queryFn: () => LigaApiService.getLigasLite(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to search ligas by term
 */
export const useSearchLigas = (
  searchTerm: string,
  options?: Omit<UseQueryOptions<Liga[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['ligas', 'search', searchTerm],
    queryFn: () => LigaApiService.searchLigas(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get liga statistics
 */
export const useLigaStats = (
  id: number,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['liga', id, 'stats'],
    queryFn: () => LigaApiService.getLigaStats(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get liga estadísticas calculadas
 */
export const useLigaEstadisticas = (
  id: number,
  options?: Omit<UseQueryOptions<LigaEstadisticas, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['liga', id, 'estadisticas'],
    queryFn: () => LigaApiService.getEstadisticasLiga(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get capitanes de una liga
 */
export const useCapitanesLiga = (
  id: number,
  options?: Omit<UseQueryOptions<{ total: number; capitanes: CapitanLiga[] }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['liga', id, 'capitanes'],
    queryFn: () => LigaApiService.getCapitanesLiga(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ===========================
// MUTATION HOOKS
// ===========================

/**
 * Hook to create a new liga
 */
export const useCreateLiga = (
  options?: UseMutationOptions<Liga, Error, CreateLigaRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLigaRequest) => LigaApiService.createLiga(data),
    onSuccess: (newLiga) => {
      // Invalidate and refetch ligas queries
      queryClient.invalidateQueries({ queryKey: ['ligas'] });
      
      // Add the new liga to the cache
      queryClient.setQueryData(['liga', newLiga.id], newLiga);
    },
    ...options,
  });
};

/**
 * Hook to update an existing liga
 */
export const useUpdateLiga = (
  options?: UseMutationOptions<Liga, Error, { id: number; data: UpdateLigaRequest }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLigaRequest }) => 
      LigaApiService.updateLiga(id, data),
    onSuccess: (updatedLiga) => {
      // Update the liga in the cache
      queryClient.setQueryData(['liga', updatedLiga.id], updatedLiga);
      
      // Invalidate and refetch ligas queries
      queryClient.invalidateQueries({ queryKey: ['ligas'] });
    },
    ...options,
  });
};

/**
 * Hook to delete a liga
 */
export const useDeleteLiga = (
  options?: UseMutationOptions<void, Error, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => LigaApiService.deleteLiga(id),
    onSuccess: (_, deletedId) => {
      // Remove the liga from individual queries
      queryClient.removeQueries({ queryKey: ['liga', deletedId] });
      
      // Invalidate and refetch ligas queries
      queryClient.invalidateQueries({ queryKey: ['ligas'] });
    },
    ...options,
  });
};

/**
 * Hook to iniciar liga
 */
export const useIniciarLiga = (
  options?: UseMutationOptions<Liga, Error, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => LigaApiService.iniciarLiga(id),
    onSuccess: (updatedLiga) => {
      // Update the liga in the cache
      queryClient.setQueryData(['liga', updatedLiga.id], updatedLiga);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['ligas'] });
      queryClient.invalidateQueries({ queryKey: ['liga', updatedLiga.id, 'estadisticas'] });
    },
    ...options,
  });
};

/**
 * Hook to finalizar liga
 */
export const useFinalizarLiga = (
  options?: UseMutationOptions<Liga, Error, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => LigaApiService.finalizarLiga(id),
    onSuccess: (updatedLiga) => {
      // Update the liga in the cache
      queryClient.setQueryData(['liga', updatedLiga.id], updatedLiga);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['ligas'] });
    },
    ...options,
  });
};

/**
 * Hook to asignar capitanes
 */
export const useAsignarCapitanes = (
  options?: UseMutationOptions<{ total: number; capitanes: CapitanLiga[] }, Error, { id: number; data: AsignarCapitanesRequest }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AsignarCapitanesRequest }) => 
      LigaApiService.asignarCapitanes(id, data),
    onSuccess: (result, { id }) => {
      // Update capitanes cache
      queryClient.setQueryData(['liga', id, 'capitanes'], result);
      
      // Invalidate liga query to refresh data
      queryClient.invalidateQueries({ queryKey: ['liga', id] });
    },
    ...options,
  });
};

/**
 * Hook to eliminar capitan
 */
export const useEliminarCapitan = (
  options?: UseMutationOptions<{ message: string; equipoEliminado: { id: number; nombre: string } | null }, Error, { ligaId: number; capitanId: number }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ligaId, capitanId }: { ligaId: number; capitanId: number }) => 
      LigaApiService.eliminarCapitan(ligaId, capitanId),
    onSuccess: (result, { ligaId }) => {
      // Invalidate capitanes cache to refresh the list
      queryClient.invalidateQueries({ queryKey: ['liga', ligaId, 'capitanes'] });
      
      // Invalidate liga query to refresh data
      queryClient.invalidateQueries({ queryKey: ['liga', ligaId] });

      // If an equipo was deleted, invalidate equipos cache as well
      if (result.equipoEliminado) {
        queryClient.invalidateQueries({ queryKey: ['liga', ligaId, 'equipos'] });
      }
    },
    ...options,
  });
};

/**
 * Hook to check liga name availability
 */
export const useCheckLigaNameAvailability = () => {
  return useMutation({
    mutationFn: ({ nombre, excludeId }: { nombre: string; excludeId?: number }) =>
      LigaApiService.checkLigaNameAvailability(nombre, excludeId),
  });
};

// ===========================
// EXPORT ALL HOOKS
// ===========================

export const ligaQueries = {
  // Queries
  useLigas,
  useLiga,
  useLigasLite,
  useSearchLigas,
  useLigaStats,
  useLigaEstadisticas,
  useCapitanesLiga,
  
  // Mutations
  useCreateLiga,
  useUpdateLiga,
  useDeleteLiga,
  useIniciarLiga,
  useFinalizarLiga,
  useAsignarCapitanes,
  useEliminarCapitan,
  useCheckLigaNameAvailability,
};

// ===========================
// HOOKS PARA GESTIÓN DE GRUPOS
// ===========================

/**
 * Hook to get grupos estado
 */
export const useEstadoGrupos = (
  ligaId: number,
  options?: Omit<UseQueryOptions<EstadoGrupos, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['liga', ligaId, 'grupos', 'estado'],
    queryFn: () => LigaApiService.getEstadoGrupos(ligaId),
    enabled: !!ligaId,
    ...options,
  });
};

/**
 * Hook to get grupos validation
 */
export const useValidacionGrupos = (
  ligaId: number,
  options?: Omit<UseQueryOptions<ValidacionGrupos, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['liga', ligaId, 'grupos', 'validacion'],
    queryFn: () => LigaApiService.validarConfiguracionGrupos(ligaId),
    enabled: !!ligaId,
    ...options,
  });
};

/**
 * Hook to asignar grupos automatically
 */
export const useAsignarGruposAutomatico = (
  options?: UseMutationOptions<AsignacionAutomaticaResult, Error, AsignarGruposAutomaticoRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AsignarGruposAutomaticoRequest) => 
      LigaApiService.asignarGruposAutomatico(data),
    onSuccess: (_, { ligaId }) => {
      // Invalidate grupos queries
      queryClient.invalidateQueries({ queryKey: ['liga', ligaId, 'grupos'] });
      
      // Invalidate equipos queries
      queryClient.invalidateQueries({ queryKey: ['equipos', 'liga', ligaId] });
    },
    ...options,
  });
};

/**
 * Hook to asignar grupos masively
 */
export const useAsignarGruposMasivo = (
  options?: UseMutationOptions<AsignacionMasivaResult, Error, AsignarGruposMasivoRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AsignarGruposMasivoRequest) => 
      LigaApiService.asignarGruposMasivo(data),
    onSuccess: () => {
      // Invalidate all grupos and equipos queries
      queryClient.invalidateQueries({ queryKey: ['liga'] });
      queryClient.invalidateQueries({ queryKey: ['equipos'] });
    },
    ...options,
  });
};
