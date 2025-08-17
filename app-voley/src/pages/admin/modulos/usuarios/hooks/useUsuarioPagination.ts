import { useGenericPagination } from '../../../../../core/components/pagination';
import { UsuarioApiService } from '../api/usuarioApi';
import { queryKeys } from '../../../../../core/query/queryClient';
import type { Usuario } from '../types';
import type { InitialPaginate } from '../../../../../core/components/pagination';
import { getUsuarioTableColumnsConfig } from './useUsuarioTableColumns';

interface UseUsuarioPaginationProps {
  initialConfig?: Partial<InitialPaginate>;
  queryOptions?: any;
}

export const useUsuarioPagination = (props: UseUsuarioPaginationProps = {}) => {
  return useGenericPagination<Usuario>({
    url: '/usuario',
    getTableColumnsConfig: getUsuarioTableColumnsConfig,
    queryFn: UsuarioApiService.getUsuarios,
    getQueryKey: (filters) => queryKeys.users(filters),
    defaultSortBy: 'nombre',
    defaultSelectedField: 'nombre'
  }, props);
};
