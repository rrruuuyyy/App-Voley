import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PaginatePrincipalWithQuery, SortableTable } from '../../../../../core/components';
import { PageHeader, PageLayout } from '../../../../../common';
import { Modal } from '../../../../../common/components/Modal';
import { UserForm } from '../components/UserForm';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { useUsuarioPagination } from '../hooks/useUsuarioPagination';
import { 
  useCreateUsuario, 
  useUpdateUsuario, 
  useDeleteUsuario, 
  useToggleUsuarioStatus, 
  useChangePassword,
  useUsuario
} from '../hooks/useUsuarioQueries';
import { createUsuarioTableColumns } from '../utils/tableColumns';
import type { Usuario } from '../types';
import type { UsuarioFormData } from '../schemas/usuario.schema';
import type { SortConfig } from '../../../../../core/components/pagination';

const UsuariosLista: React.FC = () => {
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [changingPasswordUsuario, setChangingPasswordUsuario] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Hook de paginación integrado con TanStack Query
  const {
    data: usuarios,
    meta,
    isLoading,
    error,
    state,
    searchFields,
    updateSearch,
    updateSelectedFields,
    updateQueryAndFilters,
    toggleShowQueryAndFilters,
    goToNextPage,
    goToPreviousPage,
    reload,
    search,
    refetch,
    updateSort,
    clearSort,
    setLimit
  } = useUsuarioPagination();
  
  // Mutation hooks
  const createUsuarioMutation = useCreateUsuario();
  const updateUsuarioMutation = useUpdateUsuario();
  const deleteUsuarioMutation = useDeleteUsuario();
  const toggleStatusMutation = useToggleUsuarioStatus();
  const changePasswordMutation = useChangePassword();

  // Hook para obtener datos del usuario siendo editado
  const { data: editingUserData } = useUsuario(
    editingUsuario?.id || 0,
    { enabled: !!editingUsuario?.id }
  );

  const handleSave = async (formData: UsuarioFormData) => {
    try {
      if (editingUsuario) {
        // Preparar datos para actualización
        const updateData = {
          nombre: formData.nombre,
          correo: formData.correo,
          rol: formData.rol as any,
          sucursalId: formData.sucursalId,
          active: formData.active,
          ...(formData.password && { password: formData.password })
        };
        
        await updateUsuarioMutation.mutateAsync({
          id: editingUsuario.id,
          data: updateData
        });
      } else {
        const createData = {
          ...formData,
          rol: formData.rol as any
        };
        await createUsuarioMutation.mutateAsync(createData);
      }
      
      handleCloseForm();
      refetch();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  // Función para manejar el ordenamiento desde la tabla
  const handleTableSort = (sortConfig: SortConfig<Usuario>) => {
    if (sortConfig.direction && updateSort) {
      updateSort(sortConfig.key as string, sortConfig.direction);
    } else if (clearSort) {
      clearSort();
    }
  };

  // Loading state for the modal
  const isModalLoading = createUsuarioMutation.isPending || updateUsuarioMutation.isPending;

  // Manejadores de eventos
  const handleAdd = () => {
    setEditingUsuario(null);
    setShowForm(true);
  };

  const handleEdit = async (id: number) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      setEditingUsuario(usuario);
      setShowForm(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await deleteUsuarioMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleChangePassword = (id: number) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      setChangingPasswordUsuario(usuario);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordChange = async (newPassword: string) => {
    if (changingPasswordUsuario) {
      try {
        await changePasswordMutation.mutateAsync({
          id: changingPasswordUsuario.id,
          newPassword
        });
        handleClosePasswordModal();
      } catch (error) {
        console.error('Error al cambiar contraseña:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setChangingPasswordUsuario(null);
  };

  // Definición de las columnas de la tabla usando configuración unificada
  const columns = createUsuarioTableColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onChangePassword: handleChangePassword,
    toggleStatusMutation,
    deleteUsuarioMutation
  });

  // Show error state if there's an error
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error al cargar usuarios</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error.message || 'Ha ocurrido un error inesperado'}
            </div>
            <div className="mt-3">
              <button
                onClick={() => refetch()}
                className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
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
    <PageLayout
      header={
        <PageHeader 
          title="Gestión de Usuarios"
          subtitle="Administrar usuarios del sistema"
          actions={
            <button 
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo Usuario</span>
            </button>
          }
        />
      }
    >
      {/* Formulario de usuario */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        subtitle={editingUsuario ? `Modificar datos de ${editingUsuario.nombre}` : 'Crear un nuevo usuario en el sistema'}
        size="lg"
      >
        <UserForm
          initialData={editingUserData || editingUsuario}
          onSubmit={handleSave}
          loading={isModalLoading}
          onCancel={handleCloseForm}
        />
      </Modal>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={handleClosePasswordModal}
        onSubmit={handlePasswordChange}
        loading={changePasswordMutation.isPending}
        userName={changingPasswordUsuario?.nombre}
      />

      {/* Lista de usuarios con paginación */}
      <PaginatePrincipalWithQuery
        fields={searchFields}
        state={state}
        meta={meta}
        isLoading={isLoading}
        updateSearch={updateSearch}
        updateSelectedFields={updateSelectedFields}
        updateQueryAndFilters={updateQueryAndFilters}
        toggleShowQueryAndFilters={toggleShowQueryAndFilters}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        reload={reload}
        search={search}
        setLimit={setLimit}
        onAdd={handleAdd}
      >
        <SortableTable
          columns={columns}
          data={usuarios}
          loading={isLoading}
          emptyMessage="No hay usuarios registrados"
          externalSort={true}
          onSort={handleTableSort}
        />
      </PaginatePrincipalWithQuery>
    </PageLayout>
  );
};

export default UsuariosLista;
