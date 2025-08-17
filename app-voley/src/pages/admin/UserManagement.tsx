import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  UserCheck,
  UserX,
  QrCode,
  Mail,
  Shield
} from 'lucide-react';
import type { User, CreateUserDto, UpdateUserDto } from '../../types';
import { userService, sedeService } from '../../services/api';
import { PageHeader, PageLayout } from '../../common';
import UserForm from './components/UserForm';
import UserDeleteModal from './components/UserDeleteModal';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Estados para modales
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchUsers();
    fetchSedes();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      // Extraer los usuarios del formato paginado
      setUsers(response.items || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSedes = async () => {
    try {
      const data = await sedeService.getAll();
      setSedes(data);
    } catch (err) {
      console.error('Error al cargar sedes:', err);
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.rol === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handlers para formulario
  const handleCreateUser = async (userData: CreateUserDto) => {
    try {
      await userService.createUser(userData);
      await fetchUsers();
      setShowForm(false);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (userData: UpdateUserDto) => {
    if (!selectedUser) return;
    
    try {
      await userService.updateUser(selectedUser.id, userData);
      await fetchUsers();
      setShowForm(false);
      setSelectedUser(null);
      setIsEditing(false);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await userService.deleteUser(selectedUser.id);
      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleGenerateQR = async (userId: number) => {
    try {
      await userService.generateQR(userId);
      await fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al generar código QR');
    }
  };

  // Handlers para modales
  const openCreateForm = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const openEditForm = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowForm(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowForm(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  // Función para obtener el color del rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'bg-red-100 text-red-800';
      case 'admin_liga':
        return 'bg-blue-100 text-blue-800';
      case 'capitan':
        return 'bg-green-100 text-green-800';
      case 'jugador':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener el nombre de la sede
  const getSedeName = (sucursalId?: number) => {
    if (!sucursalId) return 'N/A';
    const sede = sedes.find(s => s.id === sucursalId);
    return sede?.nombre || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Gestión de Usuarios"
          subtitle="Administra todos los usuarios del sistema"
          actions={
            <button
              onClick={openCreateForm}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </button>
          }
        />
      }
    >
      <div className="space-y-6">

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="admin_liga">Admin Liga</option>
              <option value="capitan">Capitán</option>
              <option value="jugador">Jugador</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sede
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.nombre.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.correo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.rol)}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.rol.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getSedeName(user.sucursalId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {(user.isActive ?? user.active) !== false ? (
                        <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <UserX className="w-4 h-4 text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${(user.isActive ?? user.active) !== false ? 'text-green-600' : 'text-red-600'}`}>
                        {(user.isActive ?? user.active) !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleGenerateQR(user.id)}
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                        title="Generar código QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditForm(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modales */}
      {showForm && (
        <UserForm
          user={selectedUser}
          isEditing={isEditing}
          sedes={sedes}
          onSubmit={isEditing ? handleUpdateUser : handleCreateUser}
          onCancel={closeModals}
        />
      )}

      {showDeleteModal && selectedUser && (
        <UserDeleteModal
          user={selectedUser}
          onConfirm={handleDeleteUser}
          onCancel={closeModals}
        />
      )}
      </div>
    </PageLayout>
  );
};

export default UserManagement;
