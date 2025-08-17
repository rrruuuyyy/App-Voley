import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsuarioSchema, type UsuarioFormData } from '../schemas/usuario.schema';
import { UserRolesEnum, type Usuario } from '../types';

interface UserFormProps {
  initialData?: Usuario | null;
  onSubmit: (data: UsuarioFormData) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
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
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(UsuarioSchema),
    defaultValues: initialData ? {
      nombre: initialData.nombre,
      correo: initialData.correo,
      rol: initialData.rol,
      sucursalId: initialData.sucursalId,
      active: initialData.active ?? initialData.isActive ?? true,
      password: '', // En edición, el password será opcional
    } : {
      nombre: '',
      correo: '',
      password: '',
      rol: UserRolesEnum.JUGADOR,
      active: true,
    }
  });

  const handleFormSubmit = (data: UsuarioFormData) => {
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
          Nombre *
        </label>
        <input
          id="nombre"
          type="text"
          {...register('nombre')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Ingrese el nombre completo"
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
        )}
      </div>

      {/* Correo */}
      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Correo Electrónico *
        </label>
        <input
          id="correo"
          type="email"
          {...register('correo')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="correo@ejemplo.com"
        />
        {errors.correo && (
          <p className="text-red-500 text-sm mt-1">{errors.correo.message}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contraseña {!isEditing && '*'}
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder={isEditing ? "Dejar en blanco para mantener la actual" : "Mínimo 6 caracteres"}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Rol */}
      <div>
        <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rol *
        </label>
        <select
          id="rol"
          {...register('rol')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Seleccionar rol</option>
          <option value={UserRolesEnum.ADMINISTRADOR}>Administrador</option>
          <option value={UserRolesEnum.ADMIN_LIGA}>Admin Liga</option>
          <option value={UserRolesEnum.CAPITAN}>Capitán</option>
          <option value={UserRolesEnum.JUGADOR}>Jugador</option>
        </select>
        {errors.rol && (
          <p className="text-red-500 text-sm mt-1">{errors.rol.message}</p>
        )}
      </div>

      {/* Estado */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('active')}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Usuario activo</span>
        </label>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
        </button>
      </div>
    </form>
  );
};
