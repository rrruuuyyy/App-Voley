import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PaginatePrincipalWithQuery, SortableTable } from '../../../../../core/components';
import { PageHeader } from '../../../../../common';
import { Modal } from '../../../../../common/components/Modal';
import { SedeForm } from '../components/SedeForm';
import { useSedePagination } from '../hooks/useSedePagination';
import { 
  useCreateSede, 
  useUpdateSede, 
  useDeleteSede, 
  useToggleSedeStatus
} from '../hooks/useSedeQueries';
import { createSedeTableColumns } from '../utils/tableColumns';
import type { Sede } from '../types';
import type { SedeFormData } from '../schemas/sede.schema';

const SedesLista: React.FC = () => {
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Hook de paginación integrado con TanStack Query
  const {
    data: sedes,
    meta,
    isLoading,
    error,
    state,
    updateSearch,
    updateSelectedFields,
    updateQueryAndFilters,
    toggleShowQueryAndFilters,
    goToNextPage,
    goToPreviousPage,
    reload,
    search,
    refetch,
    setLimit
  } = useSedePagination();
  
  // Mutation hooks
  const createSedeMutation = useCreateSede();
  const updateSedeMutation = useUpdateSede();
  const deleteSedeMutation = useDeleteSede();
  const toggleStatusMutation = useToggleSedeStatus();

  const handleSave = async (formData: SedeFormData) => {
    try {
      if (editingSede) {
        const updateData = {
          nombre: formData.nombre,
          direccion: formData.direccion,
          telefono: formData.telefono || undefined,
          numeroCancha: formData.numeroCancha,
          active: formData.active,
        };
        
        await updateSedeMutation.mutateAsync({
          id: editingSede.id,
          data: updateData
        });
      } else {
        const createData = {
          nombre: formData.nombre,
          direccion: formData.direccion,
          telefono: formData.telefono || undefined,
          numeroCancha: formData.numeroCancha,
        };
        await createSedeMutation.mutateAsync(createData);
      }
      
      handleCloseForm();
      refetch();
    } catch (error) {
      console.error('Error al guardar sede:', error);
    }
  };

  const isModalLoading = createSedeMutation.isPending || updateSedeMutation.isPending;

  const handleAdd = () => {
    setEditingSede(null);
    setShowForm(true);
  };

  const handleEdit = async (id: number) => {
    const sede = sedes.find(s => s.id === id);
    if (sede) {
      setEditingSede(sede);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta sede?')) {
      try {
        await deleteSedeMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error al eliminar sede:', error);
      }
    }
  };

  const handleViewDetails = (id: number) => {
    console.log('Ver detalles de sede:', id);
  };

  const handleCloseForm = () => {
    setEditingSede(null);
    setShowForm(false);
  };

  const tableColumns = createSedeTableColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onViewDetails: handleViewDetails,
    toggleStatusMutation,
    deleteUsuarioMutation: deleteSedeMutation
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-6">
          <PageHeader
            title="Gestión de Sedes"
            subtitle="Error al cargar las sedes"
          />
        </div>
        <div className="px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">Error al cargar las sedes</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
        <PageHeader
          title="Gestión de Sedes"
          subtitle="Administra las sedes donde se realizan las competencias de voleibol"
          actions={
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Sede
            </button>
          }
        />
      </div>

      {/* Contenido */}
      <div className="px-6 py-6 space-y-6">
        {/* Componente de paginación principal */}
        <PaginatePrincipalWithQuery
          meta={meta}
          state={state}
          updateSearch={updateSearch}
          updateSelectedFields={updateSelectedFields}
          updateQueryAndFilters={updateQueryAndFilters}
          toggleShowQueryAndFilters={toggleShowQueryAndFilters}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          reload={reload}
          search={search}
          setLimit={setLimit}
          isLoading={isLoading}
          onAdd={handleAdd}
        />

        {/* Tabla de sedes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <SortableTable
            data={sedes}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No se encontraron sedes"
          />
        </div>

        {/* Modal de formulario */}
        <Modal
          isOpen={showForm}
          onClose={handleCloseForm}
          title={editingSede ? 'Editar Sede' : 'Nueva Sede'}
          size="md"
        >
          <SedeForm
            initialData={editingSede}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
            loading={isModalLoading}
          />
        </Modal>
      </div>
    </div>
  );
};

export default SedesLista;
