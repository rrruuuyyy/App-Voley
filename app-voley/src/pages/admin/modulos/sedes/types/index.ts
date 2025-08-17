// Interfaces principales
export interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  numeroCancha: number;
  isActive?: boolean;
  active?: boolean; // Para compatibilidad con la API
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSedeRequest {
  nombre: string;
  direccion: string;
  telefono?: string;
  numeroCancha: number;
}

export interface UpdateSedeRequest {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  numeroCancha?: number;
  active?: boolean;
}

// Tipos para formularios
export interface SedeForm {
  nombre: string;
  direccion: string;
  telefono: string;
  numeroCancha: number;
  active: boolean;
}

export interface UpdateSedeForm {
  nombre: string;
  direccion: string;
  telefono: string;
  numeroCancha: number;
  active: boolean;
}

// Tipos adicionales
export interface SedeLite {
  id: number;
  nombre: string;
  direccion: string;
  numeroCancha: number;
}
