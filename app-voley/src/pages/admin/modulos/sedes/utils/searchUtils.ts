import { SedeApiService } from '../api/sedeApi';
import type { SedeLite } from '../types';

/**
 * Función de búsqueda para FormWrapperSelectHttp
 * Convierte los parámetros a la estructura que espera la API
 */
export const searchSedesForSelect = async (searchTerm: string): Promise<{ items: SedeLite[]; meta?: any }> => {
  const result = await SedeApiService.searchSedesWithParams({
    page: 1,
    limit: 10,
    fields: 'nombre',
    filter: searchTerm,
    orderBy: 'nombre',
    order: 'asc'
  });

  return {
    items: result.items || [],
    meta: result.meta
  };
};

/**
 * Función para obtener una sede por ID para inicialización
 * Compatible con FormWrapperSelectHttp
 */
export const getSedeByIdForSelect = async (id: number): Promise<SedeLite | null> => {
  try {
    const sede = await SedeApiService.getSedeById(id);
    // Convertir a SedeLite
    return {
      id: sede.id,
      nombre: sede.nombre,
      direccion: sede.direccion,
      numeroCancha: sede.numeroCancha
    };
  } catch (error) {
    console.error('Error al obtener sede por ID:', error);
    return null;
  }
};
