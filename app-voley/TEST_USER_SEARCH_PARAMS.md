# Verificación de Parámetros UserSearchDropdown

## Cambios Realizados

### 1. Estructura de Parámetros Corregida
**Antes:**
```typescript
const filters: any = {
  search: searchTerm,
  limit: 10,
  page: 1
};
```

**Después:**
```typescript
const filters: any = {
  page: 1,
  limit: 10,
  search: searchTerm,
  searchFields: searchFields, // ['nombre', 'correo'] por defecto
  orderBy: 'nombre',
  order: 'asc'
};
```

### 2. URL Generada Esperada
Con el término de búsqueda "patricia":
```
/usuario?page=1&limit=10&fields=nombre,correo&filter=patricia&orderBy=nombre&order=asc
```

### 3. Nueva Prop Agregada
```typescript
interface UserSearchDropdownProps {
  // ... otras props
  searchFields?: string[]; // Campos en los que buscar
}
```

### 4. Uso de la Prop
```tsx
<UserSearchDropdown 
  onUserSelect={handleUserSelect}
  searchFields={['nombre', 'correo', 'telefono']} // Opcional, por defecto ['nombre', 'correo']
  filterRole="capitan"
  excludeUserIds={[1, 2, 3]}
/>
```

## Verificación Manual

Para probar que funciona correctamente:

1. Abre la consola del navegador
2. Ve a Network tab
3. Escribe en el campo de búsqueda del UserSearchDropdown
4. Verifica que la URL generada tenga el formato correcto:
   - `page=1`
   - `limit=10`
   - `fields=nombre,correo` (o los campos especificados)
   - `filter={término_búsqueda}`
   - `orderBy=nombre`
   - `order=asc`

## Casos de Uso

### Búsqueda básica de capitanes
```tsx
<UserSearchDropdown 
  onUserSelect={handleAddCapitan}
  filterRole="capitan"
  placeholder="Buscar capitán..."
/>
```

### Búsqueda con campos personalizados
```tsx
<UserSearchDropdown 
  onUserSelect={handleAddUser}
  searchFields={['nombre', 'correo', 'telefono', 'documento']}
  placeholder="Buscar por nombre, email, teléfono o documento..."
/>
```

### Búsqueda excluyendo usuarios ya seleccionados
```tsx
<UserSearchDropdown 
  onUserSelect={handleAddUser}
  selectedUsers={selectedCapitanes}
  excludeUserIds={selectedCapitanes.map(u => u.id)}
  placeholder="Buscar nuevo capitán..."
/>
```
