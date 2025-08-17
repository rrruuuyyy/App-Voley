import { z } from "zod";

// Schema para crear sede
export const SedeSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  direccion: z.string()
    .min(1, "La dirección es requerida")
    .max(255, "La dirección no puede tener más de 255 caracteres"),
  telefono: z.string()
    .max(20, "El teléfono no puede tener más de 20 caracteres")
    .optional()
    .or(z.literal('')),
  numeroCancha: z.number()
    .int("El número de canchas debe ser un número entero")
    .min(1, "Debe tener al menos 1 cancha")
    .max(50, "No puede tener más de 50 canchas"),
  active: z.boolean(),
});

// Schema para actualizar sede (todos los campos opcionales excepto active)
export const UpdateSedeSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  direccion: z.string()
    .min(1, "La dirección es requerida")
    .max(255, "La dirección no puede tener más de 255 caracteres"),
  telefono: z.string()
    .max(20, "El teléfono no puede tener más de 20 caracteres")
    .optional()
    .or(z.literal('')),
  numeroCancha: z.number()
    .int("El número de canchas debe ser un número entero")
    .min(1, "Debe tener al menos 1 cancha")
    .max(50, "No puede tener más de 50 canchas"),
  active: z.boolean(),
});

// Tipos inferidos de los esquemas
export type SedeFormData = z.infer<typeof SedeSchema>;
export type UpdateSedeFormData = z.infer<typeof UpdateSedeSchema>;
