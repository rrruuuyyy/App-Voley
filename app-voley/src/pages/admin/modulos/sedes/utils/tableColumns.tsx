import type { ExtendedTableColumn } from '../../../../../core/components/pagination';
import type { Sede } from '../types';
import { 
  useDeleteSede, 
  useToggleSedeStatus 
} from '../hooks/useSedeQueries';
import { getSedeTableColumnsConfig } from '../hooks/useSedeTableColumns';

interface CreateSedeTableColumnsProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
  toggleStatusMutation: ReturnType<typeof useToggleSedeStatus>;
  deleteUsuarioMutation: ReturnType<typeof useDeleteSede>;
}

/**
 * Crea las columnas completas para la tabla de sedes
 * Combina la configuración base con renderers específicos y columna de acciones
 */
export const createSedeTableColumns = ({
  onEdit,
  onDelete,
  onViewDetails,
  toggleStatusMutation,
  deleteUsuarioMutation
}: CreateSedeTableColumnsProps): ExtendedTableColumn<Sede>[] => {
  // Obtener configuración base
  const baseColumns = getSedeTableColumnsConfig();
  
  // Customizar columnas específicas
  const customizedColumns: ExtendedTableColumn<Sede>[] = baseColumns.map(col => {
    switch (col.key) {
      case 'numeroCancha':
        return {
          ...col,
          render: (value: number) => (
            <div className="text-center">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {value} {value === 1 ? 'cancha' : 'canchas'}
              </span>
            </div>
          )
        };
      
      case 'isActive':
        return {
          ...col,
          render: (value: boolean, record: Sede) => {
            const isTogglingStatus = toggleStatusMutation.isPending && toggleStatusMutation.variables === record.id;
            
            return (
              <div className="flex items-center justify-center">
                <button
                  onClick={() => toggleStatusMutation.mutate(record.id)}
                  disabled={isTogglingStatus}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    value || record.active
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  } ${isTogglingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isTogglingStatus ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                      Cambiando...
                    </span>
                  ) : (
                    value || record.active ? 'Activa' : 'Inactiva'
                  )}
                </button>
              </div>
            );
          }
        };
      
      case 'telefono':
        return {
          ...col,
          render: (value: string) => value || (
            <span className="text-gray-400 italic">Sin teléfono</span>
          )
        };
      
      default:
        return col;
    }
  });

  // Agregar columna de acciones
  const actionsColumn: ExtendedTableColumn<Sede> = {
    key: 'actions',
    name: 'Acciones',
    render: (_, record: Sede) => {
      const isDeleting = deleteUsuarioMutation.isPending && deleteUsuarioMutation.variables === record.id;
      const isTogglingStatus = toggleStatusMutation.isPending && toggleStatusMutation.variables === record.id;
      
      return (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(record.id)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            title="Ver detalles"
            disabled={isDeleting || isTogglingStatus}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          <button
            onClick={() => onEdit(record.id)}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Editar sede"
            disabled={isDeleting || isTogglingStatus}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(record.id)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
            title="Eliminar sede"
            disabled={isDeleting || isTogglingStatus}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      );
    },
    width: '120px',
    className: 'text-center'
  };

  // Reemplazar la columna de acciones en la configuración base
  return customizedColumns.map(col => 
    col.key === 'actions' ? actionsColumn : col
  );
};
