import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  crearJornadaPersonalizada,
  obtenerJornadasLiga,
  obtenerEstadoGeneralLiga,
  obtenerEquiposDisponibles,
  registrarResultadoPartido,
  validarConflictosHorarios,
  obtenerEnfrentamientosRestantes
} from '../api/jornadasApi';
import type {
  ResultadoPartidoFormData,
  TipoJornada,
  StatusJornada,
  JornadaConfig,
  PartidoSlot,
} from '../types/jornadas';

// ====================================================
// HOOK PRINCIPAL PARA GESTIÓN DE JORNADAS
// ====================================================

export const useJornadasGestion = (ligaId: number) => {
  const queryClient = useQueryClient();
  
  // Estado para la configuración de jornada
  const [jornadaConfig, setJornadaConfig] = useState<JornadaConfig>({
    fecha: '',
    horaInicio: '18:00',
    numeroPartidos: 2,
    duracionPartido: 90,
    descansoEntrePartidos: 30
  });

  // Estado para los slots de partidos
  const [partidosSlots, setPartidosSlots] = useState<PartidoSlot[]>([]);

  // Query para obtener estado general de la liga
  const {
    data: estadoLiga,
    isLoading: estadoLoading,
    error: estadoError
  } = useQuery({
    queryKey: ['liga-estado', ligaId],
    queryFn: () => obtenerEstadoGeneralLiga(ligaId),
    enabled: !!ligaId
  });

  // Query para obtener jornadas existentes
  const {
    data: jornadas,
    isLoading: jornadasLoading,
    refetch: refetchJornadas
  } = useQuery({
    queryKey: ['jornadas', ligaId],
    queryFn: () => obtenerJornadasLiga(ligaId, { tipo: 'ALL' }),
    enabled: !!ligaId
  });

  // Query para obtener equipos disponibles
  const {
    data: equiposResponse,
    isLoading: equiposLoading,
    refetch: refetchEquipos
  } = useQuery({
    queryKey: ['equipos-disponibles', ligaId],
    queryFn: async () => {
      try {
        const result = await obtenerEquiposDisponibles(ligaId);
        return result;
      } catch (error) {
        console.error('🔍 Query: Error al obtener equipos:', error);
        throw error;
      }
    },
    enabled: !!ligaId,
    retry: 3,
    retryDelay: 1000
  });

  // Mutation para crear jornada
  const crearJornadaMutation = useMutation({
    mutationFn: crearJornadaPersonalizada,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jornadas', ligaId] });
      queryClient.invalidateQueries({ queryKey: ['liga-estado', ligaId] });
      resetJornadaConfig();
    }
  });

  // Mutation para validar conflictos
  const validarConflictosMutation = useMutation({
    mutationFn: (partidos: any[]) => validarConflictosHorarios(ligaId, partidos),
  });

  // Funciones para manejar la configuración
  const updateJornadaConfig = (config: Partial<JornadaConfig>) => {
    setJornadaConfig(prev => ({ ...prev, ...config }));
  };

  const resetJornadaConfig = () => {
    setJornadaConfig({
      fecha: '',
      horaInicio: '18:00',
      numeroPartidos: 2,
      duracionPartido: 90,
      descansoEntrePartidos: 30
    });
    setPartidosSlots([]);
  };

  // Generar slots de partidos basados en la configuración
  const generarSlotsPartidos = () => {
    const slots: PartidoSlot[] = [];
    const horaInicio = new Date(`2000-01-01T${jornadaConfig.horaInicio}:00`);
    
    for (let i = 0; i < jornadaConfig.numeroPartidos; i++) {
      const horaPartido = new Date(horaInicio);
      horaPartido.setMinutes(
        horaPartido.getMinutes() + 
        i * (jornadaConfig.duracionPartido + jornadaConfig.descansoEntrePartidos)
      );
      
      slots.push({
        id: `slot-${i}`,
        horario: horaPartido.toTimeString().slice(0, 5),
        partido: undefined,
        equipoLocal: null,
        equipoVisitante: null
      });
    }
    
    setPartidosSlots(slots);
  };

  return {
    // Estado
    jornadaConfig,
    partidosSlots,
    estadoLiga,
    jornadas: jornadas?.data || [],
    equiposDisponibles: (() => {
      // Extraer equipos del objeto de respuesta
      const equipos = equiposResponse?.equipos || [];
      return equipos;
    })(),
    equiposResponse, // Exposer toda la respuesta por si se necesita
    
    // Loading states
    estadoLoading,
    jornadasLoading,
    equiposLoading,
    isCreatingJornada: crearJornadaMutation.isPending,
    isValidatingConflicts: validarConflictosMutation.isPending,
    
    // Errors
    estadoError,
    createError: crearJornadaMutation.error,
    validationError: validarConflictosMutation.error,
    
    // Funciones
    updateJornadaConfig,
    resetJornadaConfig,
    generarSlotsPartidos,
    setPartidosSlots,
    crearJornada: crearJornadaMutation.mutate,
    validarConflictos: validarConflictosMutation.mutate,
    refetchJornadas,
    refetchEquipos,
    
    // Resultados de validación
    conflictosValidation: validarConflictosMutation.data
  };
};

// ====================================================
// HOOK PARA GESTIÓN DE RESULTADOS
// ====================================================

export const useResultadosPartidos = () => {
  const queryClient = useQueryClient();

  const registrarResultadoMutation = useMutation({
    mutationFn: ({ partidoId, data }: { partidoId: number; data: ResultadoPartidoFormData }) =>
      registrarResultadoPartido(partidoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jornadas'] });
      queryClient.invalidateQueries({ queryKey: ['liga-estado'] });
    }
  });

  return {
    registrarResultado: registrarResultadoMutation.mutate,
    isRegistering: registrarResultadoMutation.isPending,
    error: registrarResultadoMutation.error
  };
};

// ====================================================
// HOOK PARA FILTROS DE JORNADAS
// ====================================================

export const useJornadasFilters = (ligaId: number) => {
  const [filters, setFilters] = useState<{
    tipo: TipoJornada | 'ALL';
    status: StatusJornada | 'ALL';
    page: number;
    limit: number;
  }>({
    tipo: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 10
  });

  const {
    data: jornadasPaginadas,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['jornadas-filtradas', ligaId, filters],
    queryFn: () => obtenerJornadasLiga(ligaId, filters),
    enabled: !!ligaId
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return {
    filters,
    jornadas: jornadasPaginadas?.data || [],
    meta: jornadasPaginadas?.meta,
    isLoading,
    updateFilters,
    changePage,
    refetch
  };
};

// ====================================================
// HOOK PARA ENFRENTAMIENTOS RESTANTES
// ====================================================

export const useEnfrentamientosRestantes = (ligaId: number, equipoId?: number) => {
  const {
    data: enfrentamientos,
    isLoading,
    error
  } = useQuery({
    queryKey: ['enfrentamientos-restantes', ligaId, equipoId],
    queryFn: () => obtenerEnfrentamientosRestantes(ligaId, equipoId),
    enabled: !!ligaId
  });

  return {
    enfrentamientos: enfrentamientos?.enfrentamientos || [],
    ligaInfo: enfrentamientos?.liga,
    isLoading,
    error
  };
};

// ====================================================
// UTILIDADES
// ====================================================

/**
 * Hook para validar si un equipo puede jugar contra otro
 */
export const useValidacionEquipos = () => {
  const validarEnfrentamiento = (
    equipoLocal: any,
    equipoVisitante: any,
    vueltas: number
  ): { esValido: boolean; razon?: string } => {
    if (!equipoLocal || !equipoVisitante) {
      return { esValido: false, razon: 'Debe seleccionar ambos equipos' };
    }

    if (equipoLocal.id === equipoVisitante.id) {
      return { esValido: false, razon: 'Un equipo no puede jugar contra sí mismo' };
    }

    // Verificar si ya jugaron todas las vueltas
    const yaJugoContra = equipoLocal.yaJugoContra || [];
    const vecesJugadas = yaJugoContra.filter((id: number) => id === equipoVisitante.id).length;
    
    if (vecesJugadas >= vueltas) {
      return { 
        esValido: false, 
        razon: `Ya jugaron todas las vueltas programadas (${vueltas})` 
      };
    }

    return { esValido: true };
  };

  return { validarEnfrentamiento };
};
