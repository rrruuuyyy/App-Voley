import type { ListFiltersPaginate } from "../types";

export const createParamsPaginate = (filters: ListFiltersPaginate) => {
  const params = new URLSearchParams();
  
  // Add pagination params
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  
  // Add search params
  if (filters.search && filters.searchFields && filters.searchFields.length > 0) {
    params.append('fields', filters.searchFields.join(','));
    params.append('filter', filters.search);
  }
  
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.order) params.append('order', filters.order);

  // Add any additional filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && 
        !['page', 'limit', 'search', 'searchFields', 'orderBy', 'order'].includes(key)) {
      params.append(key, value.toString());
    }
  });

  return params;
};
