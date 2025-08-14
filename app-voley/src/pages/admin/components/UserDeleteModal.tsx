import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import type { User } from '../../../types';

interface UserDeleteModalProps {
  user: User;
  onConfirm: () => void;
  onCancel: () => void;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  user,
  onConfirm,
  onCancel
}) => {
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'Administrador';
      case 'admin_liga':
        return 'Admin Liga';
      case 'capitan':
        return 'Capitán';
      case 'jugador':
        return 'Jugador';
      default:
        return role;
    }
  };

  const isHighPrivilegeRole = (role: string) => {
    return role === 'administrador' || role === 'admin_liga';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Trash2 className="w-5 h-5 mr-2 text-red-500" />
            Eliminar Usuario
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Icono de advertencia */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Mensaje principal */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¿Está seguro que desea eliminar este usuario?
            </h3>
            <p className="text-gray-600">
              Esta acción no se puede deshacer.
            </p>
          </div>

          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.nombre.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
                <p className="text-sm text-gray-500">{user.correo}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rol:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isHighPrivilegeRole(user.rol) 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {getRoleDisplayName(user.rol)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">ID:</span>
              <span className="text-sm font-mono text-gray-900">{user.id}</span>
            </div>
          </div>

          {/* Advertencia adicional para roles importantes */}
          {isHighPrivilegeRole(user.rol) && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-700">
                    <strong>Advertencia:</strong> Este usuario tiene privilegios administrativos.
                    Su eliminación podría afectar la gestión del sistema.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
