import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Trophy, 
  UserPlus, 
  AlertCircle
} from 'lucide-react';
import { userService, sedeService, ligaService } from '../../services/api';
import { StatCard, Card, ActionButton, PageHeader, PageLayout } from '../../common';

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
      color: 'blue' as const,
      trend: '+12%',
    },
    {
      title: 'Sedes Activas',
      value: stats.totalSedes,
      icon: Building2,
      color: 'green' as const,
      trend: '+5%',
    },
    {
      title: 'Ligas Totales',
      value: stats.totalLigas,
      icon: Trophy,
      color: 'purple' as const,
      trend: '+25%',
    },
    {
      title: 'Admin Ligas',
      value: stats.adminLigas,
      icon: UserPlus,
      color: 'orange' as const,
      trend: '+8%',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <PageLayout
      header={
        <PageHeader 
          title="Dashboard Administrador"
          subtitle="Gestión general del sistema"
          statusIndicator={{
            label: "Sistema Activo",
            color: "green",
            isActive: true
          }}
        />
      }
    >
      <div className="space-y-6">
        {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={{
              value: card.trend,
              isPositive: true
            }}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            title="Crear Sede"
            description="Agregar nueva sede"
            icon={Building2}
            color="blue"
          />
          <ActionButton
            title="Nuevo Admin Liga"
            description="Asignar administrador"
            icon={UserPlus}
            color="green"
          />
          <ActionButton
            title="Gestionar Usuarios"
            description="Ver todos los usuarios"
            icon={Users}
            color="purple"
          />
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">Nueva sede "Polideportivo Norte" creada</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">Admin Liga "María García" asignada</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hace 4 horas</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">Liga "Juvenil 2024" finalizada</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hace 1 día</p>
            </div>
          </div>
        </div>
      </Card>

      {/* User Distribution */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Distribución de Usuarios</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Jugadores</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(stats.jugadores / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.jugadores}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Capitanes</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.capitanes / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.capitanes}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Admin Ligas</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(stats.adminLigas / stats.totalUsers) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.adminLigas}</span>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
