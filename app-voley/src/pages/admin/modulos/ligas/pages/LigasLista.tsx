import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PaginatePrincipalWithQuery, SortableTable } from '../../../../../core/components';
import { PageHeader } from '../../../../../common';
import { Modal } from '../../../../../common/components/Modal';
import { LigaForm } from '../components/LigaForm';
import { useLigaPagination } from '../hooks/useLigaPagination';
import { 
  useCreateLiga, 
  useUpdateLiga, 
  useDeleteLiga, 
  useIniciarLiga,
  useFinalizarLiga
} from '../hooks/useLigaQueries';
import { createLigaTableColumns } from '../utils/tableColumns';
import type { Liga, SistemaPuntos, CriterioDesempate } from '../types';
import type { LigaFormData } from '../schemas/liga.schema';

const LigasLista: React.FC = () => {
  const navigate = useNavigate();
  const [editingLiga, setEditingLiga] = useState<Liga | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCapitanesModal, setShowCapitanesModal] = useState(false);
  const [selectedLigaId, setSelectedLigaId] = useState<number | null>(null);
  
  // Hook de paginación integrado con TanStack Query
  const {
    data: ligas,
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
  } = useLigaPagination();
  
  // Mutation hooks
  const createLigaMutation = useCreateLiga();
  const updateLigaMutation = useUpdateLiga();
  const deleteLigaMutation = useDeleteLiga();
  const iniciarLigaMutation = useIniciarLiga();
  const finalizarLigaMutation = useFinalizarLiga();

  const handleSave = async (formData: LigaFormData) => {
    try {
      if (editingLiga) {
        const updateData = {
          ...formData,
          sistemaPuntos: formData.sistemaPuntos as SistemaPuntos,
          criteriosDesempate: formData.criteriosDesempate as CriterioDesempate[],
          fechaInicio: formData.fechaInicio,
          fechaFin: formData.fechaFin,
        };
        
        await updateLigaMutation.mutateAsync({
          id: editingLiga.id,
          data: updateData
        });
      } else {
        const createData = {
          ...formData,
          sistemaPuntos: formData.sistemaPuntos as SistemaPuntos,
          criteriosDesempate: formData.criteriosDesempate as CriterioDesempate[],
          fechaInicio: formData.fechaInicio,
          fechaFin: formData.fechaFin,
        };
        await createLigaMutation.mutateAsync(createData);
      }
      
      handleCloseForm();
      refetch();
    } catch (error) {
      console.error('Error al guardar liga:', error);
    }
  };

  const isModalLoading = createLigaMutation.isPending || updateLigaMutation.isPending;

  const handleAdd = () => {
    setEditingLiga(null);
    setShowForm(true);
  };

  const handleEdit = async (id: number) => {
    const liga = ligas.find(l => l.id === id);
    if (liga) {
      setEditingLiga(liga);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    const liga = ligas.find(l => l.id === id);
    if (!liga) return;

    const confirmMessage = `¿Está seguro de que desea eliminar la liga "${liga.nombre}"?\n\nEsta acción no se puede deshacer.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteLigaMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error al eliminar liga:', error);
      }
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/admin/ligas/${id}`);
  };

  const handleManageCapitanes = (id: number) => {
    setSelectedLigaId(id);
    setShowCapitanesModal(true);
  };

  const handleCloseForm = () => {
    setEditingLiga(null);
    setShowForm(false);
  };

  const handleCloseCapitanesModal = () => {
    setSelectedLigaId(null);
    setShowCapitanesModal(false);
  };

  const tableColumns = createLigaTableColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onViewDetails: handleViewDetails,
    onManageCapitanes: handleManageCapitanes,
    iniciarLigaMutation,
    finalizarLigaMutation,
    deleteLigaMutation
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-6">
          <PageHeader
            title="Gestión de Ligas"
            subtitle="Error al cargar las ligas"
          />
        </div>
        <div className="px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">Error al cargar las ligas</div>
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
          title="Gestión de Ligas"
          subtitle="Administra las ligas de voleibol y su configuración"
          actions={
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Liga
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

        {/* Tabla de ligas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <SortableTable
            data={ligas}
            columns={tableColumns}
            loading={isLoading}
            emptyMessage="No se encontraron ligas"
          />
        </div>

        {/* Modal de formulario */}
        <Modal
          isOpen={showForm}
          onClose={handleCloseForm}
          title={editingLiga ? 'Editar Liga' : 'Nueva Liga'}
          size="xl"
        >
          <LigaForm
            initialData={editingLiga}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
            loading={isModalLoading}
          />
        </Modal>

        {/* Modal de gestión de capitanes */}
        <Modal
          isOpen={showCapitanesModal}
          onClose={handleCloseCapitanesModal}
          title="Gestionar Capitanes"
          size="lg"
        >
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Gestión de capitanes para la liga ID: {selectedLigaId}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Esta funcionalidad estará disponible próximamente.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseCapitanesModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LigasLista;
