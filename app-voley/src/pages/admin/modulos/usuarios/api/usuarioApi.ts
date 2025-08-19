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
import httpRest from '../../../../../services/httpRest';

// Endpoints
const ENDPOINTS = {
  USUARIOS: '/usuario',
  USUARIO_BY_ID: (id: number) => `/usuario/${id}`,
  TOGGLE_STATUS: (id: number) => `/usuario/${id}/toggle-status`,
  USUARIOS_LITE: '/usuario/lite',
  USUARIOS_ACTIVOS: '/usuario/activos',
  USUARIO_BY_EMAIL: (email: string) => `/usuario/email/${email}`,
  CHANGE_PASSWORD: (id: number) => `/usuario/${id}/change-password`,
  USUARIOS_TEMPORALES: '/usuario/temporal',
  USUARIOS_TEMPORALES_LIST: '/usuario/temporales',
  QR_INFO: (qrCode: string) => `/usuario/qr-info/${qrCode}`,
  REGISTRO_QR: '/usuario/registro-qr'
} as const;

export class UsuarioApiService {
  /**
   * Get list of usuarios with pagination and filters
   */
  static async getUsuarios(filters: ListFiltersPaginate = {}): Promise<ResponsePaginate<Usuario>> {
    const params = createParamsPaginate(filters);
    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.USUARIOS}?${queryString}` : ENDPOINTS.USUARIOS;
    
    return await httpRest.get<ResponsePaginate<Usuario>>(url);
  }

  /**
   * Get a single usuario by ID
   */
  static async getUsuarioById(id: number): Promise<Usuario> {
    return await httpRest.get<Usuario>(ENDPOINTS.USUARIO_BY_ID(id));
  }

  /**
   * Create a new usuario
   */
  static async createUsuario(data: CreateUsuarioRequest): Promise<Usuario> {
    return await httpRest.post<Usuario>(ENDPOINTS.USUARIOS, data);
  }

  /**
   * Update an existing usuario
   */
  static async updateUsuario(id: number, data: UpdateUsuarioRequest): Promise<Usuario> {
    return await httpRest.patch<Usuario>(ENDPOINTS.USUARIO_BY_ID(id), data);
  }

  /**
   * Delete a usuario
   */
  static async deleteUsuario(id: number): Promise<void> {
    await httpRest.delete(ENDPOINTS.USUARIO_BY_ID(id));
  }

  /**
   * Toggle usuario status (activate/deactivate)
   */
  static async toggleUsuarioStatus(id: number): Promise<Usuario> {
    return await httpRest.patch<Usuario>(ENDPOINTS.TOGGLE_STATUS(id));
  }

  /**
   * Change user password
   */
  static async changePassword(id: number, newPassword: string): Promise<Usuario> {
    return await httpRest.put<Usuario>(ENDPOINTS.CHANGE_PASSWORD(id), { 
      password: newPassword 
    });
  }

  // ===========================
  // SPECIALIZED ENDPOINTS
  // ===========================

  /**
   * Get simplified list of active usuarios
   */
  static async getUsuariosLite(): Promise<UsuarioLite[]> {
    return await httpRest.get<UsuarioLite[]>(ENDPOINTS.USUARIOS_LITE);
  }

  /**
   * Get active usuarios
   */
  static async getUsuariosActivos(): Promise<Usuario[]> {
    return await httpRest.get<Usuario[]>(ENDPOINTS.USUARIOS_ACTIVOS);
  }

  /**
   * Get usuario by email
   */
  static async getUsuarioByEmail(email: string): Promise<Usuario> {
    return await httpRest.get<Usuario>(ENDPOINTS.USUARIO_BY_EMAIL(email));
  }

  // ===========================
  // USUARIOS TEMPORALES
  // ===========================

  /**
   * Create temporal usuario
   */
  static async createUsuarioTemporal(data: {
    nombre: string;
    rol: string;
    descripcion?: string;
  }): Promise<{
    message: string;
    usuario: Usuario;
    qrCode: string;
    urlRegistro: string;
  }> {
    return await httpRest.post(ENDPOINTS.USUARIOS_TEMPORALES, data);
  }

  /**
   * Get QR info
   */
  static async getQRInfo(qrCode: string): Promise<{
    id: number;
    nombre: string;
    rol: string;
    esUsuarioTemporal: boolean;
    qrCode: string;
    tieneCorreo: boolean;
  }> {
    return await httpRest.get(ENDPOINTS.QR_INFO(qrCode));
  }

  /**
   * Complete registration with QR
   */
  static async registroConQR(data: {
    qrCode: string;
    correo: string;
    password: string;
  }): Promise<{
    message: string;
    usuario: Usuario;
  }> {
    return await httpRest.post(ENDPOINTS.REGISTRO_QR, data);
  }

  /**
   * Get list of usuarios temporales
   */
  static async getUsuariosTemporales(filters?: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: Usuario[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${ENDPOINTS.USUARIOS_TEMPORALES_LIST}?${queryString}` : ENDPOINTS.USUARIOS_TEMPORALES_LIST;
    
    return await httpRest.get(url);
  }
}
