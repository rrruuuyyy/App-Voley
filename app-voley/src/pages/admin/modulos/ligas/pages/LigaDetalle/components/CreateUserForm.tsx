import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';

interface CreateUserFormData {
  nombre: string;
  correo: string;
  password: string;
}

interface CreateUserFormProps {
  register: UseFormRegister<CreateUserFormData>;
  errors: FieldErrors<CreateUserFormData>;
  handleSubmit: UseFormHandleSubmit<CreateUserFormData>;
  onSubmit: (data: CreateUserFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  onCancel,
  isLoading
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        Crear Nuevo Capitán
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre Completo *
          </label>
          <input
            id="nombre"
            type="text"
            {...register('nombre')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Ingrese el nombre completo"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correo Electrónico *
          </label>
          <input
            id="correo"
            type="email"
            {...register('correo')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="correo@ejemplo.com"
          />
          {errors.correo && (
            <p className="text-red-500 text-xs mt-1">{errors.correo.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña *
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Rol:</strong> Capitán (asignado automáticamente)
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Creando...' : 'Crear y Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
