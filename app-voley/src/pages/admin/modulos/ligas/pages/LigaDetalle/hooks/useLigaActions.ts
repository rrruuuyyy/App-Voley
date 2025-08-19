import { 
  useIniciarLiga,
  useFinalizarLiga
} from '../../../hooks/useLigaQueries';

export const useLigaActions = () => {
  // Mutations
  const iniciarLigaMutation = useIniciarLiga();
  const finalizarLigaMutation = useFinalizarLiga();

  // Handlers
  const handleIniciarLiga = async (ligaId: number) => {
    try {
      await iniciarLigaMutation.mutateAsync(ligaId);
    } catch (error) {
      console.error('Error al iniciar liga:', error);
    }
  };

  const handleFinalizarLiga = async (ligaId: number) => {
    if (window.confirm('¿Estás seguro de que quieres finalizar esta liga?')) {
      try {
        await finalizarLigaMutation.mutateAsync(ligaId);
      } catch (error) {
        console.error('Error al finalizar liga:', error);
      }
    }
  };

  return {
    iniciarLigaMutation,
    finalizarLigaMutation,
    handleIniciarLiga,
    handleFinalizarLiga,
  };
};
