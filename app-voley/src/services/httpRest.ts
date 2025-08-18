import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores con sonner
    if (error.response?.status === 400 && error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.response?.status === 401) {
      toast.error('Token expirado. Redirigiendo al login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción');
    } else if (error.response?.status === 404) {
      toast.error('Recurso no encontrado');
    } else if (error.response?.status >= 500) {
      toast.error('Error interno del servidor');
    } else {
      toast.error('Ha ocurrido un error inesperado');
    }
    return Promise.reject(error);
  }
);

export interface HttpRequestConfig extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  headers?: Record<string, string>;
}

class HttpRestService {
  /**
   * Realiza una petición GET
   */
  async get<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   */
  async post<T = any>(url: string, body?: any, config?: HttpRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.post(url, body, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza una petición PATCH
   */
  async patch<T = any>(url: string, body?: any, config?: HttpRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.patch(url, body, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put<T = any>(url: string, body?: any, config?: HttpRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.put(url, body, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const httpRest = new HttpRestService();
export default httpRest;