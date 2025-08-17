export interface MetaPaginate {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  page: number;
  pageCount: number;
  itemCount: number;
}

export interface FieldsPaginate {
  key: string;
  searchKey?: string;
  name: string;
  selected?: boolean;
  sortable?: boolean;
}

export interface FiledPaginateQueryAnd {
  key: string;
  keyForm: string;
  name: string;
}

export interface InitialPaginate {
  url: string;
  page: number;
  limit: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ListFiltersPaginate {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface ResponsePaginate<T = any> {
  items: T[];
  meta: MetaPaginate;
}

export interface PaginationFilters {
  [key: string]: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  search: string;
  selectedFields: string[];
  queryAndFilters: PaginationFilters;
  showQueryAndFilters: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Tipos para tabla
export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T = any> {
  key: keyof T | string;
  direction: SortDirection;
}

export interface ExtendedTableColumn<T = any> {
  key: keyof T | string;
  searchKey?: string;
  name?: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
  width?: string | number;
  maxWidth?: string | number;
}
