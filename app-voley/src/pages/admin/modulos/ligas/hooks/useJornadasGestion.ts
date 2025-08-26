import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  crearJornadaPersonalizada,
  obtenerJornadasLiga,
  obtenerEstadoGeneralLiga,
  obtenerEquiposDisponibles,
  registrarResultadoPartido,
  validarConflictosHorarios,
  obtenerEnfrentamientosRestantes,
  obtenerEstadoVueltas,
  obtenerPartidosLiga,
  obtenerPartidosPorVuelta
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
    descansoEntrePartidos: 30,
    vuelta: 1 // Agregar campo para la vuelta
  });

  // Estado para los slots de partidos
  const [partidosSlots, setPartidosSlots] = useState<PartidoSlot[]>([]);

  // Query para obtener estado de vueltas
  const {
    data: estadoVueltas,
    isLoading: estadoVueltasLoading,
    error: estadoVueltasError
  } = useQuery({
    queryKey: ['estado-vueltas', ligaId],
    queryFn: () => obtenerEstadoVueltas(ligaId),
    enabled: !!ligaId
  });

  // Query para obtener partidos ya jugados (todos)
  const {
    data: partidosJugados,
    isLoading: partidosJugadosLoading
  } = useQuery({
    queryKey: ['partidos-jugados', ligaId],
    queryFn: () => obtenerPartidosLiga(ligaId),
    enabled: !!ligaId
  });

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

  // Obtener vuelta actual del endpoint de estado de vueltas
  const vueltaActual = useMemo(() => {
    if (estadoVueltas?.vueltaActual) {
      return estadoVueltas.vueltaActual;
    }
    
    // Fallback: calcular basándose en enfrentamientos completados si no hay estadoVueltas
    if (!partidosJugados || !equiposResponse?.equipos || !estadoLiga?.liga?.vueltas) return 1;
    
    const equipos = equiposResponse.equipos;
    const totalEquipos = equipos.length;
    const vueltas = estadoLiga.liga.vueltas;
    
    if (totalEquipos < 2) return 1;
    
    const enfrentamientosPorVuelta = (totalEquipos * (totalEquipos - 1)) / 2;
    const enfrentamientosCompletados = new Set<string>();
    
    partidosJugados.forEach((partido: any) => {
      if (partido.status === 'FINALIZADO') {
        const equipoA = Math.min(partido.equipoLocal.id, partido.equipoVisitante.id);
        const equipoB = Math.max(partido.equipoLocal.id, partido.equipoVisitante.id);
        enfrentamientosCompletados.add(`${equipoA}-${equipoB}`);
      }
    });
    
    const vueltasCompletadas = Math.floor(enfrentamientosCompletados.size / enfrentamientosPorVuelta);
    const vueltaCalculada = vueltasCompletadas + 1;
    
    return Math.min(vueltaCalculada, vueltas);
  }, [estadoVueltas, partidosJugados, equiposResponse, estadoLiga]);

  // Query para obtener partidos de la vuelta actual
  const {
    data: partidosVueltaActual,
    isLoading: partidosVueltaLoading
  } = useQuery({
    queryKey: ['partidos-vuelta', ligaId, vueltaActual],
    queryFn: () => obtenerPartidosPorVuelta(ligaId, vueltaActual),
    enabled: !!ligaId && vueltaActual > 0
  });

  // Obtener enfrentamientos ya realizados en la vuelta actual
  // Preferir datos del endpoint específico de vuelta si están disponibles
  const enfrentamientosRealizados = useMemo(() => {
    if (!vueltaActual) return new Set<string>();
    
    const enfrentamientos = new Set<string>();
    
    // Priorizar datos del endpoint específico de vuelta
    if (partidosVueltaActual?.partidos) {
      partidosVueltaActual.partidos.forEach((partido: any) => {
        // Incluir todos los partidos creados (no solo finalizados) para evitar duplicados
        const equipoA = Math.min(partido.equipoLocal.id, partido.equipoVisitante.id);
        const equipoB = Math.max(partido.equipoLocal.id, partido.equipoVisitante.id);
        enfrentamientos.add(`${equipoA}-${equipoB}`);
      });
    } else if (partidosJugados) {
      // Fallback a los datos generales
      partidosJugados.forEach((partido: any) => {
        if (partido.vuelta === vueltaActual) {
          const equipoA = Math.min(partido.equipoLocal.id, partido.equipoVisitante.id);
          const equipoB = Math.max(partido.equipoLocal.id, partido.equipoVisitante.id);
          enfrentamientos.add(`${equipoA}-${equipoB}`);
        }
      });
    }
    
    return enfrentamientos;
  }, [partidosVueltaActual, partidosJugados, vueltaActual]);

  // Información de partidos de la vuelta actual desde el nuevo endpoint
  const partidosVueltaInfo = useMemo(() => {
    if (!partidosVueltaActual) return null;
    
    return {
      vuelta: partidosVueltaActual.vuelta,
      partidos: partidosVueltaActual.partidos || [],
      partidosSinCrear: partidosVueltaActual.vuelta?.partidosSinCrear || 0,
      partidosCreados: partidosVueltaActual.vuelta?.partidosCreados || 0,
      maxPartidos: partidosVueltaActual.vuelta?.partidosTotales || 0
    };
  }, [partidosVueltaActual]);

  // Filtrar equipos disponibles evitando enfrentamientos repetidos
  const equiposDisponiblesFiltered = useMemo(() => {
    const equipos = equiposResponse?.equipos || [];
    return equipos.map(equipo => ({
      ...equipo,
      enfrentamientosDisponibles: equipos.filter(otroEquipo => {
        if (equipo.id === otroEquipo.id) return false;
        
        const equipoA = Math.min(equipo.id, otroEquipo.id);
        const equipoB = Math.max(equipo.id, otroEquipo.id);
        const claveEnfrentamiento = `${equipoA}-${equipoB}`;
        
        return !enfrentamientosRealizados.has(claveEnfrentamiento);
      })
    }));
  }, [equiposResponse, enfrentamientosRealizados]);

  // Actualizar vuelta automáticamente cuando se obtiene el estado
  useMemo(() => {
    if (vueltaActual && jornadaConfig.vuelta !== vueltaActual) {
      updateJornadaConfig({ vuelta: vueltaActual });
    }
  }, [vueltaActual, jornadaConfig.vuelta]);

  const resetJornadaConfig = () => {
    setJornadaConfig({
      fecha: '',
      horaInicio: '18:00',
      numeroPartidos: 2,
      duracionPartido: 90,
      descansoEntrePartidos: 30,
      vuelta: vueltaActual
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
    estadoVueltas,
    vueltaActual,
    enfrentamientosRealizados,
    partidosVueltaInfo, // Nueva información de partidos de la vuelta
    jornadas: jornadas?.data || [],
    equiposDisponibles: equiposDisponiblesFiltered,
    equiposResponse, // Exposer toda la respuesta por si se necesita
    
    // Loading states
    estadoLoading,
    jornadasLoading,
    equiposLoading,
    partidosVueltaLoading, // Loading de partidos de vuelta específica
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
