# Módulo CRUD de Usuarios - VoleyApp

## 📋 Descripción
Este módulo implementa la funcionalidad completa de CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de usuarios en VoleyApp. Está diseñado específicamente para el rol de **Administrador**.

## 🏗️ Arquitectura del Módulo

### Componentes Principales
```
src/pages/admin/
├── UserManagement.tsx          # Componente principal de gestión
└── components/
    ├── UserForm.tsx            # Formulario para crear/editar usuarios
    └── UserDeleteModal.tsx     # Modal de confirmación de eliminación
```

### API Endpoints Integrados
- `POST /usuario` - Crear usuario
- `GET /usuario` - Listar todos los usuarios
- `GET /usuario/:id` - Obtener usuario por ID
- `PATCH /usuario/:id` - Actualizar usuario
- `DELETE /usuario/:id` - Eliminar usuario
- `PUT /usuario/:userId/generate-qr` - Generar código QR

## 📝 Entity DTO Implementado

### CreateUserDto
```typescript
interface CreateUserDto {
  nombre: string;           // Nombre completo (requerido)
  correo: string;          // Email válido (requerido)
  password: string;        // Mínimo 6 caracteres (requerido)
  rol: 'administrador' | 'admin_liga' | 'capitan' | 'jugador'; // Rol (requerido)
  sucursalId?: number;     // ID de sede (opcional, requerido para admin_liga)
}
```

### UpdateUserDto
```typescript
interface UpdateUserDto {
  nombre?: string;         // Todos los campos opcionales para actualización
  correo?: string;
  password?: string;       // Si no se proporciona, mantiene la actual
  rol?: 'administrador' | 'admin_liga' | 'capitan' | 'jugador';
  sucursalId?: number;
}
```

## ✨ Funcionalidades Implementadas

### 1. **Listado de Usuarios** 📋
- Vista en tabla con información completa
- Búsqueda por nombre y correo
- Filtrado por rol
- Indicadores visuales de estado
- Paginación automática con scroll

### 2. **Crear Usuario** ➕
- Formulario modal con validaciones
- Campos obligatorios marcados
- Validación de email
- Generación automática de contraseña segura
- Asignación de sede para admin_liga

### 3. **Editar Usuario** ✏️
- Formulario pre-rellenado con datos actuales
- Contraseña opcional (mantiene actual si vacía)
- Cambio de rol dinámico
- Validaciones en tiempo real

### 4. **Eliminar Usuario** 🗑️
- Modal de confirmación con información detallada
- Advertencias especiales para roles administrativos
- Prevención de eliminación accidental
- Validación de permisos

### 5. **Funciones Adicionales** ⚡
- **Generar QR**: Botón para generar código QR único
- **Estados visuales**: Indicadores de activo/inactivo
- **Roles con colores**: Sistema visual de identificación
- **Gestión de sedes**: Asignación automática por rol

## 🎨 Interfaz de Usuario

### Diseño Responsivo
- ✅ Adaptable a móviles y tablets
- ✅ Sidebar integrado con navegación
- ✅ Modales centrados y accesibles
- ✅ Iconografía consistente con Lucide React

### Colores por Rol
- 🔴 **Administrador**: Rojo (máximo privilegio)
- 🔵 **Admin Liga**: Azul (gestión de competencias)
- 🟢 **Capitán**: Verde (liderazgo de equipo)
- ⚫ **Jugador**: Gris (usuario final)

### Estados Visuales
- **Activo**: ✅ Verde con icono UserCheck
- **Inactivo**: ❌ Rojo con icono UserX
- **Loading**: 🔄 Spinner animado
- **Error**: ⚠️ Mensajes contextuales

## 🔒 Seguridad y Validaciones

### Validaciones Frontend
- **Nombre**: Mínimo 2 caracteres, requerido
- **Email**: Formato válido, único
- **Contraseña**: Mínimo 6 caracteres (creación)
- **Rol**: Selección obligatoria
- **Sede**: Requerida solo para admin_liga

### Seguridad
- Tokens JWT automáticos en headers
- Manejo de expiración de sesión
- Validación de permisos por rol
- Sanitización de inputs

## 🚀 Uso del Módulo

### Navegación
1. Login como **administrador**
2. Sidebar → **Usuarios**
3. Acceso a `/admin/usuarios`

### Flujo de Trabajo Típico
1. **Ver usuarios** existentes en la tabla
2. **Filtrar/buscar** según necesidad
3. **Crear nuevo usuario** con el botón "+"
4. **Editar** haciendo clic en el icono de lápiz
5. **Generar QR** para login rápido
6. **Eliminar** con confirmación segura

## 🔧 Integración con Backend

### Headers HTTP
```typescript
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Manejo de Errores
- **401**: Redirección a login
- **403**: Mensaje de permisos insuficientes
- **400**: Validación de campos
- **500**: Error del servidor

## 📦 Dependencias Utilizadas

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "lucide-react": "^0.400.0",
  "axios": "^1.0.0",
  "tailwindcss": "^3.0.0"
}
```

## 🎯 Próximas Mejoras

- [ ] **Importación masiva** de usuarios desde CSV/Excel
- [ ] **Roles personalizados** más granulares
- [ ] **Historial de cambios** por usuario
- [ ] **Notificaciones** por email al crear usuarios
- [ ] **Filtros avanzados** (fecha registro, último login)
- [ ] **Exportación** de datos de usuarios

## 🐛 Troubleshooting

### Errores Comunes

**Error: No se pueden cargar usuarios**
- Verificar que el servidor backend esté corriendo
- Comprobar token de autenticación válido

**Error: No se puede crear usuario**
- Validar que el email no exista
- Verificar permisos de administrador

**Error: Sede requerida**
- Solo para rol `admin_liga`
- Crear sedes primero si no existen

### Logs para Debug
```javascript
// En la consola del navegador
localStorage.getItem('token')  // Ver token actual
localStorage.getItem('user')   // Ver usuario logueado
```

## 📞 Soporte
Para reportar bugs o sugerir mejoras, contactar al equipo de desarrollo de VoleyApp.

---
**VoleyApp** - Sistema completo de gestión deportiva 🏐
