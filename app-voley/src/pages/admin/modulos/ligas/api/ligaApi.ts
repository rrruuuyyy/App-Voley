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
import httpRest from '../../../../../services/httpRest';

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
  ELIMINAR_CAPITAN: (id: number, capitanId: number) => `/liga/${id}/capitanes/${capitanId}`,
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
    return await httpRest.get<ResponsePaginate<Liga>>(ENDPOINTS.LIGAS, { params });
  }

  /**
   * Obtiene una liga por ID
   */
  static async getLigaById(id: number): Promise<Liga> {
    return await httpRest.get<Liga>(ENDPOINTS.LIGA_BY_ID(id));
  }

  /**
   * Crea una nueva liga
   */
  static async createLiga(data: CreateLigaRequest): Promise<Liga> {
    return await httpRest.post<Liga>(ENDPOINTS.LIGAS, data);
  }

  /**
   * Actualiza una liga existente
   */
  static async updateLiga(id: number, data: UpdateLigaRequest): Promise<Liga> {
    return await httpRest.patch<Liga>(ENDPOINTS.LIGA_BY_ID(id), data);
  }

  /**
   * Elimina una liga
   */
  static async deleteLiga(id: number): Promise<void> {
    await httpRest.delete(ENDPOINTS.LIGA_BY_ID(id));
  }

  /**
   * Inicia una liga (cambia status a "en_curso" y calcula automáticamente los números)
   */
  static async iniciarLiga(id: number): Promise<Liga> {
    return await httpRest.put<Liga>(ENDPOINTS.INICIAR_LIGA(id));
  }

  /**
   * Finaliza una liga (cambia status a "finalizada")
   */
  static async finalizarLiga(id: number): Promise<Liga> {
    return await httpRest.put<Liga>(ENDPOINTS.FINALIZAR_LIGA(id));
  }

  /**
   * Obtiene estadísticas calculadas de la liga
   */
  static async getEstadisticasLiga(id: number): Promise<LigaEstadisticas> {
    return await httpRest.get<LigaEstadisticas>(ENDPOINTS.ESTADISTICAS_LIGA(id));
  }

  /**
   * Obtiene funciones de cálculo para estadísticas de la liga
   */
  static async getCalculosLiga(id: number): Promise<any> {
    return await httpRest.get(ENDPOINTS.CALCULOS_LIGA(id));
  }

  /**
   * Obtiene los capitanes asignados a una liga
   */
  static async getCapitanesLiga(id: number): Promise<{
    total: number;
    capitanes: CapitanLiga[];
  }> {
    return await httpRest.get(ENDPOINTS.CAPITANES_LIGA(id));
  }

  /**
   * Asigna capitanes a una liga
   */
  static async asignarCapitanes(id: number, data: AsignarCapitanesRequest): Promise<{
    total: number;
    capitanes: CapitanLiga[];
  }> {
    return await httpRest.post(ENDPOINTS.ASIGNAR_CAPITANES(id), data);
  }

  /**
   * Elimina un capitán de una liga
   */
  static async eliminarCapitan(id: number, capitanId: number): Promise<{
    message: string;
    equipoEliminado: {
      id: number;
      nombre: string;
    } | null;
  }> {
    return await httpRest.delete(ENDPOINTS.ELIMINAR_CAPITAN(id, capitanId));
  }

  /**
   * Obtiene lista simplificada de ligas activas (para selects)
   */
  static async getLigasLite(): Promise<LigaLite[]> {
    return await httpRest.get<LigaLite[]>(`${ENDPOINTS.LIGAS}?lite=true`);
  }

  /**
   * Busca ligas por término de búsqueda
   */
  static async searchLigas(searchTerm: string): Promise<Liga[]> {
    return await httpRest.get<Liga[]>(`${ENDPOINTS.LIGAS}/search`, {
      params: { q: searchTerm }
    });
  }

  /**
   * Verifica disponibilidad de nombre de liga
   */
  static async checkLigaNameAvailability(nombre: string, excludeId?: number): Promise<boolean> {
    const response = await httpRest.get<{ available: boolean }>(`${ENDPOINTS.LIGAS}/check-name`, {
      params: { nombre, excludeId }
    });
    return response.available;
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
    return await httpRest.get(`${ENDPOINTS.LIGA_BY_ID(id)}/stats`);
  }
}

// Instancia por defecto para exportar
export const ligaApi = new LigaApiService();
