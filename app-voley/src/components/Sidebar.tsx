import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  Trophy, 
  UserCheck, 
  Calendar,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { Badge } from '../common';

const Sidebar: React.FC = () => {
  const { user, logout } = useUserStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const adminMenuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard', roles: ['administrador'] },
    { path: '/admin/sedes', icon: Building2, label: 'Sedes', roles: ['administrador'] },
    { path: '/admin/ligas', icon: Trophy, label: 'Ligas', roles: ['administrador'] },
    { path: '/admin/usuarios', icon: Users, label: 'Usuarios', roles: ['administrador'] },
    { path: '/admin/configuracion', icon: Settings, label: 'Configuración', roles: ['administrador'] },
  ];

  const ligaAdminMenuItems = [
    { path: '/liga-admin', icon: Home, label: 'Dashboard', roles: ['admin_liga'] },
    { path: '/liga-admin/ligas', icon: Trophy, label: 'Ligas', roles: ['admin_liga'] },
    { path: '/liga-admin/equipos', icon: UserCheck, label: 'Equipos', roles: ['admin_liga'] },
    { path: '/liga-admin/partidos', icon: Calendar, label: 'Partidos', roles: ['admin_liga'] },
    { path: '/liga-admin/estadisticas', icon: BarChart3, label: 'Estadísticas', roles: ['admin_liga'] },
  ];

  const capitanMenuItems = [
    { path: '/capitan', icon: Home, label: 'Dashboard', roles: ['capitan'] },
    { path: '/capitan/equipos', icon: UserCheck, label: 'Mi Equipo', roles: ['capitan'] },
    { path: '/capitan/jugadores', icon: Users, label: 'Jugadores', roles: ['capitan'] },
  ];

  const jugadorMenuItems = [
    { path: '/jugador', icon: Home, label: 'Dashboard', roles: ['jugador'] },
    { path: '/jugador/partidos', icon: Calendar, label: 'Partidos', roles: ['jugador'] },
    { path: '/jugador/estadisticas', icon: BarChart3, label: 'Estadísticas', roles: ['jugador'] },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    
    const userRole = user.rol || user.u_role;
    
    switch (userRole) {
      case 'administrador':
        return adminMenuItems;
      case 'admin_liga':
        return ligaAdminMenuItems;
      case 'capitan':
        return capitanMenuItems;
      case 'jugador':
        return jugadorMenuItems;
      default:
        return [];
    }
  };

  const getUserRoleColor = (role: string) => {
    switch (role) {
      case 'administrador':
        return 'red' as const;
      case 'admin_liga':
        return 'blue' as const;
      case 'capitan':
        return 'green' as const;
      case 'jugador':
        return 'purple' as const;
      default:
        return 'gray' as const;
    }
  };

  const menuItems = getMenuItems();
  const userRole = user?.rol || user?.u_role;

  return (
    <div className="bg-gray-900 dark:bg-gray-950 text-white w-64 h-full flex flex-col border-r border-gray-700 dark:border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 dark:border-gray-800">
        <h1 className="text-xl font-bold">VoleyApp</h1>
        <p className="text-sm text-gray-400 mt-1">
          {user?.nombre || user?.u_name}
        </p>
        <Badge 
          variant={getUserRoleColor(userRole || '')} 
          size="sm" 
          className="mt-2"
        >
          {userRole?.replace('_', ' ')}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-900 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
