# Implementación del servicio HTTP centralizado

## ¿Qué se hizo?

Se creó un servicio HTTP centralizado usando `httpRest.ts` que reemplaza todas las instancias dispersas de axios en el proyecto. Esto proporciona las siguientes ventajas:

## Ventajas de la centralización

1. **URL única**: Ahora solo hay que cambiar la URL del endpoint en un solo lugar (`httpRest.ts`)
2. **Manejo de errores centralizado**: Todas las peticiones HTTP manejan errores de manera uniforme usando `sonner`
3. **Token automático**: El token de autenticación se agrega automáticamente a todas las peticiones
4. **Notificaciones consistentes**: Los errores se muestran automáticamente al usuario

## Archivos modificados

### 1. Creado: `src/services/httpRest.ts`
- Servicio HTTP centralizado con métodos GET, POST, PATCH, PUT, DELETE
- Interceptor para agregar token automáticamente
- Manejo de errores con notificaciones usando sonner
- Configuración única de baseURL

### 2. Modificado: `src/services/api.ts`
- Reemplazadas todas las llamadas de axios por httpRest
- Eliminada configuración duplicada de axios

### 3. Modificados: APIs de módulos
- `src/pages/admin/modulos/usuarios/api/usuarioApi.ts`
- `src/pages/admin/modulos/sedes/api/sedeApi.ts`
- `src/pages/admin/modulos/ligas/api/ligaApi.ts`
- `src/pages/admin/modulos/equipos/api/equipoApi.ts`

### 4. Modificado: `src/App.tsx`
- Agregado el componente `<Toaster>` de sonner para mostrar notificaciones

## Instalación de dependencias

```bash
npm install sonner
```

## Manejo de errores

El servicio ahora maneja automáticamente los siguientes tipos de errores:

- **400 Bad Request**: Muestra el mensaje de error del servidor
- **401 Unauthorized**: Redirige al login y limpia el token
- **403 Forbidden**: Mensaje de permisos insuficientes
- **404 Not Found**: Recurso no encontrado
- **500+ Server Errors**: Error interno del servidor
- **Otros errores**: Mensaje genérico

## Ejemplo de uso

```typescript
import httpRest from './services/httpRest';

// GET request
const users = await httpRest.get<User[]>('/usuarios');

// POST request
const newUser = await httpRest.post<User>('/usuarios', {
  nombre: 'Juan',
  email: 'juan@example.com'
});

// PATCH request
const updatedUser = await httpRest.patch<User>('/usuarios/1', {
  nombre: 'Juan Carlos'
});

// DELETE request
await httpRest.delete('/usuarios/1');
```

## Configuración

Para cambiar la URL del backend, solo edita la línea en `httpRest.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000', // Cambiar aquí
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Testing

El servidor de desarrollo se ejecuta sin errores, confirmando que la migración fue exitosa.
