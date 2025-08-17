import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { SedeApiService } from '../api/sedeApi';
import type { 
  Sede, 
  CreateSedeRequest, 
  UpdateSedeRequest, 
  SedeLite 
} from '../types';
import type { 
  ResponsePaginate, 
  ListFiltersPaginate 
} from '../../../../../core/components/pagination';

// ===========================
// QUERY HOOKS
// ===========================

/**
 * Hook to fetch list of sedes with pagination and filters
 */
export const useSedes = (
  filters: ListFiltersPaginate = {},
  options?: Omit<UseQueryOptions<ResponsePaginate<Sede>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['sedes', filters],
    queryFn: () => SedeApiService.getSedes(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single sede by ID
 */
export const useSede = (
  id: number,
  options?: Omit<UseQueryOptions<Sede, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['sede', id],
    queryFn: () => SedeApiService.getSedeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch simplified list of active sedes
 */
export const useSedesLite = (
  options?: Omit<UseQueryOptions<SedeLite[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['sedes', 'lite'],
    queryFn: () => SedeApiService.getSedesLite(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to search sedes by term
 */
export const useSearchSedes = (
  searchTerm: string,
  options?: Omit<UseQueryOptions<Sede[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['sedes', 'search', searchTerm],
    queryFn: () => SedeApiService.searchSedes(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get sede statistics
 */
export const useSedeStats = (
  id: number,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['sede', id, 'stats'],
    queryFn: () => SedeApiService.getSedeStats(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// ===========================
// MUTATION HOOKS
// ===========================

/**
 * Hook to create a new sede
 */
export const useCreateSede = (
  options?: UseMutationOptions<Sede, Error, CreateSedeRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSedeRequest) => SedeApiService.createSede(data),
    onSuccess: (newSede) => {
      // Invalidate and refetch sedes queries
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
      
      // Add the new sede to the cache
      queryClient.setQueryData(['sede', newSede.id], newSede);
    },
    ...options,
  });
};

/**
 * Hook to update an existing sede
 */
export const useUpdateSede = (
  options?: UseMutationOptions<Sede, Error, { id: number; data: UpdateSedeRequest }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSedeRequest }) => 
      SedeApiService.updateSede(id, data),
    onSuccess: (updatedSede) => {
      // Update the sede in the cache
      queryClient.setQueryData(['sede', updatedSede.id], updatedSede);
      
      // Invalidate and refetch sedes queries
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
    ...options,
  });
};

/**
 * Hook to delete a sede
 */
export const useDeleteSede = (
  options?: UseMutationOptions<void, Error, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SedeApiService.deleteSede(id),
    onSuccess: (_, deletedId) => {
      // Remove the sede from individual queries
      queryClient.removeQueries({ queryKey: ['sede', deletedId] });
      
      // Invalidate and refetch sedes queries
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
    ...options,
  });
};

/**
 * Hook to toggle sede status (active/inactive)
 */
export const useToggleSedeStatus = (
  options?: UseMutationOptions<Sede, Error, number>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SedeApiService.toggleSedeStatus(id),
    onSuccess: (updatedSede) => {
      // Update the sede in the cache
      queryClient.setQueryData(['sede', updatedSede.id], updatedSede);
      
      // Invalidate and refetch sedes queries
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
    ...options,
  });
};

/**
 * Hook to change sede status explicitly
 */
export const useChangeSedeStatus = (
  options?: UseMutationOptions<Sede, Error, { id: number; active: boolean }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => 
      SedeApiService.changeSedeStatus(id, active),
    onSuccess: (updatedSede) => {
      // Update the sede in the cache
      queryClient.setQueryData(['sede', updatedSede.id], updatedSede);
      
      // Invalidate and refetch sedes queries
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
    ...options,
  });
};

/**
 * Hook to check sede name availability
 */
export const useCheckSedeNameAvailability = () => {
  return useMutation({
    mutationFn: ({ nombre, excludeId }: { nombre: string; excludeId?: number }) =>
      SedeApiService.checkSedeNameAvailability(nombre, excludeId),
  });
};

// ===========================
// EXPORT ALL HOOKS
// ===========================

export const sedeQueries = {
  // Queries
  useSedes,
  useSede,
  useSedesLite,
  useSearchSedes,
  useSedeStats,
  
  // Mutations
  useCreateSede,
  useUpdateSede,
  useDeleteSede,
  useToggleSedeStatus,
  useChangeSedeStatus,
  useCheckSedeNameAvailability,
};
