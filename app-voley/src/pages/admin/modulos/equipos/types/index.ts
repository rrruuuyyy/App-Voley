// Enums para equipos
export const EquipoStatusEnum = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo'
} as const;

export type EquipoStatus = typeof EquipoStatusEnum[keyof typeof EquipoStatusEnum];

// Interfaces principales
export interface Equipo {
  id: number;
  nombre: string;
  color: string;
  descripcion?: string;
  grupoNumero: number;
  active: boolean;
  ligaId: number;
  capitanId: number;
  
  // Relaciones
  capitan?: {
    id: number;
    nombre: string;
    correo: string;
  };
  liga?: {
    id: number;
    nombre: string;
  };
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEquipoRequest {
  nombre: string;
  color: string;
  descripcion?: string;
  ligaId: number;
  capitanId: number;
}

export interface UpdateEquipoRequest {
  nombre?: string;
  color?: string;
  descripcion?: string;
  capitanId?: number;
  grupoNumero?: number;
}

// Tipos para jugadores en equipo
export interface JugadorEquipo {
  id: number;
  numeroJugador: string;
  posicion: string;
  active: boolean;
  
  // Relación con jugador
  jugador: {
    id: number;
    nombre: string;
    correo: string;
    qrCode?: string;
  };
  
  createdAt?: string;
}

export interface AddJugadorToEquipoRequest {
  jugadorId: number;
  numeroJugador?: string;
  posicion?: string;
}

// Tipos para formularios
export interface EquipoForm {
  nombre: string;
  color: string;
  descripcion: string;
  ligaId: number;
  capitanId: number;
}

// Tipos simplificados
export interface EquipoLite {
  id: number;
  nombre: string;
  color: string;
  grupoNumero: number;
  capitanId: number;
  capitanNombre: string;
}

// Tipo para respuesta de equipos con información del capitán
export interface EquipoConCapitan extends Equipo {
  tieneEquipo: boolean;
  totalJugadores?: number;
}
