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
import { createParamsPaginate } from '../../../../../core/components/pagination';

// Importar el servicio HTTP existente del proyecto
import axios from 'axios';

// Crear instancia usando la misma configuración que api.ts
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Endpoints
const ENDPOINTS = {
  USUARIOS: '/usuario',
  USUARIO_BY_ID: (id: number) => `/usuario/${id}`,
  TOGGLE_STATUS: (id: number) => `/usuario/${id}/toggle-status`,
  USUARIOS_LITE: '/usuario/lite',
  USUARIOS_ACTIVOS: '/usuario/activos',
  USUARIO_BY_EMAIL: (email: string) => `/usuario/email/${email}`,
  CHANGE_PASSWORD: (id: number) => `/usuario/${id}/change-password`,
} as const;

export class UsuarioApiService {
  /**
   * Get list of usuarios with pagination and filters
   */
  static async getUsuarios(filters: ListFiltersPaginate = {}): Promise<ResponsePaginate<Usuario>> {
    const params = createParamsPaginate(filters);
    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.USUARIOS}?${queryString}` : ENDPOINTS.USUARIOS;
    
    const response = await api.get<ResponsePaginate<Usuario>>(url);
    return response.data;
  }

  /**
   * Get a single usuario by ID
   */
  static async getUsuarioById(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(ENDPOINTS.USUARIO_BY_ID(id));
    return response.data;
  }

  /**
   * Create a new usuario
   */
  static async createUsuario(data: CreateUsuarioRequest): Promise<Usuario> {
    const response = await api.post<Usuario>(ENDPOINTS.USUARIOS, data);
    return response.data;
  }

  /**
   * Update an existing usuario
   */
  static async updateUsuario(id: number, data: UpdateUsuarioRequest): Promise<Usuario> {
    const response = await api.patch<Usuario>(ENDPOINTS.USUARIO_BY_ID(id), data);
    return response.data;
  }

  /**
   * Delete a usuario
   */
  static async deleteUsuario(id: number): Promise<void> {
    await api.delete(ENDPOINTS.USUARIO_BY_ID(id));
  }

  /**
   * Toggle usuario status (activate/deactivate)
   */
  static async toggleUsuarioStatus(id: number): Promise<Usuario> {
    const response = await api.patch<Usuario>(ENDPOINTS.TOGGLE_STATUS(id));
    return response.data;
  }

  /**
   * Change user password
   */
  static async changePassword(id: number, newPassword: string): Promise<Usuario> {
    const response = await api.put<Usuario>(ENDPOINTS.CHANGE_PASSWORD(id), { 
      password: newPassword 
    });
    return response.data;
  }

  // ===========================
  // SPECIALIZED ENDPOINTS
  // ===========================

  /**
   * Get simplified list of active usuarios
   */
  static async getUsuariosLite(): Promise<UsuarioLite[]> {
    const response = await api.get<UsuarioLite[]>(ENDPOINTS.USUARIOS_LITE);
    return response.data;
  }

  /**
   * Get active usuarios
   */
  static async getUsuariosActivos(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>(ENDPOINTS.USUARIOS_ACTIVOS);
    return response.data;
  }

  /**
   * Get usuario by email
   */
  static async getUsuarioByEmail(email: string): Promise<Usuario> {
    const response = await api.get<Usuario>(ENDPOINTS.USUARIO_BY_EMAIL(email));
    return response.data;
  }
}
