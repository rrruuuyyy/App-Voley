import { useGenericPagination } from '../../../../../core/components/pagination';
import { LigaApiService } from '../api/ligaApi';
import type { Liga } from '../types';
import type { InitialPaginate } from '../../../../../core/components/pagination';
import { getLigaTableColumnsConfig } from './useLigaTableColumns';

interface UseLigaPaginationProps {
  initialConfig?: Partial<InitialPaginate>;
  queryOptions?: any;
}

export const useLigaPagination = (props: UseLigaPaginationProps = {}) => {
  return useGenericPagination<Liga>({
    url: '/liga',
    getTableColumnsConfig: getLigaTableColumnsConfig,
    queryFn: LigaApiService.getLigas,
    getQueryKey: (filters) => ['ligas', filters],
    defaultSortBy: 'liga.nombre',
    defaultSelectedField: 'liga.nombre'
  }, props);
};
