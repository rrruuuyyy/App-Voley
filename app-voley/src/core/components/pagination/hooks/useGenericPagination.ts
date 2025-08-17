import { useState, useCallback, useMemo } from 'react';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { 
  InitialPaginate, 
  ResponsePaginate, 
  FieldsPaginate, 
  PaginationState,
  PaginationFilters,
  ListFiltersPaginate,
  ExtendedTableColumn
} from '../types';

interface UseGenericPaginationConfig<T> {
  url: string;
  getTableColumnsConfig: () => ExtendedTableColumn<T>[];
  queryFn: (filters: ListFiltersPaginate) => Promise<ResponsePaginate<T>>;
  getQueryKey: (filters: ListFiltersPaginate) => readonly (string | Record<string, any> | undefined)[];
  defaultSortBy?: string;
  defaultSelectedField?: string;
}

interface UseGenericPaginationProps {
  initialConfig?: Partial<InitialPaginate>;
  queryOptions?: Omit<UseQueryOptions<ResponsePaginate<any>, Error>, 'queryKey' | 'queryFn'>;
}

export const useGenericPagination = <T>(
  config: UseGenericPaginationConfig<T>,
  {
    initialConfig = {},
    queryOptions = {}
  }: UseGenericPaginationProps = {}
) => {
  const {
    url,
    getTableColumnsConfig,
    queryFn,
    getQueryKey,
    defaultSortBy = 'id',
    defaultSelectedField = 'nombre'
  } = config;
  
  const defaultConfig: InitialPaginate = {
    url,
    page: 1,
    limit: 10,
    sortBy: defaultSortBy,
    order: 'asc',
    ...initialConfig
  };

  const baseTableColumns = getTableColumnsConfig();

  const searchFields: FieldsPaginate[] = baseTableColumns
    .filter(col => col.searchKey || col.key)
    .map(col => ({
      key: col.key as string,
      searchKey: col.searchKey || (col.key as string),
      name: col.name || (col.key as string),
      selected: col.searchKey === defaultSelectedField || col.key === defaultSelectedField,
      sortable: col.sortable || false
    }));

  const [state, setState] = useState<PaginationState>({
    page: defaultConfig.page,
    limit: defaultConfig.limit,
    search: '',
    selectedFields: searchFields.filter(f => f.selected).map(f => f.searchKey || f.key),
    queryAndFilters: {},
    showQueryAndFilters: false,
    sortBy: defaultConfig.sortBy,
    order: defaultConfig.order
  });

  const queryFilters = useMemo(() => {
    const filters: ListFiltersPaginate = {
      page: state.page,
      limit: state.limit,
    };

    if (state.search && state.selectedFields.length > 0) {
      filters.search = state.search;
      filters.searchFields = state.selectedFields;
    }

    if (state.sortBy && state.order) {
      filters.orderBy = state.sortBy;
      filters.order = state.order;
    }

    Object.entries(state.queryAndFilters).forEach(([key, value]) => {
      if (value) {
        (filters as any)[key] = value;
      }
    });

    return filters;
  }, [state]);

  const queryResult = useQuery({
    queryKey: getQueryKey(queryFilters),
    queryFn: () => queryFn(queryFilters),
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });

  const data = queryResult.data?.items || [];
  const meta = queryResult.data?.meta;

  const updateSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const updateSelectedFields = useCallback((fields: string[]) => {
    setState(prev => ({ ...prev, selectedFields: fields, page: 1 }));
  }, []);

  const updateQueryAndFilters = useCallback((filters: PaginationFilters) => {
    setState(prev => ({ ...prev, queryAndFilters: filters, page: 1 }));
  }, []);

  const toggleShowQueryAndFilters = useCallback(() => {
    setState(prev => ({ ...prev, showQueryAndFilters: !prev.showQueryAndFilters }));
  }, []);

  const goToNextPage = useCallback(() => {
    if (meta?.hasNextPage) {
      setState(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [meta]);

  const goToPreviousPage = useCallback(() => {
    if (meta?.hasPreviousPage) {
      setState(prev => ({ ...prev, page: prev.page - 1 }));
    }
  }, [meta]);

  const setLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const updateSort = useCallback((sortBy: string, order: 'asc' | 'desc') => {
    setState(prev => ({ ...prev, sortBy, order, page: 1 }));
  }, []);

  const clearSort = useCallback(() => {
    setState(prev => ({ ...prev, sortBy: undefined, order: undefined, page: 1 }));
  }, []);

  const reload = useCallback(() => {
    queryResult.refetch();
  }, [queryResult]);

  const search = useCallback(() => {
    queryResult.refetch();
  }, [queryResult]);

  return {
    state,
    meta,
    data,
    hasData: data.length > 0,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    error: queryResult.error,
    isError: queryResult.isError,
    searchFields,
    updateSearch,
    updateSelectedFields,
    updateQueryAndFilters,
    toggleShowQueryAndFilters,
    goToNextPage,
    goToPreviousPage,
    setLimit,
    updateSort,
    clearSort,
    reload,
    search,
    refetch: queryResult.refetch,
    queryResult,
  };
};
