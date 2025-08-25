import { useQuery } from '@tanstack/react-query';
import httpRest from '../../../../../../../services/httpRest';

interface Partido {
  id: number;
  jornada: number;
  vuelta: number;
  fechaHora: string;
  equipoLocal: {
    id: number;
    nombre: string;
  };
  equipoVisitante: {
    id: number;
    nombre: string;
  };
  status: 'programado' | 'en_curso' | 'finalizado';
}

interface ProximosPartidosResponse {
  partidos: Partido[];
  total: number;
  proximaJornada: number | null;
}

interface EstadoVueltasResponse {
  liga: {
    id: number;
    nombre: string;
    vueltas: number;
  };
  vueltaActual: number;
  vueltas: Array<{
    numero: number;
    totalPartidos: number;
    completados: number;
    pendientes: number;
    porcentajeCompletado: number;
    estado: 'completada' | 'en_curso' | 'sin_iniciar';
    puedeCrearJornada: boolean;
  }>;
  resumen: {
    totalVueltas: number;
    vueltasCompletadas: number;
    vueltasEnCurso: number;
    vueltasSinIniciar: number;
  };
}

// Hook para obtener próximos partidos
export const useProximosPartidos = (ligaId: number) => {
  return useQuery({
    queryKey: ['proximosPartidos', ligaId],
    queryFn: async (): Promise<ProximosPartidosResponse> => {
      return await httpRest.get(`/partido/liga/${ligaId}`, {
        params: { status: 'programado', limit: 10 }
      });
    },
    enabled: !!ligaId,
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

// Hook para obtener estado de vueltas
export const useEstadoVueltas = (ligaId: number) => {
  return useQuery({
    queryKey: ['estadoVueltas', ligaId],
    queryFn: async (): Promise<EstadoVueltasResponse> => {
      return await httpRest.get(`/partido/estado-vueltas/liga/${ligaId}`);
    },
    enabled: !!ligaId,
    refetchInterval: 60000, // Refrescar cada minuto
  });
};

// Hook para obtener todos los partidos de una liga
export const usePartidosLiga = (ligaId: number, jornada?: number) => {
  return useQuery({
    queryKey: ['partidosLiga', ligaId, jornada],
    queryFn: async () => {
      const params = jornada ? { jornada } : {};
      return await httpRest.get(`/partido/liga/${ligaId}`, { params });
    },
    enabled: !!ligaId,
  });
};

// Hook para obtener jornadas de una liga
export const useJornadasLiga = (ligaId: number) => {
  return useQuery({
    queryKey: ['jornadasLiga', ligaId],
    queryFn: async () => {
      return await httpRest.get(`/partido/jornadas/liga/${ligaId}`);
    },
    enabled: !!ligaId,
  });
};
