// Exportar páginas principales
export { default as LigasLista } from './pages/LigasLista';
export { default as LigaDetalle } from './pages/LigaDetalle';

// Exportar componentes
export { LigaForm } from './components/LigaForm';

// Exportar hooks
export { useLigaPagination } from './hooks/useLigaPagination';
export { 
  useCreateLiga, 
  useUpdateLiga, 
  useDeleteLiga,
  useIniciarLiga,
  useFinalizarLiga
} from './hooks/useLigaQueries';
export { useLigaTableColumns } from './hooks/useLigaTableColumns';

// Exportar tipos
export type { 
  Liga, 
  CreateLigaRequest, 
  UpdateLigaRequest,
  LigaStatus,
  SistemaPuntos,
  CriterioDesempate,
  LigaStatusEnum,
  SistemaPuntosEnum,
  CriteriosDesempateEnum
} from './types';

// Exportar schemas
export { LigaSchema } from './schemas/liga.schema';
export type { LigaFormData } from './schemas/liga.schema';

// Exportar API
export { LigaApiService, ligaApi } from './api/ligaApi';

// Exportar utilidades
export { createLigaTableColumns } from './utils/tableColumns';
