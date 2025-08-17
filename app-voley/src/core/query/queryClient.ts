import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys Factory
export const queryKeys = {
  all: ['queries'] as const,
  users: (filters?: any) => [...queryKeys.all, 'users', filters] as const,
  user: (id: number) => [...queryKeys.all, 'user', id] as const,
  // Agregar más entidades según necesidad
};
