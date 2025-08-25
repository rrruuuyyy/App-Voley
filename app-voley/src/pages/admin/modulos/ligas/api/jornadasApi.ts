import httpRest from '../../../../../services/httpRest';
import type {
  Jornada,
  JornadaFormData,
  ResultadoPartidoFormData,
  EstadoLiga,
  EquiposDisponiblesResponse,
  TipoJornada,
  StatusJornada
} from '../types/jornadas';

// ====================================================
// GESTIÓN DE JORNADAS
// ====================================================

/**
 * Crear una jornada personalizada
 */
export const crearJornadaPersonalizada = async (data: JornadaFormData): Promise<Jornada> => {
  const response = await httpRest.post('/partido/jornada-personalizada', data);
  return response.data.jornada;
};

/**
 * Obtener jornadas de una liga
 */
export const obtenerJornadasLiga = async (
  ligaId: number,
  filtros?: {
    tipo?: TipoJornada | 'ALL';
    status?: StatusJornada | 'ALL';
    page?: number;
    limit?: number;
  }
): Promise<{
  data: Jornada[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const params = new URLSearchParams();
  
  if (filtros?.tipo && filtros.tipo !== 'ALL') {
    params.append('tipo', filtros.tipo);
  }
  if (filtros?.status && filtros.status !== 'ALL') {
    params.append('status', filtros.status);
  }
  if (filtros?.page) {
    params.append('page', filtros.page.toString());
  }
  if (filtros?.limit) {
    params.append('limit', filtros.limit.toString());
  }

  const response = await httpRest.get(`/partido/jornadas/liga/${ligaId}?${params.toString()}`);
  return response.data;
};

/**
 * Actualizar jornada personalizada
 */
export const actualizarJornadaPersonalizada = async (
  jornadaId: number,
  data: Partial<{
    nombre: string;
    descripcion: string;
    fechaProgramada: string;
    horaProgramada: string;
  }>
): Promise<Jornada> => {
  const response = await httpRest.patch(`/partido/jornada-personalizada/${jornadaId}`, data);
  return response.data.jornada;
};

/**
 * Agregar partido a jornada existente
 */
export const agregarPartidoAJornada = async (
  jornadaId: number,
  data: {
    equipoLocalId: number;
    equipoVisitanteId: number;
    vuelta: number;
    fechaHora: string;
  }
): Promise<any> => {
  const response = await httpRest.post(`/partido/jornada-personalizada/${jornadaId}/partido`, data);
  return response.data;
};

// ====================================================
// GESTIÓN DE PARTIDOS
// ====================================================

/**
 * Registrar resultado de partido
 */
export const registrarResultadoPartido = async (
  partidoId: number,
  data: ResultadoPartidoFormData
): Promise<any> => {
  const response = await httpRest.patch(`/partido/${partidoId}/resultado`, data);
  return response.data.partido;
};

/**
 * Obtener partidos pendientes por equipo
 */
export const obtenerPartidosPendientesEquipo = async (equipoId: number): Promise<{
  equipo: {
    id: number;
    nombre: string;
    capitan: {
      id: number;
      nombre: string;
    };
  };
  partidosPendientes: {
    total: number;
    programados: number;
    enCurso: number;
    partidos: Array<{
      id: number;
      jornada: number;
      vuelta: number;
      fechaHora: string | null;
      status: string;
      rivales: {
        id: number;
        nombre: string;
      };
      esLocal: boolean;
      jornadaPersonalizada: {
        id: number;
        nombre: string;
      } | null;
    }>;
  };
  estatisticas: {
    partidosJugados: number;
    partidosGanados: number;
    partidosPerdidos: number;
    setsAFavor: number;
    setsEnContra: number;
    puntosLiga: number;
  };
}> => {
  const response = await httpRest.get(`/partido/pendientes/equipo/${equipoId}`);
  return response.data;
};

// ====================================================
// ESTADO GENERAL DE LIGA
// ====================================================

/**
 * Obtener estado general de una liga
 */
export const obtenerEstadoGeneralLiga = async (ligaId: number): Promise<EstadoLiga> => {
  try {
    // Intentar endpoint específico primero
    const response = await httpRest.get(`/liga/${ligaId}/estado-general`);
    return response.data;
  } catch (error) {
    console.warn('Endpoint /liga/{ligaId}/estado-general no disponible, construyendo desde datos básicos');
    
    // Obtener datos básicos de la liga y sus equipos
    const [ligaResponse, equiposResponse] = await Promise.all([
      httpRest.get(`/liga/${ligaId}`),
      httpRest.get(`/liga/${ligaId}/equipos`)
    ]);
    
    const liga = ligaResponse.data;
    const equiposData = equiposResponse.data;
    
    return {
      liga: {
        id: liga.id,
        nombre: liga.nombre,
        status: liga.status,
        vueltas: liga.vueltas || 1,
        numeroGrupos: liga.numeroGrupos || 1,
        sistemaPuntos: liga.sistemaPuntos || 'fivb'
      },
      resumen: {
        equiposTotal: equiposData.totalEquipos || equiposData.equipos?.length || 0,
        partidosTotales: 0, // TODO: obtener desde endpoint de partidos
        partidosCompletados: 0, // TODO: obtener desde endpoint de partidos
        partidosPendientes: 0, // TODO: obtener desde endpoint de partidos
        jornadaActual: 1,
        porcentajeCompletado: 0
      },
      equipos: [],
      proximasJornadas: []
    };
  }
};

/**
 * Obtener equipos disponibles para asignar partidos
 */
export const obtenerEquiposDisponibles = async (
  ligaId: number,
  equipoExcluido?: number
): Promise<EquiposDisponiblesResponse> => {
  console.log('🌐 API: Llamando a /liga/' + ligaId + '/equipos');
  
  try {
    // Obtener todos los equipos de la liga
    const response = await httpRest.get(`/liga/${ligaId}/equipos`);
    console.log('🌐 API: Response completo:', response);
    console.log('🌐 API: Status:', response.status);
    console.log('🌐 API: Headers:', response.headers);
    
    const data = response;
    console.log('🌐 API: Data extraída:', data);
    console.log('🌐 API: Tipo de data:', typeof data);
    console.log('🌐 API: Es array?', Array.isArray(data));
    console.log('🌐 API: Keys de data:', Object.keys(data || {}));
    
    // Verificar estructura
    if (!data) {
      console.error('🌐 API: Data es null o undefined');
      throw new Error('No se recibieron datos del servidor');
    }
    
    if (!data.equipos) {
      console.error('🌐 API: No existe la propiedad equipos en data');
      console.error('🌐 API: Estructura recibida:', data);
      throw new Error('Estructura de respuesta inválida: falta propiedad equipos');
    }
    
    console.log('🌐 API: Equipos encontrados:', data.equipos.length);
    
    // Filtrar equipo excluido si se especifica
    if (equipoExcluido && data.equipos) {
      data.equipos = data.equipos.filter((equipo: any) => equipo.id !== equipoExcluido);
      data.totalEquipos = data.equipos.length;
      console.log('🌐 API: Equipos después de filtrar:', data.equipos.length);
    }

    console.log('🌐 API: Retornando data final:', data);
    return data;
  } catch (error) {
    console.error('🌐 API: Error en obtenerEquiposDisponibles:', error);
    throw error;
  }
};

/**
 * Validar conflictos de horarios para equipos
 */
export const validarConflictosHorarios = async (
  ligaId: number,
  partidos: Array<{
    equipoLocalId: number;
    equipoVisitanteId: number;
    fechaHora: string;
  }>
): Promise<{
  valido: boolean;
  conflictos: Array<{
    equipoId: number;
    equipoNombre: string;
    fechaConflicto: string;
    partidoExistente: number;
  }>;
}> => {
  const response = await httpRest.post(`/liga/${ligaId}/validar-conflictos`, { partidos });
  return response.data;
};

// ====================================================
// UTILIDADES
// ====================================================

/**
 * Obtener enfrentamientos restantes entre equipos
 */
export const obtenerEnfrentamientosRestantes = async (
  ligaId: number,
  equipoId?: number
): Promise<{
  liga: {
    id: number;
    nombre: string;
    vueltas: number;
  };
  enfrentamientos: Array<{
    equipoLocal: {
      id: number;
      nombre: string;
    };
    equipoVisitante: {
      id: number;
      nombre: string;
    };
    vueltasPendientes: number[];
    fechasSugeridas: string[];
  }>;
}> => {
  const params = equipoId ? `?equipoId=${equipoId}` : '';
  const response = await httpRest.get(`/liga/${ligaId}/enfrentamientos-restantes${params}`);
  return response.data;
};
