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
  SEDES: '/sede',
  SEDE_BY_ID: (id: number) => `/sede/${id}`,
  TOGGLE_STATUS: (id: number) => `/sede/${id}/toggle-status`,
  CHANGE_STATUS: (id: number) => `/sede/${id}/status`,
};

/**
 * Servicio para la gestión de sedes
 */
export class SedeApiService {
  /**
   * Obtiene lista paginada de sedes con filtros
   */
  static async getSedes(filters: ListFiltersPaginate = {}): Promise<ResponsePaginate<Sede>> {
    const params = createParamsPaginate(filters);
    const response = await api.get<ResponsePaginate<Sede>>(ENDPOINTS.SEDES, { params });
    return response.data;
  }

  /**
   * Obtiene una sede por ID
   */
  static async getSedeById(id: number): Promise<Sede> {
    const response = await api.get<Sede>(ENDPOINTS.SEDE_BY_ID(id));
    return response.data;
  }

  /**
   * Crea una nueva sede
   */
  static async createSede(data: CreateSedeRequest): Promise<Sede> {
    const response = await api.post<Sede>(ENDPOINTS.SEDES, data);
    return response.data;
  }

  /**
   * Actualiza una sede existente
   */
  static async updateSede(id: number, data: UpdateSedeRequest): Promise<Sede> {
    const response = await api.patch<Sede>(ENDPOINTS.SEDE_BY_ID(id), data);
    return response.data;
  }

  /**
   * Elimina una sede (desactivación)
   */
  static async deleteSede(id: number): Promise<void> {
    await api.delete(ENDPOINTS.SEDE_BY_ID(id));
  }

  /**
   * Cambia el estado activo/inactivo de una sede
   */
  static async toggleSedeStatus(id: number): Promise<Sede> {
    const response = await api.patch<Sede>(ENDPOINTS.TOGGLE_STATUS(id));
    return response.data;
  }

  /**
   * Cambia explícitamente el estado de una sede
   */
  static async changeSedeStatus(id: number, active: boolean): Promise<Sede> {
    const response = await api.patch<Sede>(ENDPOINTS.CHANGE_STATUS(id), { active });
    return response.data;
  }

  /**
   * Obtiene lista simplificada de sedes activas (para selects)
   */
  static async getSedesLite(): Promise<SedeLite[]> {
    const response = await api.get<SedeLite[]>(`${ENDPOINTS.SEDES}?lite=true&active=true`);
    return response.data;
  }

  /**
   * Busca sedes con parámetros completos para FormWrapperSelectHttp
   */
  static async searchSedesWithParams(params: {
    page?: number;
    limit?: number;
    fields?: string;
    filter?: string;
    orderBy?: string;
    order?: 'asc' | 'desc';
  }): Promise<ResponsePaginate<SedeLite>> {
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', (params.page || 1).toString());
    queryParams.append('limit', (params.limit || 10).toString());
    queryParams.append('fields', params.fields || 'nombre');
    queryParams.append('orderBy', params.orderBy || 'nombre');
    queryParams.append('order', params.order || 'asc');
    
    if (params.filter) {
      queryParams.append('filter', params.filter);
    }

    const response = await api.get<ResponsePaginate<SedeLite>>(`${ENDPOINTS.SEDES}?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Busca sedes por término de búsqueda
   */
  static async searchSedes(searchTerm: string): Promise<Sede[]> {
    const response = await api.get<Sede[]>(`${ENDPOINTS.SEDES}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Verifica disponibilidad de nombre de sede
   */
  static async checkSedeNameAvailability(nombre: string, excludeId?: number): Promise<boolean> {
    const response = await api.get<{ available: boolean }>(`${ENDPOINTS.SEDES}/check-name`, {
      params: { nombre, excludeId }
    });
    return response.data.available;
  }

  /**
   * Obtiene estadísticas de uso de la sede
   */
  static async getSedeStats(id: number): Promise<{
    totalLigas: number;
    ligasActivas: number;
    totalPartidos: number;
    partidosHoy: number;
  }> {
    const response = await api.get(`${ENDPOINTS.SEDE_BY_ID(id)}/stats`);
    return response.data;
  }
}
