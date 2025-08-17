import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../../../common/components/Modal';
import { ChangePasswordSchema, type ChangePasswordFormData } from '../schemas/usuario.schema';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  loading?: boolean;
  userName?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  userName
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleFormSubmit = (data: ChangePasswordFormData) => {
    onSubmit(data.newPassword);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cambiar Contraseña"
      subtitle={userName ? `Usuario: ${userName}` : undefined}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Nueva Contraseña */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nueva Contraseña *
          </label>
          <input
            id="newPassword"
            type="password"
            {...register('newPassword')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Mínimo 6 caracteres"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmar Contraseña *
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Repetir la contraseña"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
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
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
