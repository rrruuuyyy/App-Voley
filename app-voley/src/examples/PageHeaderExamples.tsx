import React from 'react';
import { Plus, Download, Settings, RefreshCw } from 'lucide-react';
import { PageHeader, Card } from '../common';

/**
 * Ejemplos de uso del componente PageHeader
 * 
 * Este archivo muestra todas las variantes y configuraciones posibles
 * del componente PageHeader para mantener consistencia en toda la aplicación.
 */

const PageHeaderExamples: React.FC = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Ejemplo básico */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Ejemplo Básico</h2>
        <PageHeader 
          title="Página Simple"
          subtitle="Solo título y subtítulo con dark mode toggle"
        />
      </Card>

      {/* Con indicador de estado */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Con Indicador de Estado</h2>
        <PageHeader 
          title="Sistema de Monitoreo"
          subtitle="Estado del servidor en tiempo real"
          statusIndicator={{
            label: "Sistema Activo",
            color: "green",
            isActive: true
          }}
        />
      </Card>

      {/* Con botón de acción simple */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Con Botón de Acción</h2>
        <PageHeader 
          title="Gestión de Productos"
          subtitle="Administra el inventario de productos"
          actions={
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nuevo Producto</span>
            </button>
          }
        />
      </Card>

      {/* Con múltiples acciones */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Con Múltiples Acciones</h2>
        <PageHeader 
          title="Panel de Control"
          subtitle="Herramientas de administración avanzadas"
          actions={
            <>
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Actualizar</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configurar</span>
              </button>
            </>
          }
        />
      </Card>

      {/* Sin dark mode toggle */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Sin Dark Mode Toggle</h2>
        <PageHeader 
          title="Página Especial"
          subtitle="Cuando no necesitas el toggle de dark mode"
          showDarkModeToggle={false}
          actions={
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Acción Especial
            </button>
          }
        />
      </Card>

      {/* Con estado de advertencia */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Con Estado de Advertencia</h2>
        <PageHeader 
          title="Sistema en Mantenimiento"
          subtitle="Operaciones limitadas disponibles"
          statusIndicator={{
            label: "Mantenimiento Programado",
            color: "yellow",
            isActive: true
          }}
        />
      </Card>

      {/* Con estado de error */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Con Estado de Error</h2>
        <PageHeader 
          title="Servicio No Disponible"
          subtitle="Por favor, inténtalo más tarde"
          statusIndicator={{
            label: "Error de Conexión",
            color: "red",
            isActive: false
          }}
        />
      </Card>

      {/* Configuración completa */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Configuración Completa</h2>
        <PageHeader 
          title="Dashboard Avanzado"
          subtitle="Panel de control con todas las opciones disponibles"
          statusIndicator={{
            label: "Conectado",
            color: "blue",
            isActive: true
          }}
          actions={
            <>
              <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Crear</span>
              </button>
            </>
          }
        />
      </Card>
    </div>
  );
};

export default PageHeaderExamples;
