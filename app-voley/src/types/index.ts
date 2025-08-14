export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'administrador' | 'admin_liga' | 'capitan' | 'jugador';
  qrCode?: string;
  isActive?: boolean;
  active?: boolean; // Para compatibilidad con la API que devuelve 'active'
  sucursalId?: number;
  createdAt?: string;
  updatedAt?: string;
  // Para compatibilidad con el contexto anterior
  u_name?: string;
  u_email?: string;
  u_role?: 'administrador' | 'admin_liga' | 'capitan' | 'jugador';
}

export interface CreateUserDto {
  nombre: string;
  correo: string;
  password: string;
  rol: 'administrador' | 'admin_liga' | 'capitan' | 'jugador';
  sucursalId?: number;
}

export interface UpdateUserDto {
  nombre?: string;
  correo?: string;
  password?: string;
  rol?: 'administrador' | 'admin_liga' | 'capitan' | 'jugador';
  sucursalId?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    itemCount: number;
    pageCount: number | null;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  numeroCancha: number;
  isActive: boolean;
}

export interface Liga {
  id: number;
  nombre: string;
  descripcion?: string;
  vueltas: number;
  numeroGrupos: number;
  sistemaPuntos: 'fivb' | 'simple';
  criteriosDesempate: string[];
  maxPartidosPorDia: number;
  duracionEstimadaPartido: number;
  descansoMinimo: number;
  fechaInicio: string;
  fechaFin: string;
  status: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
  adminLigaId: number;
  sedeId: number;
  sede?: Sede;
  adminLiga?: User;
}

export interface Equipo {
  id: number;
  nombre: string;
  color: string;
  descripcion?: string;
  grupoNumero: number;
  capitanId: number;
  ligaId: number;
  capitan?: User;
  liga?: Liga;
  jugadores?: EquipoJugador[];
}

export interface EquipoJugador {
  id: number;
  equipoId: number;
  jugadorId: number;
  numeroJugador: string;
  posicion: string;
  jugador?: User;
}

export interface Partido {
  id: number;
  equipoLocalId: number;
  equipoVisitanteId: number;
  ligaId: number;
  grupoNumero: number;
  jornada: number;
  setsEquipoLocal?: number;
  setsEquipoVisitante?: number;
  puntosLigaLocal?: number;
  puntosLigaVisitante?: number;
  detallesSets?: SetDetail[];
  observaciones?: string;
  fechaProgramada?: string;
  fechaJugado?: string;
  status: 'programado' | 'en_curso' | 'finalizado' | 'cancelado' | 'aplazado';
  equipoLocal?: Equipo;
  equipoVisitante?: Equipo;
}

export interface SetDetail {
  local: number;
  visitante: number;
}

export interface TablaEquipo {
  equipo: Equipo;
  partidosJugados: number;
  victorias: number;
  derrotas: number;
  setsGanados: number;
  setsPerdidos: number;
  puntosAFavor: number;
  puntosEnContra: number;
  puntosLiga: number;
  setRatio: number;
  pointRatio: number;
  posicion?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface CreateUserRequest {
  nombre: string;
  correo: string;
  password: string;
  rol: 'jugador';
}

export interface CreateLigaRequest {
  nombre: string;
  descripcion?: string;
  vueltas: number;
  numeroGrupos: number;
  sistemaPuntos: 'fivb' | 'simple';
  criteriosDesempate: string[];
  maxPartidosPorDia: number;
  duracionEstimadaPartido: number;
  descansoMinimo: number;
  fechaInicio: string;
  fechaFin: string;
  adminLigaId: number;
  sedeId: number;
}

export interface CreateEquipoRequest {
  nombre: string;
  color: string;
  descripcion?: string;
  grupoNumero: number;
  capitanId: number;
  ligaId: number;
}

export interface AddJugadorToEquipoRequest {
  jugadorId: number;
  numeroJugador: string;
  posicion: string;
}

export interface RegistrarResultadoRequest {
  setsEquipoLocal: number;
  setsEquipoVisitante: number;
  detallesSets: SetDetail[];
  observaciones?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
