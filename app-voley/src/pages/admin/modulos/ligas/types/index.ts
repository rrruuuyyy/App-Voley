// Enums para los estados y sistemas
export const LigaStatusEnum = {
  PROGRAMADA: 'programada',
  EN_CURSO: 'en_curso',
  FINALIZADA: 'finalizada',
  CANCELADA: 'cancelada'
} as const;

export type LigaStatus = typeof LigaStatusEnum[keyof typeof LigaStatusEnum];

export const SistemaPuntosEnum = {
  FIVB: 'fivb',
  SIMPLE: 'simple'
} as const;

export type SistemaPuntos = typeof SistemaPuntosEnum[keyof typeof SistemaPuntosEnum];

export const CriteriosDesempateEnum = {
  PUNTOS: 'puntos',
  VICTORIAS: 'victorias',
  SET_RATIO: 'set_ratio',
  POINT_RATIO: 'point_ratio',
  HEAD_TO_HEAD: 'head_to_head'
} as const;

export type CriterioDesempate = typeof CriteriosDesempateEnum[keyof typeof CriteriosDesempateEnum];

// Interfaces principales
export interface Liga {
  id: number;
  nombre: string;
  descripcion?: string;
  vueltas: number;
  numeroGrupos: number;
  sistemaPuntos: SistemaPuntos;
  criteriosDesempate: CriterioDesempate[];
  maxPartidosPorDia: number;
  duracionEstimadaPartido: number; // en minutos
  descansoMinimo: number; // en minutos
  fechaInicio: string;
  fechaFin: string;
  status: LigaStatus;
  adminLigaId: number;
  sedeId: number;
  
  // Campos calculados automáticamente al iniciar liga
  numeroEquipos?: number;
  partidosPorEquipo?: number;
  partidosTotales?: number;
  totalJornadas?: number;
  partidosPorJornada?: number;
  calculado?: boolean;
  
  // Relaciones
  adminLiga?: {
    id: number;
    nombre: string;
    correo: string;
  };
  sede?: {
    id: number;
    nombre: string;
    direccion: string;
  };
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLigaRequest {
  nombre: string;
  descripcion?: string;
  vueltas: number;
  numeroGrupos: number;
  sistemaPuntos: SistemaPuntos;
  criteriosDesempate: CriterioDesempate[];
  maxPartidosPorDia: number;
  duracionEstimadaPartido: number;
  descansoMinimo: number;
  fechaInicio: string;
  fechaFin: string;
  adminLigaId: number;
  sedeId: number;
}

export interface UpdateLigaRequest {
  nombre?: string;
  descripcion?: string;
  vueltas?: number;
  numeroGrupos?: number;
  sistemaPuntos?: SistemaPuntos;
  criteriosDesempate?: CriterioDesempate[];
  maxPartidosPorDia?: number;
  duracionEstimadaPartido?: number;
  descansoMinimo?: number;
  fechaInicio?: string;
  fechaFin?: string;
  adminLigaId?: number;
  sedeId?: number;
}

// Tipos para formularios
export interface LigaForm {
  nombre: string;
  descripcion: string;
  vueltas: number;
  numeroGrupos: number;
  sistemaPuntos: SistemaPuntos;
  criteriosDesempate: CriterioDesempate[];
  maxPartidosPorDia: number;
  duracionEstimadaPartido: number;
  descansoMinimo: number;
  fechaInicio: string;
  fechaFin: string;
  adminLigaId: number;
  sedeId: number;
}

export interface UpdateLigaForm {
  nombre: string;
  descripcion: string;
  vueltas: number;
  numeroGrupos: number;
  sistemaPuntos: SistemaPuntos;
  criteriosDesempate: CriterioDesempate[];
  maxPartidosPorDia: number;
  duracionEstimadaPartido: number;
  descansoMinimo: number;
  fechaInicio: string;
  fechaFin: string;
  adminLigaId: number;
  sedeId: number;
}

// Tipos adicionales
export interface LigaLite {
  id: number;
  nombre: string;
  status: LigaStatus;
  fechaInicio: string;
  fechaFin: string;
}

// Tipos para capitanes
export interface CapitanLiga {
  id: number;
  nombre: string;
  correo: string;
  fechaAsignacion: string;
  equipo?: {
    id: number;
    nombre: string;
    color: string;
    descripcion: string;
    grupoNumero: number;
    active: boolean;
    ligaId?: number;
    capitanId?: number;
    createdAt: string;
    deletedAt: string | null;
  } | null;
}

export interface AsignarCapitanesRequest {
  capitanesIds: number[];
}

// Tipos para estadísticas
export interface LigaEstadisticas {
  id: number;
  nombre: string;
  status: LigaStatus;
  vueltas: number;
  numeroEquipos: number;
  partidosPorEquipo: number;
  partidosTotales: number;
  totalJornadas: number;
  partidosPorJornada: number;
  calculado: boolean;
}

// ====================================================
// TIPOS PARA GESTIÓN DE GRUPOS
// ====================================================

export const MetodoAsignacionEnum = {
  BALANCEADO: 'BALANCEADO',
  ALEATORIO: 'ALEATORIO',
  POR_RANKING: 'POR_RANKING'
} as const;

export type MetodoAsignacion = typeof MetodoAsignacionEnum[keyof typeof MetodoAsignacionEnum];

export interface GrupoDetalle {
  grupoNumero: number;
  cantidadEquipos: number;
  equipos: EquipoBasico[];
}

export interface EquipoBasico {
  id: number;
  nombre: string;
  capitan: {
    id: number;
    nombre: string;
  };
  color?: string;
  descripcion?: string;
}

export interface EstadoGrupos {
  liga: {
    id: number;
    nombre: string;
    numeroGrupos: number;
  };
  totalEquipos: number;
  equiposAsignados: number;
  equiposSinAsignar: number;
  grupos: GrupoDetalle[];
  equiposSinGrupo: EquipoBasico[];
}

export interface AsignacionGrupo {
  equipoId: number;
  grupoNumero: number;
}

export interface AsignarGruposAutomaticoRequest {
  ligaId: number;
  metodo?: MetodoAsignacion;
}

export interface AsignarGruposMasivoRequest {
  asignaciones: AsignacionGrupo[];
}

export interface AsignacionExitosa {
  equipoId: number;
  equipoNombre: string;
  grupoAnterior: number;
  grupoNuevo: number;
  status: 'exitoso';
}

export interface AsignacionError {
  equipoId: number;
  grupoNumero: number;
  error: string;
  status: 'error';
}

export interface AsignacionAutomaticaResult {
  message: string;
  liga: {
    id: number;
    nombre: string;
    numeroGrupos: number;
  };
  metodoUsado: MetodoAsignacion;
  totalEquipos: number;
  equiposPorGrupo: number;
  asignaciones: {
    equipoId: number;
    equipoNombre: string;
    grupoAsignado: number;
  }[];
  resumenGrupos: {
    grupoNumero: number;
    cantidadEquipos: number;
    equipos: {
      id: number;
      nombre: string;
    }[];
  }[];
}

export interface AsignacionMasivaResult {
  message: string;
  exitosos: AsignacionExitosa[];
  errores: AsignacionError[];
  resumen: {
    total: number;
    exitosos: number;
    errores: number;
  };
}

export interface ValidacionGrupos {
  liga: {
    id: number;
    nombre: string;
  };
  totalEquipos: number;
  equiposAsignados: number;
  equiposSinAsignar: number;
  grupos: GrupoDetalle[];
  validacion: {
    esValida: boolean;
    problemas: string[];
    recomendaciones: string[];
    puedeIniciarLiga: boolean;
  };
}
