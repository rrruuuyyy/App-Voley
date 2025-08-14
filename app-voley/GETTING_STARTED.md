# 🚀 VoleyApp - Guía de Uso

## Aplicación Creada ✅

Tu aplicación de gestión de ligas de voleibol está **lista y funcionando**!

### 🌟 Lo que se ha implementado:

#### ✅ **Estructura Completa**
- **Vite + React + TypeScript** configurado
- **Tailwind CSS** para estilos profesionales  
- **React Router** con rutas protegidas por roles
- **Autenticación** con JWT y código QR
- **Servicios API** integrados con Axios

#### ✅ **Sistema de Roles Implementado**
- 👑 **Administrador**: Dashboard con estadísticas globales
- 🏆 **Admin Liga**: Dashboard para gestión de ligas  
- 👨‍✈️ **Capitán**: Preparado para gestión de equipos
- 🏐 **Jugador**: Preparado para vista de partidos

#### ✅ **Componentes Principales**
- **Layout responsivo** con sidebar dinámico
- **Login** con opciones email y código QR
- **Dashboards** específicos por rol
- **Rutas protegidas** automáticas
- **Manejo de errores** centralizado

---

## 🖥️ **Para ver la aplicación:**

### 1. Servidor ya ejecutándose:
```
http://localhost:5173/
```

### 2. Página de Login:
- **Email + Password**: Para administradores y admin liga
- **Código QR**: Para jugadores y capitanes (acceso rápido)

### 3. Dashboards por Rol:
- `/admin` - Panel del Administrador
- `/liga-admin` - Panel del Admin Liga  
- `/capitan` - Panel del Capitán (en desarrollo)
- `/jugador` - Panel del Jugador (en desarrollo)

---

## 🔧 **Próximos Pasos de Desarrollo:**

### 🚧 **Páginas Pendientes**
1. **Gestión de Sedes** (Administrador)
2. **Gestión de Usuarios** (Administrador)
3. **Crear/Editar Ligas** (Admin Liga)
4. **Gestión de Equipos** (Admin Liga)
5. **Panel Capitán** (Crear equipos, agregar jugadores)
6. **Panel Jugador** (Ver partidos, estadísticas)

### 🛠️ **Funcionalidades a Agregar**
- Formularios CRUD completos
- Tablas de posiciones en tiempo real
- Generación de fixtures automática (UI)
- Registro de resultados de partidos
- Estadísticas visuales con gráficos
- Sistema de notificaciones
- Exportación de datos (PDF, Excel)

---

## 🌐 **Integración con API Backend**

### ⚙️ **Configuración Actual:**
```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'http://localhost:3000', // ← Cambiar según tu backend
});
```

### 🔌 **Endpoints Configurados:**
- ✅ **Autenticación**: `/auth/login`, `/auth/login-sucursal`
- ✅ **Usuarios**: `/usuario/*` 
- ✅ **Sedes**: `/sede/*`
- ✅ **Ligas**: `/liga/*`
- ✅ **Equipos**: `/equipo/*`
- ✅ **Partidos**: `/partido/*`

---

## 💡 **Características Destacadas**

### 🎨 **Diseño Profesional**
- **Sidebar dinámico** que cambia según el rol del usuario
- **Cards de estadísticas** con iconos y colores distintivos
- **Responsive design** adaptable a móviles y tablets
- **Tema azul consistente** en toda la aplicación

### 🔐 **Seguridad Implementada**
- **Rutas protegidas** por rol automáticamente
- **Tokens JWT** con renovación automática
- **Interceptors** para manejo de errores de autenticación
- **Redirects automáticos** según permisos

### ⚡ **Performance Optimizada**
- **Lazy loading** de componentes
- **TypeScript** para detección temprana de errores
- **Build optimizado** con Vite
- **CSS purging** con Tailwind

---

## 📱 **Flujo de Usuario Típico**

### 1️⃣ **Admin General:**
1. Login con email/password
2. Ve dashboard con estadísticas globales  
3. Gestiona sedes y asigna admin_liga
4. Controla usuarios del sistema

### 2️⃣ **Admin Liga:**
1. Login con email/password
2. Ve dashboard con sus ligas
3. Crea nuevas ligas y asigna capitanes
4. Genera fixtures y gestiona partidos

### 3️⃣ **Capitán:**
1. Login con QR (acceso rápido)
2. Crea su equipo
3. Agrega jugadores escaneando QR
4. Gestiona roster del equipo

### 4️⃣ **Jugador:**
1. Login con QR (acceso rápido)
2. Ve sus próximos partidos
3. Consulta estadísticas personales
4. Accede a información del equipo

---

## 🎯 **¿Qué sigue?**

La aplicación está **lista para desarrollo continuo**. Puedes:

1. **Implementar las páginas pendientes** usando los componentes base
2. **Conectar con tu API backend** cambiando la URL en `api.ts`
3. **Agregar más funcionalidades** siguiendo la estructura existente
4. **Personalizar estilos** modificando el tema de Tailwind

---

**¡Tu aplicación VoleyApp está funcionando y lista para continuar el desarrollo! 🏐🚀**
