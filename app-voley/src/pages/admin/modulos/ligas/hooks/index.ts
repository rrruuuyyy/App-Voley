// Main hooks exports
export * from './useLigaQueries';

// Specific hook exports for convenience
export {
  useLigas,
  useLiga,
  useLigasLite,
  useSearchLigas,
  useLigaStats,
  useLigaEstadisticas,
  useCapitanesLiga,
  useCreateLiga,
  useUpdateLiga,
  useDeleteLiga,
  useIniciarLiga,
  useFinalizarLiga,
  useAsignarCapitanes,
  useEliminarCapitan,
  useCheckLigaNameAvailability,
  // Hooks para gestión de grupos
  useEstadoGrupos,
  useValidacionGrupos,
  useAsignarGruposAutomatico,
  useAsignarGruposMasivo
} from './useLigaQueries';
