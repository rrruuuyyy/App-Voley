import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3, 
  Play, 
  Pause,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { ligaService, equipoService, partidoService } from '../../services/api';
import { useUserStore } from '../../stores/userStore';
import type { Liga } from '../../types';

interface LigaStats {
  totalLigas: number;
  ligasActivas: number;
  totalEquipos: number;
  partidosJugados: number;
  partidosPendientes: number;
}

const LigaAdminDashboard: React.FC = () => {
  const { user } = useUserStore();
  const [stats, setStats] = useState<LigaStats>({
    totalLigas: 0,
    ligasActivas: 0,
    totalEquipos: 0,
    partidosJugados: 0,
    partidosPendientes: 0,
  });
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const allLigas = await ligaService.getAll();
        
        // Filtrar ligas donde el usuario actual es admin_liga
        const userLigas = allLigas.filter(liga => liga.adminLigaId === user?.id);
        setLigas(userLigas);

        let totalEquipos = 0;
        let partidosJugados = 0;
        let partidosPendientes = 0;

        // Obtener estadísticas de cada liga
        for (const liga of userLigas) {
          try {
            const [equipos, partidos] = await Promise.all([
              equipoService.getByLiga(liga.id),
              partidoService.getByLiga(liga.id),
            ]);

            totalEquipos += equipos.length;
            partidosJugados += partidos.filter(p => p.status === 'finalizado').length;
            partidosPendientes += partidos.filter(p => p.status === 'programado').length;
          } catch (err) {
            console.error(`Error fetching data for liga ${liga.id}:`, err);
          }
        }

        setStats({
          totalLigas: userLigas.length,
          ligasActivas: userLigas.filter(l => l.status === 'en_curso').length,
          totalEquipos,
          partidosJugados,
          partidosPendientes,
        });
      } catch (err: any) {
        setError('Error al cargar datos del dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleIniciarLiga = async (ligaId: number) => {
    try {
      await ligaService.iniciar(ligaId);
      // Actualizar el estado local
      setLigas(prev => prev.map(liga => 
        liga.id === ligaId 
          ? { ...liga, status: 'en_curso' as const }
          : liga
      ));
      // Actualizar stats
      setStats(prev => ({
        ...prev,
        ligasActivas: prev.ligasActivas + 1
      }));
    } catch (err: any) {
      console.error('Error al iniciar liga:', err);
      alert('Error al iniciar la liga');
    }
  };

  const handleFinalizarLiga = async (ligaId: number) => {
    try {
      await ligaService.finalizar(ligaId);
      // Actualizar el estado local
      setLigas(prev => prev.map(liga => 
        liga.id === ligaId 
          ? { ...liga, status: 'finalizada' as const }
          : liga
      ));
      // Actualizar stats
      setStats(prev => ({
        ...prev,
        ligasActivas: prev.ligasActivas - 1
      }));
    } catch (err: any) {
      console.error('Error al finalizar liga:', err);
      alert('Error al finalizar la liga');
    }
  };

  const statCards = [
    {
      title: 'Total Ligas',
      value: stats.totalLigas,
      icon: Trophy,
      color: 'bg-blue-500',
    },
    {
      title: 'Ligas Activas',
      value: stats.ligasActivas,
      icon: Play,
      color: 'bg-green-500',
    },
    {
      title: 'Total Equipos',
      value: stats.totalEquipos,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Partidos Jugados',
      value: stats.partidosJugados,
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  const getStatusBadge = (status: Liga['status']) => {
    const styles = {
      programada: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_curso: 'bg-green-100 text-green-800 border-green-200',
      finalizada: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelada: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      programada: 'Programada',
      en_curso: 'En Curso',
      finalizada: 'Finalizada',
      cancelada: 'Cancelada',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

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
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Liga</h1>
          <p className="text-gray-600 mt-1">Gestión de ligas y competiciones</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Liga</span>
        </button>
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
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ligas Overview */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Mis Ligas</h2>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">Partidos pendientes: {stats.partidosPendientes}</span>
          </div>
        </div>

        {ligas.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes ligas asignadas</h3>
            <p className="text-gray-600">Crea tu primera liga para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ligas.map((liga) => (
              <div key={liga.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{liga.nombre}</h3>
                      {getStatusBadge(liga.status)}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{liga.descripcion}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Vueltas: {liga.vueltas}</span>
                      <span>Sistema: {liga.sistemaPuntos.toUpperCase()}</span>
                      <span>Grupos: {liga.numeroGrupos}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {liga.status === 'programada' && (
                      <button
                        onClick={() => handleIniciarLiga(liga.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Play className="h-4 w-4" />
                        <span>Iniciar</span>
                      </button>
                    )}
                    {liga.status === 'en_curso' && (
                      <button
                        onClick={() => handleFinalizarLiga(liga.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <Pause className="h-4 w-4" />
                        <span>Finalizar</span>
                      </button>
                    )}
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>Ver</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Trophy className="h-8 w-8 text-blue-500 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Crear Liga</h3>
              <p className="text-sm text-gray-600">Nueva competición</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Asignar Capitán</h3>
              <p className="text-sm text-gray-600">Gestionar equipos</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-8 w-8 text-purple-500 mr-3" />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Generar Fixture</h3>
              <p className="text-sm text-gray-600">Crear calendario</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LigaAdminDashboard;
