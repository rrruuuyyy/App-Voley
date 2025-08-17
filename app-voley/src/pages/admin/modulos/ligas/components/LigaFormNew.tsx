import React, { useState, useEffect } from 'react';
import { LigaSchema, type LigaFormData } from '../schemas/liga.schema';
import { SistemaPuntosEnum, CriteriosDesempateEnum, type Liga } from '../types';
import { useSedesLite } from '../../sedes/hooks/useSedeQueries';
import { 
  FormWrapper, 
  FormWrapperInput, 
  FormWrapperSelect, 
  FormWrapperTextArea,
  FormWrapperSelectHttp 
} from '../../../../../common';

interface LigaFormProps {
  initialData?: Liga | null;
  onSubmit: (data: LigaFormData) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export const LigaForm: React.FC<LigaFormProps> = ({
  initialData,
  onSubmit,
  loading = false,
  onCancel
}) => {
  const isEditing = !!initialData;
  const [selectedCriterios, setSelectedCriterios] = useState<string[]>([]);
  
  // Establecer criterios iniciales
  useEffect(() => {
    if (initialData?.criteriosDesempate) {
      setSelectedCriterios(initialData.criteriosDesempate);
    } else {
      setSelectedCriterios([CriteriosDesempateEnum.PUNTOS]);
    }
  }, [initialData]);

  // Preparar valores por defecto
  const defaultValues = initialData ? {
    nombre: initialData.nombre,
    descripcion: initialData.descripcion || '',
    vueltas: initialData.vueltas,
    numeroGrupos: initialData.numeroGrupos,
    sistemaPuntos: initialData.sistemaPuntos,
    criteriosDesempate: initialData.criteriosDesempate,
    maxPartidosPorDia: initialData.maxPartidosPorDia,
    duracionEstimadaPartido: initialData.duracionEstimadaPartido,
    descansoMinimo: initialData.descansoMinimo,
    fechaInicio: initialData.fechaInicio.split('T')[0],
    fechaFin: initialData.fechaFin.split('T')[0],
    adminLigaId: initialData.adminLigaId,
    sedeId: initialData.sedeId,
  } : {
    nombre: '',
    descripcion: '',
    vueltas: 1,
    numeroGrupos: 1,
    sistemaPuntos: SistemaPuntosEnum.FIVB,
    criteriosDesempate: [CriteriosDesempateEnum.PUNTOS],
    maxPartidosPorDia: 2,
    duracionEstimadaPartido: 90,
    descansoMinimo: 30,
    fechaInicio: '',
    fechaFin: '',
    adminLigaId: 0,
    sedeId: 0,
  };

  const handleFormSubmit = (data: LigaFormData) => {
    const submitData = {
      ...data,
      criteriosDesempate: selectedCriterios,
    };
    onSubmit(submitData);
  };

  const handleCancel = () => {
    setSelectedCriterios([CriteriosDesempateEnum.PUNTOS]);
    onCancel?.();
  };

  const toggleCriterio = (criterio: string, setValue: any) => {
    setSelectedCriterios(prev => {
      const newCriterios = prev.includes(criterio)
        ? prev.filter(c => c !== criterio)
        : [...prev, criterio];
      
      setValue('criteriosDesempate', newCriterios);
      return newCriterios;
    });
  };

  // Opciones para selects
  const sistemaPuntosOptions = [
    { value: SistemaPuntosEnum.FIVB, label: 'Sistema FIVB (3-1-0)' },
    { value: SistemaPuntosEnum.SIMPLE, label: 'Sistema Simple (1-0)' },
  ];

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <FormWrapper
      schema={LigaSchema}
      onSubmit={handleFormSubmit}
      defaultValues={defaultValues}
    >
      {(methods) => {
        const { setValue, watch } = methods;
        const fechaInicio = watch('fechaInicio');

        return (
          <div className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormWrapperInput
                  name="nombre"
                  label="Nombre de la Liga"
                  required
                  placeholder="Ej: Liga Juvenil 2024"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <FormWrapperTextArea
                  name="descripcion"
                  label="Descripción"
                  placeholder="Descripción de la liga..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Configuración de formato */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configuración de Formato</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormWrapperInput
                  name="vueltas"
                  label="Número de Vueltas"
                  type="number"
                  min="1"
                  required
                  disabled={loading}
                  textHelp="¿Cuántas veces se enfrentarán todos los equipos?"
                />

                <FormWrapperInput
                  name="numeroGrupos"
                  label="Número de Grupos"
                  type="number"
                  min="1"
                  required
                  disabled={loading}
                  textHelp="División de equipos en grupos"
                />

                <FormWrapperSelect
                  name="sistemaPuntos"
                  label="Sistema de Puntos"
                  options={sistemaPuntosOptions}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Criterios de Desempate */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Criterios de Desempate</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Selecciona los criterios en orden de prioridad para resolver empates:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(CriteriosDesempateEnum).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    PUNTOS: 'Puntos totales',
                    VICTORIAS: 'Número de victorias',
                    SET_RATIO: 'Ratio de sets (ganados/perdidos)',
                    POINT_RATIO: 'Ratio de puntos (anotados/recibidos)',
                    HEAD_TO_HEAD: 'Enfrentamiento directo'
                  };

                  return (
                    <label key={value} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCriterios.includes(value)}
                        onChange={() => toggleCriterio(value, setValue)}
                        disabled={loading}
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {labels[key] || key}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Configuración de Partidos */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configuración de Partidos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormWrapperInput
                  name="maxPartidosPorDia"
                  label="Máx. Partidos por Día"
                  type="number"
                  min="1"
                  required
                  disabled={loading}
                  textHelp="Cantidad máxima de partidos por jornada"
                />

                <FormWrapperInput
                  name="duracionEstimadaPartido"
                  label="Duración Estimada (min)"
                  type="number"
                  min="30"
                  required
                  disabled={loading}
                  textHelp="Tiempo estimado por partido en minutos"
                />

                <FormWrapperInput
                  name="descansoMinimo"
                  label="Descanso Mínimo (min)"
                  type="number"
                  min="0"
                  required
                  disabled={loading}
                  textHelp="Tiempo mínimo entre partidos del mismo equipo"
                />
              </div>
            </div>

            {/* Fechas y Ubicación */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fechas y Ubicación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormWrapperInput
                  name="fechaInicio"
                  label="Fecha de Inicio"
                  type="date"
                  min={today}
                  required
                  disabled={loading}
                />

                <FormWrapperInput
                  name="fechaFin"
                  label="Fecha de Finalización"
                  type="date"
                  min={fechaInicio || today}
                  required
                  disabled={loading}
                />

                <FormWrapperSelectHttp
                  name="sedeId"
                  label="Sede Principal"
                  required
                  placeholder="Buscar sede..."
                  disabled={loading}
                  useQuery={useSedesLite}
                  textHelp="Selecciona la sede donde se realizarán los partidos"
                />

                <FormWrapperInput
                  name="adminLigaId"
                  label="ID Admin Liga (temporal)"
                  type="number"
                  min="1"
                  required
                  disabled={loading}
                  textHelp="Temporalmente ingresa el ID del administrador de liga"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </div>
                ) : (
                  isEditing ? 'Actualizar Liga' : 'Crear Liga'
                )}
              </button>
            </div>
          </div>
        );
      }}
    </FormWrapper>
  );
};
