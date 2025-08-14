import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Building2, Lock, Eye, EyeOff } from 'lucide-react';
import type { User as UserType, CreateUserDto, UpdateUserDto, Sede } from '../../../types';

interface UserFormProps {
  user?: UserType | null;
  isEditing: boolean;
  sedes: Sede[];
  onSubmit: (userData: any) => Promise<void>; // Más flexible para manejar ambos tipos
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  isEditing,
  sedes,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'jugador' as 'administrador' | 'admin_liga' | 'capitan' | 'jugador',
    sucursalId: undefined as number | undefined
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar formulario con datos del usuario si está editando
  useEffect(() => {
    if (isEditing && user) {
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        password: '', // No mostrar password existente
        rol: user.rol,
        sucursalId: user.sucursalId
      });
    } else {
      // Resetear formulario para crear nuevo usuario
      setFormData({
        nombre: '',
        correo: '',
        password: '',
        rol: 'jugador',
        sucursalId: undefined
      });
    }
    setErrors({});
  }, [isEditing, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sucursalId' ? (value ? parseInt(value) : undefined) : value
    }));
    
    // Limpiar error del campo al cambiar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo no tiene un formato válido';
    }

    // Validar password (solo si no está editando o si se proporciona)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = 'El rol es requerido';
    }

    // Validar sucursal para admin_liga
    if (formData.rol === 'admin_liga' && !formData.sucursalId) {
      newErrors.sucursalId = 'La sede es requerida para administradores de liga';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: CreateUserDto | UpdateUserDto = {
        nombre: formData.nombre.trim(),
        correo: formData.correo.trim(),
        rol: formData.rol,
        sucursalId: formData.sucursalId
      };

      // Solo incluir password si no está vacío
      if (formData.password) {
        (submitData as CreateUserDto).password = formData.password;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleOptions = () => {
    return [
      { value: 'jugador', label: 'Jugador' },
      { value: 'capitan', label: 'Capitán' },
      { value: 'admin_liga', label: 'Admin Liga' },
      { value: 'administrador', label: 'Administrador' }
    ];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-2" />
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingrese el nombre completo"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-2" />
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.correo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="usuario@ejemplo.com"
            />
            {errors.correo && (
              <p className="mt-1 text-sm text-red-600">{errors.correo}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="w-4 h-4 inline mr-2" />
              Contraseña {isEditing && '(dejar vacío para mantener actual)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={isEditing ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Shield className="w-4 h-4 inline mr-2" />
              Rol
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.rol ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {getRoleOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.rol && (
              <p className="mt-1 text-sm text-red-600">{errors.rol}</p>
            )}
          </div>

          {/* Sede (solo para admin_liga) */}
          {formData.rol === 'admin_liga' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4 inline mr-2" />
                Sede
              </label>
              <select
                name="sucursalId"
                value={formData.sucursalId || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sucursalId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar sede</option>
                {sedes.map(sede => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre} - {sede.direccion}
                  </option>
                ))}
              </select>
              {errors.sucursalId && (
                <p className="mt-1 text-sm text-red-600">{errors.sucursalId}</p>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
