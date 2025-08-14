import axios from 'axios';
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

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // Ajustar según tu configuración de backend
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

// Servicios de autenticación
export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async loginSucursal(code: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login-sucursal', { code });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Servicios de usuarios
export const userService = {
  async createJugador(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/usuario/jugador', userData);
    return response.data;
  },

  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/usuario', userData);
    return response.data;
  },

  async getAllUsers(): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/usuario');
    return response.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`/usuario/${id}`);
    return response.data;
  },

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    const response = await api.patch<User>(`/usuario/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/usuario/${id}`);
  },

  async changeRole(userId: number, newRole: string): Promise<User> {
    const response = await api.put<User>(`/usuario/${userId}/role`, { newRole });
    return response.data;
  },

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await api.get<User[]>(`/usuario/by-role/${role}`);
    return response.data;
  },

  async getUserByQR(qrCode: string): Promise<User> {
    const response = await api.get<User>(`/usuario/qr/${qrCode}`);
    return response.data;
  },

  async generateQR(userId: number): Promise<User> {
    const response = await api.put<User>(`/usuario/${userId}/generate-qr`);
    return response.data;
  }
};

// Servicios de sedes
export const sedeService = {
  async create(sedeData: Omit<Sede, 'id' | 'isActive'>): Promise<Sede> {
    const response = await api.post<Sede>('/sede', sedeData);
    return response.data;
  },

  async getAll(): Promise<Sede[]> {
    const response = await api.get<Sede[]>('/sede');
    return response.data;
  },

  async getById(id: number): Promise<Sede> {
    const response = await api.get<Sede>(`/sede/${id}`);
    return response.data;
  },

  async update(id: number, sedeData: Partial<Sede>): Promise<Sede> {
    const response = await api.patch<Sede>(`/sede/${id}`, sedeData);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/sede/${id}`);
  }
};

// Servicios de ligas
export const ligaService = {
  async create(ligaData: CreateLigaRequest): Promise<Liga> {
    const response = await api.post<Liga>('/liga', ligaData);
    return response.data;
  },

  async getAll(): Promise<Liga[]> {
    const response = await api.get<Liga[]>('/liga');
    return response.data;
  },

  async getById(id: number): Promise<Liga> {
    const response = await api.get<Liga>(`/liga/${id}`);
    return response.data;
  },

  async iniciar(id: number): Promise<Liga> {
    const response = await api.put<Liga>(`/liga/${id}/iniciar`);
    return response.data;
  },

  async finalizar(id: number): Promise<Liga> {
    const response = await api.put<Liga>(`/liga/${id}/finalizar`);
    return response.data;
  }
};

// Servicios de equipos
export const equipoService = {
  async create(equipoData: CreateEquipoRequest): Promise<Equipo> {
    const response = await api.post<Equipo>('/equipo', equipoData);
    return response.data;
  },

  async getByLiga(ligaId: number): Promise<Equipo[]> {
    const response = await api.get<Equipo[]>(`/equipo?ligaId=${ligaId}`);
    return response.data;
  },

  async addJugador(equipoId: number, jugadorData: AddJugadorToEquipoRequest): Promise<void> {
    await api.post(`/equipo/${equipoId}/jugadores`, jugadorData);
  },

  async getJugadores(equipoId: number) {
    const response = await api.get(`/equipo/${equipoId}/jugadores`);
    return response.data;
  },

  async removeJugador(equipoId: number, jugadorId: number): Promise<void> {
    await api.delete(`/equipo/${equipoId}/jugadores/${jugadorId}`);
  },

  async assignToGroup(equipoId: number, grupoNumero: number): Promise<Equipo> {
    const response = await api.put<Equipo>(`/equipo/${equipoId}/grupo`, { grupoNumero });
    return response.data;
  }
};

// Servicios de partidos
export const partidoService = {
  async generateFixtures(ligaId: number, grupo?: number) {
    const url = `/partido/generate-fixtures/${ligaId}${grupo ? `?grupo=${grupo}` : ''}`;
    const response = await api.post(url);
    return response.data;
  },

  async getByLiga(ligaId: number, jornada?: number): Promise<Partido[]> {
    const url = `/partido/liga/${ligaId}${jornada ? `?jornada=${jornada}` : ''}`;
    const response = await api.get<Partido[]>(url);
    return response.data;
  },

  async registrarResultado(partidoId: number, resultado: RegistrarResultadoRequest): Promise<Partido> {
    const response = await api.put<Partido>(`/partido/${partidoId}/resultado`, resultado);
    return response.data;
  },

  async getTabla(ligaId: number, grupo?: number): Promise<TablaEquipo[]> {
    const url = `/partido/tabla/${ligaId}${grupo ? `?grupo=${grupo}` : ''}`;
    const response = await api.get<TablaEquipo[]>(url);
    return response.data;
  }
};

export default api;
