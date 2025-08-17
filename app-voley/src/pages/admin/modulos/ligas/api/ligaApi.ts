import type { 
  Liga, 
  CreateLigaRequest, 
  UpdateLigaRequest, 
  LigaLite,
  CapitanLiga,
  AsignarCapitanesRequest,
  LigaEstadisticas
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
  LIGAS: '/liga',
  LIGA_BY_ID: (id: number) => `/liga/${id}`,
  INICIAR_LIGA: (id: number) => `/liga/${id}/iniciar`,
  FINALIZAR_LIGA: (id: number) => `/liga/${id}/finalizar`,
  ESTADISTICAS_LIGA: (id: number) => `/liga/${id}/estadisticas`,
  CALCULOS_LIGA: (id: number) => `/liga/${id}/calculos`,
  CAPITANES_LIGA: (id: number) => `/liga/${id}/capitanes`,
  ASIGNAR_CAPITANES: (id: number) => `/liga/${id}/capitanes`,
};

/**
 * Servicio para la gestión de ligas
 */
export class LigaApiService {
  /**
   * Obtiene lista paginada de ligas con filtros
   */
  static async getLigas(filters: ListFiltersPaginate = {}): Promise<ResponsePaginate<Liga>> {
    const params = createParamsPaginate(filters);
    const response = await api.get<ResponsePaginate<Liga>>(ENDPOINTS.LIGAS, { params });
    return response.data;
  }

  /**
   * Obtiene una liga por ID
   */
  static async getLigaById(id: number): Promise<Liga> {
    const response = await api.get<Liga>(ENDPOINTS.LIGA_BY_ID(id));
    return response.data;
  }

  /**
   * Crea una nueva liga
   */
  static async createLiga(data: CreateLigaRequest): Promise<Liga> {
    const response = await api.post<Liga>(ENDPOINTS.LIGAS, data);
    return response.data;
  }

  /**
   * Actualiza una liga existente
   */
  static async updateLiga(id: number, data: UpdateLigaRequest): Promise<Liga> {
    const response = await api.patch<Liga>(ENDPOINTS.LIGA_BY_ID(id), data);
    return response.data;
  }

  /**
   * Elimina una liga
   */
  static async deleteLiga(id: number): Promise<void> {
    await api.delete(ENDPOINTS.LIGA_BY_ID(id));
  }

  /**
   * Inicia una liga (cambia status a "en_curso" y calcula automáticamente los números)
   */
  static async iniciarLiga(id: number): Promise<Liga> {
    const response = await api.put<Liga>(ENDPOINTS.INICIAR_LIGA(id));
    return response.data;
  }

  /**
   * Finaliza una liga (cambia status a "finalizada")
   */
  static async finalizarLiga(id: number): Promise<Liga> {
    const response = await api.put<Liga>(ENDPOINTS.FINALIZAR_LIGA(id));
    return response.data;
  }

  /**
   * Obtiene estadísticas calculadas de la liga
   */
  static async getEstadisticasLiga(id: number): Promise<LigaEstadisticas> {
    const response = await api.get<LigaEstadisticas>(ENDPOINTS.ESTADISTICAS_LIGA(id));
    return response.data;
  }

  /**
   * Obtiene funciones de cálculo para estadísticas de la liga
   */
  static async getCalculosLiga(id: number): Promise<any> {
    const response = await api.get(ENDPOINTS.CALCULOS_LIGA(id));
    return response.data;
  }

  /**
   * Obtiene los capitanes asignados a una liga
   */
  static async getCapitanesLiga(id: number): Promise<{
    total: number;
    capitanes: CapitanLiga[];
  }> {
    const response = await api.get(ENDPOINTS.CAPITANES_LIGA(id));
    return response.data;
  }

  /**
   * Asigna capitanes a una liga
   */
  static async asignarCapitanes(id: number, data: AsignarCapitanesRequest): Promise<{
    total: number;
    capitanes: CapitanLiga[];
  }> {
    const response = await api.post(ENDPOINTS.ASIGNAR_CAPITANES(id), data);
    return response.data;
  }

  /**
   * Obtiene lista simplificada de ligas activas (para selects)
   */
  static async getLigasLite(): Promise<LigaLite[]> {
    const response = await api.get<LigaLite[]>(`${ENDPOINTS.LIGAS}?lite=true`);
    return response.data;
  }

  /**
   * Busca ligas por término de búsqueda
   */
  static async searchLigas(searchTerm: string): Promise<Liga[]> {
    const response = await api.get<Liga[]>(`${ENDPOINTS.LIGAS}/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Verifica disponibilidad de nombre de liga
   */
  static async checkLigaNameAvailability(nombre: string, excludeId?: number): Promise<boolean> {
    const response = await api.get<{ available: boolean }>(`${ENDPOINTS.LIGAS}/check-name`, {
      params: { nombre, excludeId }
    });
    return response.data.available;
  }

  /**
   * Obtiene estadísticas generales de una liga (equipos, partidos, etc.)
   */
  static async getLigaStats(id: number): Promise<{
    totalEquipos: number;
    equiposActivos: number;
    totalPartidos: number;
    partidosJugados: number;
    partidosPendientes: number;
  }> {
    const response = await api.get(`${ENDPOINTS.LIGA_BY_ID(id)}/stats`);
    return response.data;
  }
}

// Instancia por defecto para exportar
export const ligaApi = new LigaApiService();
