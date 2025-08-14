# VoleyApp Frontend - Copilot Instructions

## Proyecto
Aplicación web para gestión de ligas de voleibol con Vite + React + TypeScript + Tailwind CSS.

## Arquitectura
- **Frontend**: React 18 con TypeScript
- **Router**: React Router DOM con protección de rutas por roles
- **Estilos**: Tailwind CSS
- **Estado**: Context API para autenticación
- **HTTP**: Axios con interceptors para tokens JWT
- **Formularios**: React Hook Form + Zod

## Roles de Usuario
1. **administrador**: Gestión global del sistema
2. **admin_liga**: Gestión de ligas y competencias
3. **capitan**: Gestión de equipos y jugadores
4. **jugador**: Visualización de partidos y estadísticas

## Estructura de Rutas
- `/admin/*` - Administrador general
- `/liga-admin/*` - Administrador de liga
- `/capitan/*` - Capitán de equipo
- `/jugador/*` - Jugador

## API Backend
- URL base: http://localhost:3000
- Autenticación: JWT tokens
- Documentación completa disponible en archivos adjuntos

## Estados de Desarrollo
✅ **Completado**:
- Sistema de autenticación
- Router con protección por roles
- Dashboard administrador y admin liga
- Layout responsivo con sidebar
- Integración básica con API

🚧 **Pendiente**:
- Páginas específicas de gestión
- Dashboards de capitán y jugador
- Formularios CRUD completos
- Componentes de visualización de datos

## Directrices de Código
- Usar TypeScript estricto
- Componentes funcionales con hooks
- Tailwind para estilos
- Manejo de errores centralizado
- Rutas protegidas por rol
