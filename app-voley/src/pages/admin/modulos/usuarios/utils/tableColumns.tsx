import type { ExtendedTableColumn } from '../../../../../core/components/pagination';
import type { Usuario } from '../types';
import { 
  useDeleteUsuario, 
  useToggleUsuarioStatus 
} from '../hooks/useUsuarioQueries';
import { getUsuarioTableColumnsConfig } from '../hooks/useUsuarioTableColumns';

interface CreateUsuarioTableColumnsProps {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onChangePassword: (id: number) => void;
  toggleStatusMutation: ReturnType<typeof useToggleUsuarioStatus>;
  deleteUsuarioMutation: ReturnType<typeof useDeleteUsuario>;
}

/**
 * Crea las columnas completas para la tabla de usuarios
 * Combina la configuración base con renderers específicos y columna de acciones
 */
export const createUsuarioTableColumns = ({
  onEdit,
  onDelete,
  onChangePassword,
  toggleStatusMutation,
  deleteUsuarioMutation
}: CreateUsuarioTableColumnsProps): ExtendedTableColumn<Usuario>[] => {
  // Obtener configuración base
  const baseColumns = getUsuarioTableColumnsConfig();
  
  // Customizar columnas específicas si es necesario
  const customizedColumns: ExtendedTableColumn<Usuario>[] = baseColumns.map(col => {
    // Aquí se pueden agregar customizaciones específicas por columna
    return col;
  });

  // Agregar columna de acciones
  const actionsColumn: ExtendedTableColumn<Usuario> = {
    key: 'actions',
    name: 'Acciones',
    render: (_, record: Usuario) => {
      const isDeleting = deleteUsuarioMutation.isPending && deleteUsuarioMutation.variables === record.id;
      const isTogglingStatus = toggleStatusMutation.isPending && toggleStatusMutation.variables === record.id;
      
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(record.id)}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isDeleting || isTogglingStatus}
          >
            Editar
          </button>
          
          <button
            onClick={() => onChangePassword(record.id)}
            className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
            disabled={isDeleting || isTogglingStatus}
          >
            Cambiar Contraseña
          </button>
          
          <button
            onClick={() => toggleStatusMutation.mutate(record.id)}
            className={`px-2 py-1 text-sm rounded disabled:opacity-50 ${
              record.active ?? record.isActive
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            disabled={isDeleting || isTogglingStatus}
          >
            {isTogglingStatus ? 'Procesando...' : (record.active ?? record.isActive ? 'Desactivar' : 'Activar')}
          </button>
          
          <button
            onClick={() => onDelete(record.id)}
            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            disabled={isDeleting || isTogglingStatus}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      );
    },
    className: 'text-center',
    width: 300
  };

  return [...customizedColumns, actionsColumn];
};
