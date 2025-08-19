import React from 'react';
import { Plus } from 'lucide-react';
import { Modal } from '../../../../../../../common/components/Modal';
import { UserSearchDropdown } from '../../../../../../../common/components/UserSearchDropdown';
import type { Usuario } from '../../../../usuarios/types';

interface CapitanesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCapitanes: Usuario[];
  showCreateUserForm: boolean;
  currentCapitanesIds: number[];
  isLoading: boolean;
  isCreatingUser: boolean;
  onAddCapitan: (usuario: Usuario) => void;
  onRemoveCapitan: (usuarioId: number) => void;
  onToggleCreateUserForm: () => void;
  onSave: () => void;
  children?: React.ReactNode; // Para el formulario de crear usuario
}

const CapitanesModal: React.FC<CapitanesModalProps> = ({
  isOpen,
  onClose,
  selectedCapitanes,
  showCreateUserForm,
  currentCapitanesIds,
  isLoading,
  isCreatingUser,
  onAddCapitan,
  onRemoveCapitan,
  onToggleCreateUserForm,
  onSave,
  children
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar Capitanes"
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Selector de búsqueda existente */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Buscar Capitanes Existentes
            </label>
            <button
              onClick={onToggleCreateUserForm}
              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            >
              <Plus className="w-3 h-3 mr-1" />
              {showCreateUserForm ? 'Cancelar' : 'Crear Nuevo Capitán'}
            </button>
          </div>
          
          {!showCreateUserForm && (
            <>
              <UserSearchDropdown
                onUserSelect={onAddCapitan}
                selectedUsers={selectedCapitanes}
                placeholder="Buscar usuarios con rol de capitán..."
                filterRole="capitan"
                excludeUserIds={currentCapitanesIds}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Solo se mostrarán usuarios con rol de "Capitán"
              </p>
            </>
          )}
        </div>

        {/* Formulario para crear nuevo capitán */}
        {showCreateUserForm && children}

        {/* Lista de capitanes seleccionados */}
        {selectedCapitanes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capitanes a Asignar ({selectedCapitanes.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedCapitanes.map((capitan) => (
                <div
                  key={capitan.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {capitan.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {capitan.correo}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveCapitan(capitan.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones del modal */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isLoading || isCreatingUser}
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={selectedCapitanes.length === 0 || isLoading || isCreatingUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Asignando...' : `Asignar ${selectedCapitanes.length} Capitán${selectedCapitanes.length > 1 ? 'es' : ''}`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CapitanesModal;
