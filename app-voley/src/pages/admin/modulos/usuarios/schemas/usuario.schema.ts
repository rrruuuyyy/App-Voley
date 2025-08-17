import { z } from "zod";
import { UserRolesEnum } from "../types";

// Schema para crear usuario
export const UsuarioSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  correo: z.string()
    .min(1, "El correo es requerido")
    .email("Debe ser un correo válido")
    .max(150, "El correo no puede tener más de 150 caracteres"),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
  rol: z.string()
    .refine((val) => Object.values(UserRolesEnum).includes(val as any), {
      message: "Debe seleccionar un rol válido"
    }),
  sucursalId: z.number().optional(),
  active: z.boolean(),
});

// Schema para actualizar usuario (password opcional)
export const UpdateUsuarioSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  correo: z.string()
    .min(1, "El correo es requerido")
    .email("Debe ser un correo válido")
    .max(150, "El correo no puede tener más de 150 caracteres"),
  password: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres")
    .optional(),
  rol: z.string()
    .refine((val) => Object.values(UserRolesEnum).includes(val as any), {
      message: "Debe seleccionar un rol válido"
    }),
  sucursalId: z.number().optional(),
  active: z.boolean(),
});

// Esquema para cambio de contraseña
export const ChangePasswordSchema = z.object({
  newPassword: z.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Tipos inferidos de los esquemas
export type UsuarioFormData = z.infer<typeof UsuarioSchema>;
export type UpdateUsuarioFormData = z.infer<typeof UpdateUsuarioSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
