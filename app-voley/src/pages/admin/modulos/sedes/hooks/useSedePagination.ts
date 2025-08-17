import { useGenericPagination } from '../../../../../core/components/pagination';
import { SedeApiService } from '../api/sedeApi';
import type { Sede } from '../types';
import type { InitialPaginate } from '../../../../../core/components/pagination';
import { getSedeTableColumnsConfig } from './useSedeTableColumns';

interface UseSedePaginationProps {
  initialConfig?: Partial<InitialPaginate>;
  queryOptions?: any;
}

export const useSedePagination = (props: UseSedePaginationProps = {}) => {
  return useGenericPagination<Sede>({
    url: '/sede',
    getTableColumnsConfig: getSedeTableColumnsConfig,
    queryFn: SedeApiService.getSedes,
    getQueryKey: (filters) => ['sedes', filters],
    defaultSortBy: 'nombre',
    defaultSelectedField: 'nombre'
  }, props);
};
