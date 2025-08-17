import { z } from "zod";
import { SistemaPuntosEnum, CriteriosDesempateEnum } from "../types";

// Schema para crear liga
export const LigaSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  descripcion: z.string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal('')),
  vueltas: z.number()
    .int("El número de vueltas debe ser un número entero")
    .min(1, "Debe tener al menos 1 vuelta")
    .max(4, "No puede tener más de 4 vueltas"),
  numeroGrupos: z.number()
    .int("El número de grupos debe ser un número entero")
    .min(1, "Debe tener al menos 1 grupo")
    .max(8, "No puede tener más de 8 grupos"),
  sistemaPuntos: z.string()
    .refine((val) => Object.values(SistemaPuntosEnum).includes(val as any), {
      message: "Debe seleccionar un sistema de puntos válido"
    }),
  criteriosDesempate: z.array(z.string())
    .min(1, "Debe seleccionar al menos un criterio de desempate")
    .refine((arr) => arr.every(item => Object.values(CriteriosDesempateEnum).includes(item as any)), {
      message: "Todos los criterios de desempate deben ser válidos"
    }),
  maxPartidosPorDia: z.number()
    .int("Debe ser un número entero")
    .min(1, "Debe tener al menos 1 partido por día")
    .max(10, "No puede tener más de 10 partidos por día"),
  duracionEstimadaPartido: z.number()
    .int("Debe ser un número entero")
    .min(30, "La duración mínima es de 30 minutos")
    .max(300, "La duración máxima es de 300 minutos"),
  descansoMinimo: z.number()
    .int("Debe ser un número entero")
    .min(0, "El descanso mínimo no puede ser negativo")
    .max(120, "El descanso máximo es de 120 minutos"),
  fechaInicio: z.string()
    .min(1, "La fecha de inicio es requerida")
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      return inputDate >= today;
    }, "La fecha de inicio debe ser hoy o posterior"),
  fechaFin: z.string()
    .min(1, "La fecha de fin es requerida"),
  adminLigaId: z.number()
    .int("Debe seleccionar un administrador de liga válido")
    .min(1, "Debe seleccionar un administrador de liga"),
  sedeId: z.number()
    .int("Debe seleccionar una sede válida")
    .min(1, "Debe seleccionar una sede"),
}).refine((data) => {
  const fechaInicio = new Date(data.fechaInicio);
  const fechaFin = new Date(data.fechaFin);
  return fechaFin > fechaInicio;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["fechaFin"],
});

// Schema para actualizar liga (todos los campos opcionales excepto algunos críticos)
export const UpdateLigaSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  descripcion: z.string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal('')),
  vueltas: z.number()
    .int("El número de vueltas debe ser un número entero")
    .min(1, "Debe tener al menos 1 vuelta")
    .max(4, "No puede tener más de 4 vueltas"),
  numeroGrupos: z.number()
    .int("El número de grupos debe ser un número entero")
    .min(1, "Debe tener al menos 1 grupo")
    .max(8, "No puede tener más de 8 grupos"),
  sistemaPuntos: z.string()
    .refine((val) => Object.values(SistemaPuntosEnum).includes(val as any), {
      message: "Debe seleccionar un sistema de puntos válido"
    }),
  criteriosDesempate: z.array(z.string())
    .min(1, "Debe seleccionar al menos un criterio de desempate")
    .refine((arr) => arr.every(item => Object.values(CriteriosDesempateEnum).includes(item as any)), {
      message: "Todos los criterios de desempate deben ser válidos"
    }),
  maxPartidosPorDia: z.number()
    .int("Debe ser un número entero")
    .min(1, "Debe tener al menos 1 partido por día")
    .max(10, "No puede tener más de 10 partidos por día"),
  duracionEstimadaPartido: z.number()
    .int("Debe ser un número entero")
    .min(30, "La duración mínima es de 30 minutos")
    .max(300, "La duración máxima es de 300 minutos"),
  descansoMinimo: z.number()
    .int("Debe ser un número entero")
    .min(0, "El descanso mínimo no puede ser negativo")
    .max(120, "El descanso máximo es de 120 minutos"),
  fechaInicio: z.string()
    .min(1, "La fecha de inicio es requerida"),
  fechaFin: z.string()
    .min(1, "La fecha de fin es requerida"),
  adminLigaId: z.number()
    .int("Debe seleccionar un administrador de liga válido")
    .min(1, "Debe seleccionar un administrador de liga"),
  sedeId: z.number()
    .int("Debe seleccionar una sede válida")
    .min(1, "Debe seleccionar una sede"),
}).refine((data) => {
  const fechaInicio = new Date(data.fechaInicio);
  const fechaFin = new Date(data.fechaFin);
  return fechaFin > fechaInicio;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["fechaFin"],
});

// Schema para asignar capitanes
export const AsignarCapitanesSchema = z.object({
  capitanesIds: z.array(z.number())
    .min(2, "Debe asignar al menos 2 capitanes")
    .max(20, "No puede asignar más de 20 capitanes")
});

// Tipos inferidos de los esquemas
export type LigaFormData = z.infer<typeof LigaSchema>;
export type UpdateLigaFormData = z.infer<typeof UpdateLigaSchema>;
export type AsignarCapitanesFormData = z.infer<typeof AsignarCapitanesSchema>;
