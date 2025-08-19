import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useLiga, 
  useCapitanesLiga, 
  useAsignarCapitanes,
  useEliminarCapitan
} from '../../../hooks/useLigaQueries';
import { useCreateUsuario } from '../../../../usuarios/hooks/useUsuarioQueries';
import { LigaStatusEnum, type CapitanLiga } from '../../../types';
import type { Usuario } from '../../../../usuarios/types';
import { UserRolesEnum } from '../../../../usuarios/types';

// Schema para validación de creación de usuario
const createUserSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export const useLigaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ligaId = Number(id);

  // Estados locales
  const [showCapitanesModal, setShowCapitanesModal] = useState(false);
  const [selectedCapitanes, setSelectedCapitanes] = useState<Usuario[]>([]);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showEquipoModal, setShowEquipoModal] = useState(false);
  const [selectedCapitanForEquipo, setSelectedCapitanForEquipo] = useState<CapitanLiga | null>(null);

  // Queries
  const { data: liga, isLoading: ligaLoading, error: ligaError } = useLiga(ligaId);
  const { data: capitanesData = { capitanes: [], total: 0 }, refetch: refetchCapitanes } = useCapitanesLiga(ligaId);
  const capitanes = capitanesData.capitanes || [];

  // Mutations
  const asignarCapitanesMutation = useAsignarCapitanes();
  const createUsuarioMutation = useCreateUsuario();
  const eliminarCapitanMutation = useEliminarCapitan();

  // Form para crear usuario
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  // Handlers para capitanes
  const handleOpenCapitanesModal = () => {
    setSelectedCapitanes([]);
    setShowCapitanesModal(true);
  };

  const handleCloseCapitanesModal = () => {
    setShowCapitanesModal(false);
    setSelectedCapitanes([]);
    setShowCreateUserForm(false);
    resetForm();
  };

  const handleAddCapitan = (usuario: Usuario) => {
    if (!selectedCapitanes.find(c => c.id === usuario.id)) {
      setSelectedCapitanes(prev => [...prev, usuario]);
    }
  };

  const handleRemoveCapitan = (usuarioId: number) => {
    setSelectedCapitanes(prev => prev.filter(c => c.id !== usuarioId));
  };

  const handleSaveCapitanes = async () => {
    if (selectedCapitanes.length === 0) return;

    try {
      await asignarCapitanesMutation.mutateAsync({
        id: ligaId,
        data: { capitanesIds: selectedCapitanes.map(c => c.id) },
      });
      await refetchCapitanes();
      handleCloseCapitanesModal();
    } catch (error) {
      console.error('Error al asignar capitanes:', error);
    }
  };

  const handleEliminarCapitan = async (capitanId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este capitán? Esto también eliminará su equipo y jugadores.')) {
      try {
        await eliminarCapitanMutation.mutateAsync({ ligaId, capitanId });
        await refetchCapitanes();
      } catch (error) {
        console.error('Error al eliminar capitán:', error);
      }
    }
  };

  // Handlers para crear usuario
  const handleToggleCreateUserForm = () => {
    setShowCreateUserForm(prev => !prev);
    if (showCreateUserForm) {
      resetForm();
    }
  };

  const handleCreateCapitan = async (data: CreateUserFormData) => {
    try {
      const newUser = await createUsuarioMutation.mutateAsync({
        ...data,
        rol: UserRolesEnum.CAPITAN,
      });
      
      handleAddCapitan(newUser);
      resetForm();
      setShowCreateUserForm(false);
    } catch (error) {
      console.error('Error al crear capitán:', error);
    }
  };

  // Handlers para equipos
  const handleOpenEquipoModal = (capitan: CapitanLiga) => {
    setSelectedCapitanForEquipo(capitan);
    setShowEquipoModal(true);
  };

  const handleCloseEquipoModal = () => {
    setShowEquipoModal(false);
    setSelectedCapitanForEquipo(null);
  };

  const handleEquipoCreated = () => {
    refetchCapitanes();
  };

  // Handlers de navegación
  const handleGoBack = () => {
    navigate('/admin/ligas');
  };

  const handleEditLiga = () => {
    navigate(`/admin/ligas/${ligaId}/editar`);
  };

  // Utilidades
  const currentCapitanesIds = capitanes.map(c => c.id);
  
  const getCapitanEquipo = (capitanId: number) => {
    const capitan = capitanes.find(c => c.id === capitanId);
    return capitan?.equipo;
  };

  // Permisos
  const canManageCapitanes = liga?.status === LigaStatusEnum.PROGRAMADA;
  const canEditLiga = liga?.status === LigaStatusEnum.PROGRAMADA;

  return {
    // Estados
    liga,
    capitanes,
    ligaLoading,
    ligaError,
    showCapitanesModal,
    selectedCapitanes,
    showCreateUserForm,
    showEquipoModal,
    selectedCapitanForEquipo,
    
    // Mutations
    asignarCapitanesMutation,
    createUsuarioMutation,
    eliminarCapitanMutation,
    
    // Form
    register,
    handleSubmit,
    errors,
    
    // Handlers
    handleOpenCapitanesModal,
    handleCloseCapitanesModal,
    handleAddCapitan,
    handleRemoveCapitan,
    handleSaveCapitanes,
    handleEliminarCapitan,
    handleToggleCreateUserForm,
    handleCreateCapitan,
    handleOpenEquipoModal,
    handleCloseEquipoModal,
    handleEquipoCreated,
    handleGoBack,
    handleEditLiga,
    
    // Utilidades
    currentCapitanesIds,
    getCapitanEquipo,
    canManageCapitanes,
    canEditLiga,
    ligaId,
  };
};
