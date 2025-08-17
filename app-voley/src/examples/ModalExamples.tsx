import React, { useState } from 'react';
import { Modal } from '../common/components/Modal';

const ModalExamples: React.FC = () => {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Ejemplos de Modal
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Modal Básico */}
        <button
          onClick={() => setBasicModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Modal Básico
        </button>

        {/* Modal Grande */}
        <button
          onClick={() => setLargeModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Modal Grande
        </button>

        {/* Modal de Confirmación */}
        <button
          onClick={() => setConfirmModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Modal de Confirmación
        </button>
      </div>

      {/* Modal Básico */}
      <Modal
        isOpen={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
        title="Modal Básico"
        subtitle="Este es un ejemplo de modal básico"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Este es el contenido de un modal básico. Puedes incluir cualquier contenido aquí.
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setBasicModalOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Grande */}
      <Modal
        isOpen={largeModalOpen}
        onClose={() => setLargeModalOpen(false)}
        title="Modal Grande"
        subtitle="Este modal tiene un tamaño más grande"
        size="xl"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Este modal es más grande y puede contener más contenido. Es útil para formularios
            extensos o información detallada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Columna 1</h3>
              <p className="text-gray-700 dark:text-gray-300">Contenido de la primera columna</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Columna 2</h3>
              <p className="text-gray-700 dark:text-gray-300">Contenido de la segunda columna</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setLargeModalOpen(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirmar Acción"
        size="sm"
        showCloseButton={false}
        closeOnBackdropClick={false}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            ¿Estás seguro de que quieres realizar esta acción? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                alert('¡Acción confirmada!');
                setConfirmModalOpen(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalExamples;
