// Roles de usuario
export const UserRolesEnum = {
  ADMINISTRADOR: 'administrador',
  ADMIN_LIGA: 'admin_liga',
  CAPITAN: 'capitan',
  JUGADOR: 'jugador'
} as const;

export type UserRole = typeof UserRolesEnum[keyof typeof UserRolesEnum];

// Interfaces principales
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  qrCode?: string;
  isActive?: boolean;
  active?: boolean; // Para compatibilidad con la API
  sucursalId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  correo: string;
  password: string;
  rol: UserRole;
  sucursalId?: number;
}

export interface UpdateUsuarioRequest {
  nombre?: string;
  correo?: string;
  password?: string;
  rol?: UserRole;
  sucursalId?: number;
  active?: boolean;
}

// Tipos para formularios
export interface UsuarioForm {
  nombre: string;
  correo: string;
  password: string;
  rol: UserRole;
  sucursalId?: number;
  active: boolean;
}

export interface UpdateUsuarioForm {
  nombre: string;
  correo: string;
  password?: string;
  rol: UserRole;
  sucursalId?: number;
  active: boolean;
}

// Tipos adicionales
export interface UsuarioLite {
  id: number;
  nombre: string;
  correo: string;
  rol: UserRole;
}
