import type { 
  Equipo, 
  CreateEquipoRequest, 
  UpdateEquipoRequest,
  JugadorEquipo,
  AddJugadorToEquipoRequest
} from '../types';
import httpRest from '../../../../../services/httpRest';

// Endpoints
const ENDPOINTS = {
  EQUIPOS: '/equipo',
  EQUIPO_BY_ID: (id: number) => `/equipo/${id}`,
  EQUIPOS_BY_LIGA: (ligaId: number) => `/equipo?ligaId=${ligaId}`,
  JUGADORES_EQUIPO: (equipoId: number) => `/equipo/${equipoId}/jugadores`,
  ADD_JUGADOR: (equipoId: number) => `/equipo/${equipoId}/jugadores`,
  REMOVE_JUGADOR: (equipoId: number, jugadorId: number) => `/equipo/${equipoId}/jugadores/${jugadorId}`,
  ASSIGN_GROUP: (equipoId: number) => `/equipo/${equipoId}/grupo`,
} as const;

export class EquipoApiService {
  /**
   * Get equipos by liga
   */
  static async getEquiposByLiga(ligaId: number): Promise<Equipo[]> {
    return await httpRest.get<Equipo[]>(ENDPOINTS.EQUIPOS_BY_LIGA(ligaId));
  }

  /**
   * Get a single equipo by ID
   */
  static async getEquipoById(id: number): Promise<Equipo> {
    return await httpRest.get<Equipo>(ENDPOINTS.EQUIPO_BY_ID(id));
  }

  /**
   * Create a new equipo
   */
  static async createEquipo(data: CreateEquipoRequest): Promise<Equipo> {
    return await httpRest.post<Equipo>(ENDPOINTS.EQUIPOS, data);
  }

  /**
   * Update an existing equipo
   */
  static async updateEquipo(id: number, data: UpdateEquipoRequest): Promise<Equipo> {
    return await httpRest.patch<Equipo>(ENDPOINTS.EQUIPO_BY_ID(id), data);
  }

  /**
   * Delete an equipo
   */
  static async deleteEquipo(id: number): Promise<void> {
    await httpRest.delete(ENDPOINTS.EQUIPO_BY_ID(id));
  }

  /**
   * Assign equipo to group
   */
  static async assignEquipoToGroup(equipoId: number, grupoNumero: number): Promise<Equipo> {
    return await httpRest.put<Equipo>(ENDPOINTS.ASSIGN_GROUP(equipoId), { grupoNumero });
  }

  // ===========================
  // JUGADORES EN EQUIPO
  // ===========================

  /**
   * Get jugadores of an equipo
   */
  static async getJugadoresEquipo(equipoId: number): Promise<JugadorEquipo[]> {
    return await httpRest.get<JugadorEquipo[]>(ENDPOINTS.JUGADORES_EQUIPO(equipoId));
  }

  /**
   * Add jugador to equipo
   */
  static async addJugadorToEquipo(equipoId: number, data: AddJugadorToEquipoRequest): Promise<void> {
    await httpRest.post(ENDPOINTS.ADD_JUGADOR(equipoId), data);
  }

  /**
   * Remove jugador from equipo
   */
  static async removeJugadorFromEquipo(equipoId: number, jugadorId: number): Promise<void> {
    await httpRest.delete(ENDPOINTS.REMOVE_JUGADOR(equipoId, jugadorId));
  }
}
