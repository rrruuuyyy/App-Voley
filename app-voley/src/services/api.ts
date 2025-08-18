import httpRest from './httpRest';
import type { 
  AuthResponse, 
  LoginRequest, 
  CreateUserRequest,
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
  Sede,
  Liga,
  CreateLigaRequest,
  Equipo,
  CreateEquipoRequest,
  AddJugadorToEquipoRequest,
  Partido,
  RegistrarResultadoRequest,
  TablaEquipo
} from '../types';

// Servicios de autenticación
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return await httpRest.post<AuthResponse>('/auth/login', credentials);
  },

  async loginSucursal(code: string): Promise<AuthResponse> {
    return await httpRest.post<AuthResponse>('/auth/login-sucursal', { code });
  },

  async getMe(): Promise<User> {
    return await httpRest.get<User>('/auth/me');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Servicios de usuarios
export const userService = {
  async createJugador(userData: CreateUserRequest): Promise<User> {
    return await httpRest.post<User>('/usuario/jugador', userData);
  },

  async createUser(userData: CreateUserDto): Promise<User> {
    return await httpRest.post<User>('/usuario', userData);
  },

  async getAllUsers(): Promise<PaginatedResponse<User>> {
    return await httpRest.get<PaginatedResponse<User>>('/usuario');
  },

  async getUserById(id: number): Promise<User> {
    return await httpRest.get<User>(`/usuario/${id}`);
  },

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    return await httpRest.patch<User>(`/usuario/${id}`, userData);
  },

  async deleteUser(id: number): Promise<void> {
    await httpRest.delete(`/usuario/${id}`);
  },

  async changeRole(userId: number, newRole: string): Promise<User> {
    return await httpRest.put<User>(`/usuario/${userId}/role`, { newRole });
  },

  async getUsersByRole(role: string): Promise<User[]> {
    return await httpRest.get<User[]>(`/usuario/by-role/${role}`);
  },

  async getUserByQR(qrCode: string): Promise<User> {
    return await httpRest.get<User>(`/usuario/qr/${qrCode}`);
  },

  async generateQR(userId: number): Promise<User> {
    return await httpRest.put<User>(`/usuario/${userId}/generate-qr`);
  }
};

// Servicios de sedes
export const sedeService = {
  async create(sedeData: Omit<Sede, 'id' | 'isActive'>): Promise<Sede> {
    return await httpRest.post<Sede>('/sede', sedeData);
  },

  async getAll(): Promise<Sede[]> {
    return await httpRest.get<Sede[]>('/sede');
  },

  async getById(id: number): Promise<Sede> {
    return await httpRest.get<Sede>(`/sede/${id}`);
  },

  async update(id: number, sedeData: Partial<Sede>): Promise<Sede> {
    return await httpRest.patch<Sede>(`/sede/${id}`, sedeData);
  },

  async delete(id: number): Promise<void> {
    await httpRest.delete(`/sede/${id}`);
  }
};

// Servicios de ligas
export const ligaService = {
  async create(ligaData: CreateLigaRequest): Promise<Liga> {
    return await httpRest.post<Liga>('/liga', ligaData);
  },

  async getAll(): Promise<Liga[]> {
    return await httpRest.get<Liga[]>('/liga');
  },

  async getById(id: number): Promise<Liga> {
    return await httpRest.get<Liga>(`/liga/${id}`);
  },

  async iniciar(id: number): Promise<Liga> {
    return await httpRest.put<Liga>(`/liga/${id}/iniciar`);
  },

  async finalizar(id: number): Promise<Liga> {
    return await httpRest.put<Liga>(`/liga/${id}/finalizar`);
  }
};

// Servicios de equipos
export const equipoService = {
  async create(equipoData: CreateEquipoRequest): Promise<Equipo> {
    return await httpRest.post<Equipo>('/equipo', equipoData);
  },

  async getByLiga(ligaId: number): Promise<Equipo[]> {
    return await httpRest.get<Equipo[]>(`/equipo?ligaId=${ligaId}`);
  },

  async addJugador(equipoId: number, jugadorData: AddJugadorToEquipoRequest): Promise<void> {
    await httpRest.post(`/equipo/${equipoId}/jugadores`, jugadorData);
  },

  async getJugadores(equipoId: number) {
    return await httpRest.get(`/equipo/${equipoId}/jugadores`);
  },

  async removeJugador(equipoId: number, jugadorId: number): Promise<void> {
    await httpRest.delete(`/equipo/${equipoId}/jugadores/${jugadorId}`);
  },

  async assignToGroup(equipoId: number, grupoNumero: number): Promise<Equipo> {
    return await httpRest.put<Equipo>(`/equipo/${equipoId}/grupo`, { grupoNumero });
  }
};

// Servicios de partidos
export const partidoService = {
  async generateFixtures(ligaId: number, grupo?: number) {
    const url = `/partido/generate-fixtures/${ligaId}${grupo ? `?grupo=${grupo}` : ''}`;
    return await httpRest.post(url);
  },

  async getByLiga(ligaId: number, jornada?: number): Promise<Partido[]> {
    const url = `/partido/liga/${ligaId}${jornada ? `?jornada=${jornada}` : ''}`;
    return await httpRest.get<Partido[]>(url);
  },

  async registrarResultado(partidoId: number, resultado: RegistrarResultadoRequest): Promise<Partido> {
    return await httpRest.put<Partido>(`/partido/${partidoId}/resultado`, resultado);
  },

  async getTabla(ligaId: number, grupo?: number): Promise<TablaEquipo[]> {
    const url = `/partido/tabla/${ligaId}${grupo ? `?grupo=${grupo}` : ''}`;
    return await httpRest.get<TablaEquipo[]>(url);
  }
};

export default httpRest;
