import React, { useState } from 'react';
import { Trophy, Save, X, Plus, Minus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import httpRest from '../../../../../../../../services/httpRest';
import { Modal } from '../../../../../../../../common/components/Modal';

interface Set {
  local: number;
  visitante: number;
}

interface SubirResultadoRequest {
  setsEquipoLocal: number;
  setsEquipoVisitante: number;
  detallesSets: Set[];
  observaciones?: string;
}

interface Partido {
  id: number;
  jornada: number;
  vuelta: number;
  fechaHora: string;
  equipoLocal: {
    id: number;
    nombre: string;
  };
  equipoVisitante: {
    id: number;
    nombre: string;
  };
  status: 'programado' | 'en_curso' | 'finalizado';
}

interface ModalSubirResultadoProps {
  isOpen: boolean;
  onClose: () => void;
  partido: Partido | null;
  onResultadoGuardado: () => void;
}

export const ModalSubirResultado: React.FC<ModalSubirResultadoProps> = ({
  isOpen,
  onClose,
  partido,
  onResultadoGuardado
}) => {
  const [sets, setSets] = useState<Set[]>([{ local: 0, visitante: 0 }]);
  const [observaciones, setObservaciones] = useState('');
  const queryClient = useQueryClient();

  const subirResultadoMutation = useMutation({
    mutationFn: async (data: SubirResultadoRequest) => {
      if (!partido) throw new Error('No hay partido seleccionado');
      return await httpRest.put(`/partido/${partido.id}/resultado`, data);
    },
    onSuccess: () => {
      // Refrescar datos
      queryClient.invalidateQueries({ queryKey: ['proximosPartidos'] });
      queryClient.invalidateQueries({ queryKey: ['partidosLiga'] });
      queryClient.invalidateQueries({ queryKey: ['tablaposiciones'] });
      
      onResultadoGuardado();
      handleClose();
    },
    onError: (error) => {
      console.error('Error al subir resultado:', error);
      alert('Error al guardar el resultado. Por favor intenta de nuevo.');
    }
  });

  const handleClose = () => {
    setSets([{ local: 0, visitante: 0 }]);
    setObservaciones('');
    onClose();
  };

  const agregarSet = () => {
    setSets([...sets, { local: 0, visitante: 0 }]);
  };

  const eliminarSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const actualizarSet = (index: number, campo: 'local' | 'visitante', valor: number) => {
    const nuevosSet = [...sets];
    nuevosSet[index][campo] = Math.max(0, valor);
    setSets(nuevosSet);
  };

  const calcularSetsGanados = () => {
    let setsLocal = 0;
    let setsVisitante = 0;

    sets.forEach(set => {
      if (set.local > set.visitante) {
        setsLocal++;
      } else if (set.visitante > set.local) {
        setsVisitante++;
      }
    });

    return { setsLocal, setsVisitante };
  };

  const handleGuardar = () => {
    const { setsLocal, setsVisitante } = calcularSetsGanados();
    
    // Validaciones
    if (sets.some(set => set.local === set.visitante)) {
      alert('No puede haber sets empatados en voleibol');
      return;
    }

    if (setsLocal === setsVisitante) {
      alert('No puede haber empate en sets ganados');
      return;
    }

    const data: SubirResultadoRequest = {
      setsEquipoLocal: setsLocal,
      setsEquipoVisitante: setsVisitante,
      detallesSets: sets,
      observaciones: observaciones.trim() || undefined
    };

    subirResultadoMutation.mutate(data);
  };

  const { setsLocal, setsVisitante } = calcularSetsGanados();
  const isValid = sets.length > 0 && !sets.some(set => set.local === set.visitante);

  if (!partido) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Subir Resultado del Partido"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header del partido */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">
                {partido.equipoLocal.nombre}
              </div>
              <div className="text-sm text-gray-500">Local</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600">{setsLocal}</div>
              <Trophy className="w-6 h-6 text-gray-400" />
              <div className="text-2xl font-bold text-red-600">{setsVisitante}</div>
            </div>

            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">
                {partido.equipoVisitante.nombre}
              </div>
              <div className="text-sm text-gray-500">Visitante</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Jornada {partido.jornada} - Vuelta {partido.vuelta}
          </div>
        </div>

        {/* Sets */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Resultado por Sets
            </h3>
            <button
              onClick={agregarSet}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar Set
            </button>
          </div>

          {sets.map((set, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Set {index + 1}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={set.local}
                    onChange={(e) => actualizarSet(index, 'local', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                    placeholder="0"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    value={set.visitante}
                    onChange={(e) => actualizarSet(index, 'visitante', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
              
              {sets.length > 1 && (
                <button
                  onClick={() => eliminarSet(index)}
                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observaciones (opcional)
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            placeholder="Comentarios sobre el partido..."
          />
        </div>

        {/* Validaciones */}
        {!isValid && (
          <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ No puede haber sets empatados en voleibol
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 mr-2 inline" />
            Cancelar
          </button>
          
          <button
            onClick={handleGuardar}
            disabled={!isValid || subirResultadoMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            {subirResultadoMutation.isPending ? 'Guardando...' : 'Guardar Resultado'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSubirResultado;
