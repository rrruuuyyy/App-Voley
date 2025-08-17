import type { ExtendedTableColumn } from '../../../../../core/components/pagination';
import type { Liga, LigaStatus } from '../types';
import { 
  useDeleteLiga, 
  useIniciarLiga,
  useFinalizarLiga
} from '../hooks/useLigaQueries';
import { getLigaTableColumnsConfig } from '../hooks/useLigaTableColumns';

interface CreateLigaTableColumnsProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
  onManageCapitanes: (id: number) => void;
  iniciarLigaMutation: ReturnType<typeof useIniciarLiga>;
  finalizarLigaMutation: ReturnType<typeof useFinalizarLiga>;
  deleteLigaMutation: ReturnType<typeof useDeleteLiga>;
}

/**
 * Función para obtener el color del badge según el estado
 */
const getStatusBadgeColor = (status: LigaStatus) => {
  switch (status) {
    case 'programada':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'en_curso':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'finalizada':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'cancelada':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Función para obtener el texto del estado
 */
const getStatusText = (status: LigaStatus) => {
  switch (status) {
    case 'programada':
      return 'Programada';
    case 'en_curso':
      return 'En Curso';
    case 'finalizada':
      return 'Finalizada';
    case 'cancelada':
      return 'Cancelada';
    default:
      return status;
  }
};

/**
 * Función para formatear fecha
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Crea las columnas completas para la tabla de ligas
 * Combina la configuración base con renderers específicos y columna de acciones
 */
export const createLigaTableColumns = ({
  onEdit,
  onDelete,
  onViewDetails,
  onManageCapitanes,
  iniciarLigaMutation,
  finalizarLigaMutation,
  deleteLigaMutation
}: CreateLigaTableColumnsProps): ExtendedTableColumn<Liga>[] => {
  // Obtener configuración base
  const baseColumns = getLigaTableColumnsConfig();
  
  // Customizar columnas específicas
  const customizedColumns: ExtendedTableColumn<Liga>[] = baseColumns.map(col => {
    switch (col.key) {
      case 'descripcion':
        return {
          ...col,
          render: (value: string) => {
            if (!value) {
              return <span className="text-gray-400 italic">Sin descripción</span>;
            }
            return (
              <div className="max-w-xs truncate" title={value}>
                {value}
              </div>
            );
          }
        };
      
      case 'status':
        return {
          ...col,
          render: (value: LigaStatus, record: Liga) => {
            const isChangingStatus = 
              (iniciarLigaMutation.isPending && iniciarLigaMutation.variables === record.id) ||
              (finalizarLigaMutation.isPending && finalizarLigaMutation.variables === record.id);
            
            return (
              <div className="flex items-center justify-center">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium border
                  ${getStatusBadgeColor(value)}
                  ${isChangingStatus ? 'opacity-50' : ''}
                `}>
                  {isChangingStatus ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                      Cambiando...
                    </span>
                  ) : (
                    getStatusText(value)
                  )}
                </span>
              </div>
            );
          }
        };
      
      case 'fechaInicio':
        return {
          ...col,
          render: (value: string) => (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {formatDate(value)}
            </div>
          )
        };
      
      case 'fechaFin':
        return {
          ...col,
          render: (value: string) => (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {formatDate(value)}
            </div>
          )
        };
      
      case 'sede':
        return {
          ...col,
          render: (_, record: Liga) => (
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {record.sede?.nombre || 'Sin sede'}
              </div>
              {record.sede?.direccion && (
                <div className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-xs">
                  {record.sede.direccion}
                </div>
              )}
            </div>
          )
        };
      
      default:
        return col;
    }
  });

  // Agregar columna de acciones
  const actionsColumn: ExtendedTableColumn<Liga> = {
    key: 'actions',
    name: 'Acciones',
    render: (_, record: Liga) => {
      const isDeleting = deleteLigaMutation.isPending && deleteLigaMutation.variables === record.id;
      const isChangingStatus = 
        (iniciarLigaMutation.isPending && iniciarLigaMutation.variables === record.id) ||
        (finalizarLigaMutation.isPending && finalizarLigaMutation.variables === record.id);
      
      const canEdit = record.status === 'programada';
      const canStart = record.status === 'programada';
      const canFinish = record.status === 'en_curso';
      const canDelete = record.status === 'programada';
      
      return (
        <div className="flex items-center gap-1">
          {/* Ver detalles */}
          <button
            onClick={() => onViewDetails(record.id)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="Ver detalles"
            disabled={isDeleting || isChangingStatus}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          {/* Gestionar capitanes */}
          {record.status === 'programada' && (
            <button
              onClick={() => onManageCapitanes(record.id)}
              className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded transition-colors"
              title="Gestionar capitanes"
              disabled={isDeleting || isChangingStatus}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          )}
          
          {/* Iniciar liga */}
          {canStart && (
            <button
              onClick={() => iniciarLigaMutation.mutate(record.id)}
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
              title="Iniciar liga"
              disabled={isDeleting || isChangingStatus}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
          
          {/* Finalizar liga */}
          {canFinish && (
            <button
              onClick={() => finalizarLigaMutation.mutate(record.id)}
              className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded transition-colors"
              title="Finalizar liga"
              disabled={isDeleting || isChangingStatus}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
          
          {/* Editar */}
          {canEdit && (
            <button
              onClick={() => onEdit(record.id)}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              title="Editar liga"
              disabled={isDeleting || isChangingStatus}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          
          {/* Eliminar */}
          {canDelete && (
            <button
              onClick={() => onDelete(record.id)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
              title="Eliminar liga"
              disabled={isDeleting || isChangingStatus}
            >
              {isDeleting ? (
                <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      );
    },
    width: '140px',
    className: 'text-center'
  };

  // Reemplazar la columna de acciones en la configuración base
  return customizedColumns.map(col => 
    col.key === 'actions' ? actionsColumn : col
  );
};
