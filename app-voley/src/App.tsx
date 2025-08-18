import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useUserStore } from './stores/userStore';
import { AuthInitializer } from './components/AuthInitializer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import { UsuariosLista } from './pages/admin/modulos/usuarios';
import { SedesLista } from './pages/admin/modulos/sedes';
import { LigasLista, LigaDetalle } from './pages/admin/modulos/ligas';
import LigaAdminDashboard from './pages/liga-admin/LigaAdminDashboard';

// Componente para redireccionar según el rol del usuario
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useUserStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el rol del usuario
  switch (user.rol || user.u_role) {
    case 'administrador':
      return <Navigate to="/admin" replace />;
    case 'admin_liga':
      return <Navigate to="/liga-admin" replace />;
    case 'capitan':
      return <Navigate to="/capitan" replace />;
    case 'jugador':
      return <Navigate to="/jugador" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Página de no autorizado
const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Acceso Denegado</h2>
      <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta página.</p>
      <button 
        onClick={() => window.history.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Volver
      </button>
    </div>
  </div>
);

// Componentes temporales para las páginas que faltan
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">Esta página está en desarrollo.</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthInitializer>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Página de no autorizado */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Redireccionamiento basado en rol */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* Rutas protegidas con layout */}
          <Route path="/" element={<Layout />}>
            {/* Rutas del Administrador */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['administrador']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/sedes" 
              element={
                <ProtectedRoute roles={['administrador']}>
                  <SedesLista />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/ligas" 
              element={
                <ProtectedRoute roles={['administrador']}>
                  <LigasLista />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/ligas/:id" 
              element={
                <ProtectedRoute roles={['administrador']}>
                  <LigaDetalle />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/usuarios" 
              element={
                <ProtectedRoute roles={['administrador']}>
                  <UsuariosLista />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/configuracion" 
              element={
                <ProtectedRoute roles={['administrador']}>
                  <ComingSoon title="Configuración" />
                </ProtectedRoute>
              } 
            />

            {/* Rutas del Admin Liga */}
            <Route 
              path="/liga-admin" 
              element={
                <ProtectedRoute roles={['admin_liga']}>
                  <LigaAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/liga-admin/ligas" 
              element={
                <ProtectedRoute roles={['admin_liga']}>
                  <ComingSoon title="Gestión de Ligas" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/liga-admin/equipos" 
              element={
                <ProtectedRoute roles={['admin_liga']}>
                  <ComingSoon title="Gestión de Equipos" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/liga-admin/partidos" 
              element={
                <ProtectedRoute roles={['admin_liga']}>
                  <ComingSoon title="Gestión de Partidos" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/liga-admin/estadisticas" 
              element={
                <ProtectedRoute roles={['admin_liga']}>
                  <ComingSoon title="Estadísticas" />
                </ProtectedRoute>
              } 
            />

            {/* Rutas del Capitán */}
            <Route 
              path="/capitan" 
              element={
                <ProtectedRoute roles={['capitan']}>
                  <ComingSoon title="Dashboard Capitán" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/capitan/equipos" 
              element={
                <ProtectedRoute roles={['capitan']}>
                  <ComingSoon title="Mi Equipo" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/capitan/jugadores" 
              element={
                <ProtectedRoute roles={['capitan']}>
                  <ComingSoon title="Gestión de Jugadores" />
                </ProtectedRoute>
              } 
            />

            {/* Rutas del Jugador */}
            <Route 
              path="/jugador" 
              element={
                <ProtectedRoute roles={['jugador']}>
                  <ComingSoon title="Dashboard Jugador" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jugador/partidos" 
              element={
                <ProtectedRoute roles={['jugador']}>
                  <ComingSoon title="Mis Partidos" />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jugador/estadisticas" 
              element={
                <ProtectedRoute roles={['jugador']}>
                  <ComingSoon title="Mis Estadísticas" />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <h2 className="text-3xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
                  <p className="text-gray-600 mb-8">La página que buscas no existe.</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                  >
                    Ir al inicio
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthInitializer>
    </ThemeProvider>
  );
}

export default App;
