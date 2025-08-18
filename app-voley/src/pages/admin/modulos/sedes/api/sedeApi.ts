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
import httpRest from '../../../../../services/httpRest';

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
    return await httpRest.get<ResponsePaginate<Sede>>(ENDPOINTS.SEDES, { params });
  }

  /**
   * Obtiene una sede por ID
   */
  static async getSedeById(id: number): Promise<Sede> {
    return await httpRest.get<Sede>(ENDPOINTS.SEDE_BY_ID(id));
  }

  /**
   * Crea una nueva sede
   */
  static async createSede(data: CreateSedeRequest): Promise<Sede> {
    return await httpRest.post<Sede>(ENDPOINTS.SEDES, data);
  }

  /**
   * Actualiza una sede existente
   */
  static async updateSede(id: number, data: UpdateSedeRequest): Promise<Sede> {
    return await httpRest.patch<Sede>(ENDPOINTS.SEDE_BY_ID(id), data);
  }

  /**
   * Elimina una sede (desactivación)
   */
  static async deleteSede(id: number): Promise<void> {
    await httpRest.delete(ENDPOINTS.SEDE_BY_ID(id));
  }

  /**
   * Cambia el estado activo/inactivo de una sede
   */
  static async toggleSedeStatus(id: number): Promise<Sede> {
    return await httpRest.patch<Sede>(ENDPOINTS.TOGGLE_STATUS(id));
  }

  /**
   * Cambia explícitamente el estado de una sede
   */
  static async changeSedeStatus(id: number, active: boolean): Promise<Sede> {
    return await httpRest.patch<Sede>(ENDPOINTS.CHANGE_STATUS(id), { active });
  }

  /**
   * Obtiene lista simplificada de sedes activas (para selects)
   */
  static async getSedesLite(): Promise<SedeLite[]> {
    return await httpRest.get<SedeLite[]>(`${ENDPOINTS.SEDES}?lite=true&active=true`);
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

    return await httpRest.get<ResponsePaginate<SedeLite>>(`${ENDPOINTS.SEDES}?${queryParams.toString()}`);
  }

  /**
   * Busca sedes por término de búsqueda
   */
  static async searchSedes(searchTerm: string): Promise<Sede[]> {
    return await httpRest.get<Sede[]>(`${ENDPOINTS.SEDES}/search`, {
      params: { q: searchTerm }
    });
  }

  /**
   * Verifica disponibilidad de nombre de sede
   */
  static async checkSedeNameAvailability(nombre: string, excludeId?: number): Promise<boolean> {
    const response = await httpRest.get<{ available: boolean }>(`${ENDPOINTS.SEDES}/check-name`, {
      params: { nombre, excludeId }
    });
    return response.available;
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
    return await httpRest.get(`${ENDPOINTS.SEDE_BY_ID(id)}/stats`);
  }
}
