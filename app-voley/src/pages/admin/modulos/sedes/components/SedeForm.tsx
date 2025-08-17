import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SedeSchema, type SedeFormData } from '../schemas/sede.schema';
import type { Sede } from '../types';

interface SedeFormProps {
  initialData?: Sede | null;
  onSubmit: (data: SedeFormData) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export const SedeForm: React.FC<SedeFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  onCancel
}) => {
  const isEditing = !!initialData;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SedeFormData>({
    resolver: zodResolver(SedeSchema),
    defaultValues: initialData ? {
      nombre: initialData.nombre,
      direccion: initialData.direccion,
      telefono: initialData.telefono || '',
      numeroCancha: initialData.numeroCancha,
      active: initialData.active ?? initialData.isActive ?? true,
    } : {
      nombre: '',
      direccion: '',
      telefono: '',
      numeroCancha: 1,
      active: true,
    }
  });

  const handleFormSubmit = (data: SedeFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre de la Sede *
        </label>
        <input
          id="nombre"
          type="text"
          {...register('nombre')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Ej: Polideportivo Central"
          disabled={loading}
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección *
        </label>
        <textarea
          id="direccion"
          {...register('direccion')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          placeholder="Ej: Av. Principal 123, Centro, Ciudad"
          disabled={loading}
        />
        {errors.direccion && (
          <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Teléfono
        </label>
        <input
          id="telefono"
          type="tel"
          {...register('telefono')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Ej: +591 555-0123"
          disabled={loading}
        />
        {errors.telefono && (
          <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
        )}
      </div>

      {/* Número de Canchas */}
      <div>
        <label htmlFor="numeroCancha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Número de Canchas *
        </label>
        <input
          id="numeroCancha"
          type="number"
          min="1"
          max="50"
          {...register('numeroCancha', { 
            valueAsNumber: true,
            min: 1,
            max: 50
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="1"
          disabled={loading}
        />
        {errors.numeroCancha && (
          <p className="text-red-500 text-sm mt-1">{errors.numeroCancha.message}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Cantidad de canchas disponibles en la sede (1-50)
        </p>
      </div>

      {/* Estado Activo */}
      <div className="flex items-center">
        <input
          id="active"
          type="checkbox"
          {...register('active')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          disabled={loading}
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Sede activa
        </label>
      </div>
      {errors.active && (
        <p className="text-red-500 text-sm mt-1">{errors.active.message}</p>
      )}

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </span>
          ) : (
            isEditing ? 'Actualizar Sede' : 'Crear Sede'
          )}
        </button>
      </div>
    </form>
  );
};
