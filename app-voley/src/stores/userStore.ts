import { create } from 'zustand';
import { authService } from '../services/api';
import type { User, LoginRequest } from '../types';

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithQR: (code: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  login: async (credentials: LoginRequest) => {
    try {
      set({ loading: true, error: null });
      
      console.log('Attempting login with credentials:', credentials); // Para debug
      const response = await authService.login(credentials);
      console.log('Login response received:', response); // Para debug
      const { access_token } = response;
      localStorage.setItem('token', access_token);
      console.log('User state updated successfully. isAuthenticated: true'); // Para debug
    } catch (error: any) {
      console.error('Login error:', error); // Para debug
      console.error('Error response:', error.response); // Para debug
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      set({ 
        error: errorMessage, 
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null
      });
      localStorage.removeItem('token');
      throw error;
    }
  },

  loginWithQR: async (code: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await authService.loginSucursal(code);
      const { access_token, user } = response;
      
      // Guardar token en localStorage
      localStorage.setItem('token', access_token);
      
      set({ 
        token: access_token, 
        user, 
        isAuthenticated: true, 
        loading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Código QR inválido';
      set({ 
        error: errorMessage, 
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null
      });
      localStorage.removeItem('token');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      loading: false,
      error: null
    });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found, setting unauthenticated state');
      set({ loading: false, isAuthenticated: false });
      return;
    }

    try {
      set({ loading: true });
      const user = await authService.getMe();
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Token inválido o servidor no disponible:', error);
      // Limpiar localStorage si hay error
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        loading: false,
        error: null
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
