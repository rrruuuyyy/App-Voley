import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Trophy, 
  UserPlus, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { userService, sedeService, ligaService } from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  totalSedes: number;
  totalLigas: number;
  adminLigas: number;
  capitanes: number;
  jugadores: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSedes: 0,
    totalLigas: 0,
    adminLigas: 0,
    capitanes: 0,
    jugadores: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [sedes, ligas, adminLigas, capitanes, jugadores] = await Promise.all([
          sedeService.getAll(),
          ligaService.getAll(),
          userService.getUsersByRole('admin_liga'),
          userService.getUsersByRole('capitan'),
          userService.getUsersByRole('jugador'),
        ]);

        setStats({
          totalSedes: sedes.length,
          totalLigas: ligas.length,
          adminLigas: adminLigas.length,
          capitanes: capitanes.length,
          jugadores: jugadores.length,
          totalUsers: adminLigas.length + capitanes.length + jugadores.length + 1, // +1 for the admin
        });
      } catch (err: any) {
        setError('Error al cargar estadísticas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Sedes Activas',
      value: stats.totalSedes,
      icon: Building2,
      color: 'bg-green-500',
      trend: '+5%',
    },
    {
      title: 'Ligas Totales',
      value: stats.totalLigas,
      icon: Trophy,
      color: 'bg-purple-500',
      trend: '+25%',
    },
    {
      title: 'Admin Ligas',
      value: stats.adminLigas,
      icon: UserPlus,
      color: 'bg-orange-500',
      trend: '+8%',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrador</h1>
          <p className="text-gray-600 mt-1">Gestión general del sistema</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Sistema Activo</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{card.trend}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Building2 className="h-8 w-8 text-blue-500 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Crear Sede</h3>
              <p className="text-sm text-gray-600">Agregar nueva sede</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserPlus className="h-8 w-8 text-green-500 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Nuevo Admin Liga</h3>
              <p className="text-sm text-gray-600">Asignar administrador</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-purple-500 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Gestionar Usuarios</h3>
              <p className="text-sm text-gray-600">Ver todos los usuarios</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Nueva sede "Polideportivo Norte" creada</p>
              <p className="text-xs text-gray-500">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Admin Liga "María García" asignada</p>
              <p className="text-xs text-gray-500">Hace 4 horas</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">Liga "Juvenil 2024" finalizada</p>
              <p className="text-xs text-gray-500">Hace 1 día</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribución de Usuarios</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Jugadores</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(stats.jugadores / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.jugadores}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Capitanes</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.capitanes / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.capitanes}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Admin Ligas</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(stats.adminLigas / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.adminLigas}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
