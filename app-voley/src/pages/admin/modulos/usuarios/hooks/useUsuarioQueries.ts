import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { UsuarioApiService } from '../api/usuarioApi';
import { queryKeys } from '../../../../../core/query/queryClient';
import type { 
  Usuario, 
  CreateUsuarioRequest, 
  UpdateUsuarioRequest, 
  UsuarioLite 
} from '../types';
import type { 
  ResponsePaginate, 
  ListFiltersPaginate 
} from '../../../../../core/components/pagination';

// ===========================
// QUERY HOOKS
// ===========================

/**
 * Hook to fetch list of usuarios with pagination and filters
 */
export const useUsuarios = (
  filters: ListFiltersPaginate = {},
  options?: Omit<UseQueryOptions<ResponsePaginate<Usuario>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.users(filters),
    queryFn: () => UsuarioApiService.getUsuarios(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch a single usuario by ID
 */
export const useUsuario = (
  id: number,
  options?: Omit<UseQueryOptions<Usuario, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => UsuarioApiService.getUsuarioById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch usuarios lite (simplified list)
 */
export const useUsuariosLite = (
  options?: Omit<UseQueryOptions<UsuarioLite[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.all, 'users-lite'],
    queryFn: () => UsuarioApiService.getUsuariosLite(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch active usuarios
 */
export const useUsuariosActivos = (
  options?: Omit<UseQueryOptions<Usuario[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.all, 'users-activos'],
    queryFn: () => UsuarioApiService.getUsuariosActivos(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch usuario by email
 */
export const useUsuarioByEmail = (
  email: string,
  options?: Omit<UseQueryOptions<Usuario, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...queryKeys.all, 'user-by-email', email],
    queryFn: () => UsuarioApiService.getUsuarioByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ===========================
// MUTATION HOOKS
// ===========================

/**
 * Hook to create a new usuario
 */
export const useCreateUsuario = (
  options?: UseMutationOptions<Usuario, Error, CreateUsuarioRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateUsuarioRequest) => UsuarioApiService.createUsuario(data),
    onSuccess: () => {
      // Invalidate and refetch usuarios queries
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    ...options,
  });
};

/**
 * Hook to update an existing usuario
 */
export const useUpdateUsuario = (
  options?: UseMutationOptions<Usuario, Error, { id: number; data: UpdateUsuarioRequest }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUsuarioRequest }) => 
      UsuarioApiService.updateUsuario(id, data),
    onSuccess: (data, variables) => {
      // Update specific user cache
      queryClient.setQueryData(queryKeys.user(variables.id), data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    ...options,
  });
};

/**
 * Hook to delete a usuario
 */
export const useDeleteUsuario = (
  options?: UseMutationOptions<void, Error, number>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => UsuarioApiService.deleteUsuario(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.user(id) });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    ...options,
  });
};

/**
 * Hook to toggle usuario status
 */
export const useToggleUsuarioStatus = (
  options?: UseMutationOptions<Usuario, Error, number>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => UsuarioApiService.toggleUsuarioStatus(id),
    onSuccess: (data, id) => {
      // Update specific user cache
      queryClient.setQueryData(queryKeys.user(id), data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
    ...options,
  });
};

/**
 * Hook to change user password
 */
export const useChangePassword = (
  options?: UseMutationOptions<Usuario, Error, { id: number; newPassword: string }>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: number; newPassword: string }) => 
      UsuarioApiService.changePassword(id, newPassword),
    onSuccess: (data, variables) => {
      // Update specific user cache
      queryClient.setQueryData(queryKeys.user(variables.id), data);
    },
    ...options,
  });
};

// ===========================
// UTILITY HOOKS
// ===========================

/**
 * Hook to create usuario temporal
 */
export const useCreateUsuarioTemporal = (
  options?: UseMutationOptions<{
    message: string;
    usuario: Usuario;
    qrCode: string;
    urlRegistro: string;
  }, Error, {
    nombre: string;
    rol: string;
    descripcion?: string;
  }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { nombre: string; rol: string; descripcion?: string }) => 
      UsuarioApiService.createUsuarioTemporal(data),
    onSuccess: () => {
      // Invalidate usuarios lists to refresh
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    ...options,
  });
};

/**
 * Hook to get QR info
 */
export const useQRInfo = (
  qrCode: string,
  options?: Omit<UseQueryOptions<{
    id: number;
    nombre: string;
    rol: string;
    esUsuarioTemporal: boolean;
    qrCode: string;
    tieneCorreo: boolean;
  }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['qr-info', qrCode],
    queryFn: () => UsuarioApiService.getQRInfo(qrCode),
    enabled: !!qrCode,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

/**
 * Hook to complete registration with QR
 */
export const useRegistroConQR = (
  options?: UseMutationOptions<{
    message: string;
    usuario: Usuario;
  }, Error, {
    qrCode: string;
    correo: string;
    password: string;
  }>
) => {
  return useMutation({
    mutationFn: (data: { qrCode: string; correo: string; password: string }) => 
      UsuarioApiService.registroConQR(data),
    ...options,
  });
};

/**
 * Hook to get usuarios temporales
 */
export const useUsuariosTemporales = (
  filters?: { page?: number; limit?: number },
  options?: Omit<UseQueryOptions<{
    data: Usuario[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['usuarios-temporales', filters],
    queryFn: () => UsuarioApiService.getUsuariosTemporales(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

// ===========================
// PREFETCH HOOKS
// ===========================

/**
 * Hook to prefetch usuario data
 */
export const usePrefetchUsuario = () => {
  const queryClient = useQueryClient();
  
  return {
    prefetchUsuario: (id: number) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.user(id),
        queryFn: () => UsuarioApiService.getUsuarioById(id),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchUsuarios: (filters: ListFiltersPaginate = {}) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.users(filters),
        queryFn: () => UsuarioApiService.getUsuarios(filters),
        staleTime: 5 * 60 * 1000,
      });
    }
  };
};
