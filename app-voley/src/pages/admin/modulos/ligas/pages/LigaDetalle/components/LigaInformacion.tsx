import React from 'react';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';
import { LigaStatusEnum, type Liga } from '../../../types';

interface LigaInformacionProps {
  liga: Liga;
}

const LigaInformacion: React.FC<LigaInformacionProps> = ({ liga }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case LigaStatusEnum.PROGRAMADA:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case LigaStatusEnum.EN_CURSO:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case LigaStatusEnum.FINALIZADA:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case LigaStatusEnum.CANCELADA:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case LigaStatusEnum.PROGRAMADA:
        return 'Programada';
      case LigaStatusEnum.EN_CURSO:
        return 'En Curso';
      case LigaStatusEnum.FINALIZADA:
        return 'Finalizada';
      case LigaStatusEnum.CANCELADA:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Información General
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(liga.status)}`}>
          {getStatusText(liga.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fechas */}
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Fechas</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(liga.fechaInicio)} - {formatDate(liga.fechaFin)}
            </p>
          </div>
        </div>

        {/* Sede */}
        {liga.sede && (
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Sede</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {liga.sede.nombre}
              </p>
              {liga.sede.direccion && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {liga.sede.direccion}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Número de equipos */}
        {liga.numeroEquipos !== undefined && (
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Equipos Registrados</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {liga.numeroEquipos} equipos
              </p>
            </div>
          </div>
        )}

        {/* Admin de Liga */}
        {liga.adminLiga && (
          <div className="flex items-start space-x-3">
            <Trophy className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Administrador</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {liga.adminLiga.nombre}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {liga.adminLiga.correo}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Descripción */}
      {liga.descripcion && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Descripción
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {liga.descripcion}
          </p>
        </div>
      )}
    </div>
  );
};

export default LigaInformacion;
