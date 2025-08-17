# Funcionalidad de Crear Capitanes desde Modal de Asignación

## 📋 Descripción

Se ha implementado la capacidad de **crear nuevos usuarios con rol de capitán** directamente desde el modal de "Asignar Capitanes" en la página de detalles de liga, sin necesidad de salir de la vista actual.

## 🚀 Funcionalidades Implementadas

### 1. **Botón de Toggle para Crear Usuario**
- Ubicado en la parte superior derecha del modal
- Permite alternar entre búsqueda de capitanes existentes y creación de nuevos
- Texto dinámico: "Crear Nuevo Capitán" / "Cancelar"

### 2. **Formulario de Creación de Capitán**
- **Campos requeridos**:
  - Nombre completo (mínimo 1 carácter)
  - Correo electrónico (validación de formato)
  - Contraseña (mínimo 6 caracteres)
- **Rol automático**: Se asigna automáticamente "Capitán"
- **Validación en tiempo real** con mensajes de error

### 3. **Integración Fluida**
- El usuario creado se agrega automáticamente a la lista de selección
- Se cierra el formulario después de crear exitosamente
- Los estados de carga muestran "Creando..." durante el proceso

## 🎯 Flujo de Uso

### Crear y Asignar Nuevo Capitán

1. **Abrir modal**: Click en "Asignar Capitanes" desde la página de liga
2. **Activar creación**: Click en "Crear Nuevo Capitán"
3. **Llenar formulario**:
   - Nombre: "Juan Pérez"
   - Correo: "juan.perez@email.com"
   - Contraseña: "123456"
4. **Crear usuario**: Click en "Crear y Agregar"
5. **Usuario creado**: Aparece automáticamente en la lista de selección
6. **Asignar a liga**: Click en "Asignar X Capitán(es)"

### Estados del Modal

| Estado | Descripción | Elementos Visibles |
|--------|-------------|-------------------|
| **Búsqueda** | Modo por defecto | UserSearchDropdown + Botón "Crear Nuevo" |
| **Creación** | Formulario activo | Formulario + Botón "Cancelar" |
| **Cargando** | Creando usuario | Formulario deshabilitado + "Creando..." |

## 🔧 Implementación Técnica

### Hooks Utilizados
```typescript
// Gestión de formulario
const { register, handleSubmit, formState: { errors }, reset } = useForm({
  resolver: zodResolver(createCaptainSchema)
});

// Mutación para crear usuario
const createUsuarioMutation = useCreateUsuario();
```

### Estados Locales
```typescript
const [showCreateUserForm, setShowCreateUserForm] = useState(false);
const [selectedCapitanes, setSelectedCapitanes] = useState<Usuario[]>([]);
```

### Función de Creación
```typescript
const handleCreateCapitan = handleSubmit(async (data) => {
  const newUser = await createUsuarioMutation.mutateAsync({
    nombre: data.nombre,
    correo: data.correo,
    password: data.password,
    rol: UserRolesEnum.CAPITAN
  });
  
  handleAddCapitan(newUser); // Agregar a selección
  resetUserForm();           // Limpiar formulario
  setShowCreateUserForm(false); // Cerrar formulario
});
```

## 🎨 Elementos de UI

### Botón Toggle
```tsx
<button
  onClick={handleToggleCreateUserForm}
  className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
>
  <Plus className="w-3 h-3 mr-1" />
  {showCreateUserForm ? 'Cancelar' : 'Crear Nuevo Capitán'}
</button>
```

### Formulario con Validación
- **Estilos consistentes** con el resto de la aplicación
- **Estados de error** con mensajes descriptivos
- **Placeholder informativos** para cada campo
- **Indicador de rol** automático

### Información Visual del Rol
```tsx
<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
  <p className="text-sm text-blue-700 dark:text-blue-300">
    <strong>Rol:</strong> Capitán (asignado automáticamente)
  </p>
</div>
```

## 🛡️ Validaciones y Manejo de Errores

### Validación del Formulario
- **Zod Schema** para validación tipada
- **Mensajes de error** específicos por campo
- **Validación en tiempo real** durante la escritura

### Manejo de Errores de API
```typescript
try {
  const newUser = await createUsuarioMutation.mutateAsync(userData);
  // Éxito: agregar a selección
} catch (error) {
  console.error('Error al crear capitán:', error);
  alert('Error al crear el capitán');
}
```

### Estados de Carga
- **Botones deshabilitados** durante operaciones async
- **Texto dinámico** que indica el estado actual
- **Prevención de múltiples envíos** simultáneos

## 🔄 Sincronización de Estados

### Limpieza Automática
```typescript
const handleCloseCapitanesModal = () => {
  setSelectedCapitanes([]);      // Limpiar selección
  setShowCapitanesModal(false);  // Cerrar modal
  setShowCreateUserForm(false);  // Cerrar formulario
  resetUserForm();              // Limpiar inputs
};
```

### Integración con Lista Existente
- Los nuevos usuarios se integran seamlessly con el UserSearchDropdown
- La cache de TanStack Query se actualiza automáticamente
- No hay necesidad de recargar datos manualmente

## 📱 Responsive Design

El formulario mantiene la **responsividad** del modal:
- **Mobile**: Formulario apilado verticalmente
- **Tablet/Desktop**: Diseño optimizado con espaciado adecuado
- **Dark Mode**: Soporte completo para tema oscuro

## 🎯 Beneficios para el Usuario

1. **Flujo ininterrumpido**: No necesita salir de la página de liga
2. **Eficiencia**: Crear y asignar en un solo proceso
3. **Claridad**: El rol se asigna automáticamente, sin confusión
4. **Flexibilidad**: Puede alternar entre buscar existentes y crear nuevos
5. **Feedback inmediato**: El usuario creado aparece inmediatamente en la selección

## 🔮 Posibles Mejoras Futuras

1. **Validación de correo único** en tiempo real
2. **Generación automática de contraseñas** seguras
3. **Envío de credenciales por email** al usuario creado
4. **Bulk creation** para múltiples usuarios
5. **Template de usuarios** con datos pre-poblados

## 📝 Notas de Desarrollo

- **Compatible** con la arquitectura existente de módulos
- **Reutilizable** el patrón puede aplicarse a otros módulos
- **Tipado completo** con TypeScript
- **Hooks de TanStack Query** para manejo óptimo de estado
- **Accesibilidad** básica implementada (labels, focus management)
