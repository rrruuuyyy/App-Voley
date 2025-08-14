import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Volleyball, Mail, Lock, QrCode } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import type { LoginRequest } from '../types';

const Login: React.FC = () => {
  const { 
    login, 
    loginWithQR, 
    isAuthenticated, 
    loading, 
    error, 
    user, 
    clearError 
  } = useUserStore();
  const [showQRLogin, setShowQRLogin] = useState(false);
  const [qrCode, setQrCode] = useState('');

  // Si ya está autenticado, redirigir inmediatamente
  if (isAuthenticated && !loading && user) {
    console.log('User already authenticated, redirecting to home');
    if(user.rol === 'administrador') {
        return <Navigate to="/admin" replace />;
    }
  }

  // Debug: log state changes solo cuando cambia
  React.useEffect(() => {
    console.log('Login component state:', {
      isAuthenticated,
      loading,
      user: user ? { id: user.id, rol: user.rol || user.u_role } : null
    });
  }, [isAuthenticated, loading, user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const clearStorageAndRefresh = () => {
    localStorage.clear();
    window.location.reload();
  };

  const onSubmit = async (data: LoginRequest) => {
    console.log('Submitting login with data:', data); // Para debug
    try {
      clearError();
      console.log('Calling login function...'); // Para debug
      await login(data);
      window.location.reload(); // Recargar para reflejar el cambio de estado
    } catch (err: any) {
      console.error('Error en login:', err);
    }
  };

  const handleQRLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode.trim()) return;

    try {
      clearError();
      await loginWithQR(qrCode);
      // La redirección se manejará automáticamente por el cambio de estado
    } catch (err: any) {
      // El error ya se maneja en el store
      console.error('Error en QR login:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Volleyball className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VoleyApp</h1>
          <p className="text-gray-600">Gestión de Ligas de Voleibol</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setShowQRLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                !showQRLogin
                  ? 'bg-white shadow text-blue-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setShowQRLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                showQRLogin
                  ? 'bg-white shadow text-blue-600 font-medium'
                  : 'text-gray-600'
              }`}
            >
              Código QR
            </button>
          </div>
        </div>

        {!showQRLogin ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  {...register('correo', {
                    required: 'El correo es requerido',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Correo inválido',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="tu@email.com"
                />
              </div>
              {errors.correo && (
                <p className="mt-1 text-sm text-red-600">{errors.correo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'La contraseña es requerida',
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
            
            {/* Botón temporal para limpiar localStorage */}
            <button
              type="button"
              onClick={clearStorageAndRefresh}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
            >
              🗑️ Limpiar Cache y Recargar (Temporal)
            </button>
          </form>
        ) : (
          <form onSubmit={handleQRLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código QR
              </label>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Escanea o ingresa tu código QR"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !qrCode.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Ingresar con QR'
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda?{' '}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Contactar soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
