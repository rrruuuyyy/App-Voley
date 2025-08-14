# VoleyApp - Frontend

Aplicación web para gestión de ligas de voleibol construida con **Vite + React + TypeScript**.

## 🏐 Características

- **Gestión de Roles**: Administrador, Admin Liga, Capitán y Jugador
- **Autenticación**: Login con email/password y código QR
- **Dashboard Intuitivo**: Interfaz específica para cada rol
- **Responsive Design**: Diseño adaptable con Tailwind CSS
- **Sistema Round-Robin**: Generación automática de fixtures
- **Gestión Completa**: Sedes, ligas, equipos, jugadores y partidos

## 🚀 Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router DOM
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Iconos**: Lucide React

## 📋 Roles y Funcionalidades

### 👑 Administrador
- Crear y gestionar sedes
- Asignar roles de administrador de liga
- Vista general del sistema
- Gestión de usuarios

### 🏆 Admin Liga
- Crear y gestionar ligas
- Asignar capitanes a equipos
- Generar fixtures automáticos
- Iniciar y finalizar ligas
- Ver estadísticas de competiciones

### 👨‍✈️ Capitán
- Crear equipos
- Agregar jugadores mediante QR
- Gestionar roster del equipo

### 🏐 Jugador
- Ver partidos programados
- Consultar estadísticas personales
- Login rápido con código QR

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- API Backend funcionando (puerto 3000)

### Instalación
```bash
# Clonar repositorio
git clone <repo-url>
cd app-voley

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de build
npm run lint     # Linter de código
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con sidebar
│   ├── Sidebar.tsx     # Navegación lateral
│   └── ProtectedRoute.tsx # Rutas protegidas por rol
├── contexts/           # Contextos de React
│   └── AuthContext.tsx # Manejo de autenticación
├── pages/              # Páginas por rol
│   ├── admin/          # Dashboard y páginas de administrador
│   ├── liga-admin/     # Dashboard y páginas de admin liga
│   ├── capitan/        # Dashboard y páginas de capitán
│   └── jugador/        # Dashboard y páginas de jugador
├── services/           # Servicios de API
│   └── api.ts          # Cliente HTTP y endpoints
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts        # Interfaces y tipos
└── App.tsx             # Router principal
```

## 🎨 Diseño

La aplicación utiliza un **sistema de roles dinámico** donde cada usuario ve un sidebar y dashboard específico según su rol:

- **Color azul**: Tema principal
- **Sidebar lateral**: Navegación fija con indicador de rol
- **Dashboard cards**: Estadísticas visuales por rol
- **Responsive**: Adaptable a móviles y tablets

## 🔗 Integración con API

La aplicación se conecta automáticamente con la API de backend en `http://localhost:3000`.

### Configuración de API
Editar `src/services/api.ts` para cambiar la URL base:

```typescript
const api = axios.create({
  baseURL: 'http://tu-api-url:puerto',
});
```

### Autenticación
- Tokens JWT almacenados en localStorage
- Renovación automática en interceptors
- Redirección automática al expirar

## 📱 Funcionalidades Implementadas

### ✅ Completadas
- [x] Sistema de autenticación (email + QR)
- [x] Router con protección por roles  
- [x] Dashboard de administrador
- [x] Dashboard de admin liga
- [x] Sidebar dinámico por rol
- [x] Servicios de API integrados
- [x] Layout responsive

### 🚧 En Desarrollo
- [ ] Gestión de sedes (Admin)
- [ ] Gestión de usuarios (Admin)
- [ ] Creación de ligas (Admin Liga)
- [ ] Gestión de equipos (Admin Liga)
- [ ] Dashboard de capitán
- [ ] Dashboard de jugador

## 🔐 Sistema de Roles

### Flujo de Trabajo Típico:
1. **Admin** crea sedes y asigna admin_liga
2. **Admin Liga** crea liga y asigna capitanes  
3. **Capitanes** crean equipos y agregan jugadores
4. **Admin Liga** genera fixture: POST /partido/generate-fixtures/{ligaId}
5. Se registran resultados y se consulta tabla automáticamente

### Permisos por Pantalla:
- `/admin/*` - Solo administrador
- `/liga-admin/*` - Solo admin_liga
- `/capitan/*` - Solo capitán
- `/jugador/*` - Solo jugador

## 📞 Soporte

Para preguntas sobre la implementación del algoritmo round-robin o sistema de puntos, consultar:
- `API_DOCUMENTATION.md` - Documentación completa de la API
- `EJEMPLOS_FRONTEND.md` - Ejemplos prácticos de uso
- `ROUND_ROBIN_ALGORITHM.md` - Implementación técnica del algoritmo

---

**VoleyApp** - Gestión profesional de ligas de voleibol 🏐
