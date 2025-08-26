// Enums para jornadas y partidos
export const TipoJornadaEnum = {
  AUTOMATICA: 'AUTOMATICA',
  PERSONALIZADA: 'PERSONALIZADA'
} as const;

export type TipoJornada = typeof TipoJornadaEnum[keyof typeof TipoJornadaEnum];

export const StatusJornadaEnum = {
  PROGRAMADA: 'PROGRAMADA',
  EN_CURSO: 'EN_CURSO',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA'
} as const;

export type StatusJornada = typeof StatusJornadaEnum[keyof typeof StatusJornadaEnum];

export const StatusPartidoEnum = {
  PROGRAMADO: 'PROGRAMADO',
  EN_CURSO: 'EN_CURSO',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
  SUSPENDIDO: 'SUSPENDIDO'
} as const;

export type StatusPartido = typeof StatusPartidoEnum[keyof typeof StatusPartidoEnum];

// Interfaces base
export interface Equipo {
  id: number;
  nombre: string;
  capitan?: {
    id: number;
    nombre: string;
  };
}

export interface DetalleSet {
  local: number;
  visitante: number;
}

export interface Partido {
  id?: number;
  jornada?: number;
  vuelta: number;
  fechaHora?: string;
  status: StatusPartido;
  equipoLocalId: number;
  equipoVisitanteId: number;
  equipoLocal?: Equipo;
  equipoVisitante?: Equipo;
  setsEquipoLocal?: number;
  setsEquipoVisitante?: number;
  detallesSets?: DetalleSet[];
  puntosEquipoLocal?: number;
  puntosEquipoVisitante?: number;
  observaciones?: string;
}

export interface Jornada {
  id?: number;
  numero: number;
  nombre?: string;
  descripcion?: string;
  tipo: TipoJornada;
  status: StatusJornada;
  fechaProgramada: string;
  horaProgramada: string;
  partidosCompletados: number;
  partidosTotales: number;
  partidos: Partido[];
  ligaId: number;
  createdAt?: string;
  creadoPor?: {
    id: number;
    nombre: string;
  };
}

// Interfaces para formularios
export interface PartidoFormData {
  equipoLocalId: number;
  equipoVisitanteId: number;
  vuelta: number;
  fechaHora: string;
}

export interface JornadaFormData {
  nombre: string;
  descripcion?: string;
  ligaId: number;
  fechaProgramada: string;
  horaProgramada: string;
  partidos: PartidoFormData[];
}

export interface ResultadoPartidoFormData {
  setsEquipoLocal: number;
  setsEquipoVisitante: number;
  detallesSets: DetalleSet[];
  observaciones?: string;
}

// Interfaces para gestión de equipos disponibles
export interface EquipoDisponible extends Equipo {
  partidosJugados: number;
  partidosPendientes: number;
  puntos: number;
  posicion?: number;
  yaJugoContra?: number[]; // IDs de equipos contra los que ya jugó
}

export interface EstadoLiga {
  liga: {
    id: number;
    nombre: string;
    status: string;
    vueltas: number;
    numeroGrupos: number;
    sistemaPuntos: string;
  };
  resumen: {
    equiposTotal: number;
    partidosTotales: number;
    partidosCompletados: number;
    partidosPendientes: number;
    jornadaActual: number;
    porcentajeCompletado: number;
  };
  equipos: EquipoDisponible[];
  proximasJornadas: Jornada[];
}

// Interfaces para drag and drop
export interface PartidoSlot {
  id: string;
  horario: string;
  partido?: Partido;
  equipoLocal?: Equipo | null;
  equipoVisitante?: Equipo | null;
}

export interface JornadaConfig {
  fecha: string;
  horaInicio: string;
  numeroPartidos: number;
  duracionPartido: number; // en minutos
  descansoEntrePartidos: number; // en minutos
  vuelta?: number; // Vuelta en la que se jugará la jornada
}

// Estructura de respuesta de la API para equipos
export interface EquipoDetalle {
  id: number;
  nombre: string;
  grupoNumero: number;
  color: string;
  descripcion: string;
  capitan: {
    id: number;
    nombre: string;
    correo: string;
  };
}

export interface EquiposDisponiblesResponse {
  liga: {
    id: number;
    nombre: string;
    numeroGrupos: number;
    status: string;
  };
  grupo: any | null;
  totalEquipos: number;
  equipos: EquipoDetalle[];
}
