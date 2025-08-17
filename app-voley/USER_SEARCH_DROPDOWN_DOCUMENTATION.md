# UserSearchDropdown - Documentación

## Descripción

`UserSearchDropdown` es un componente reutilizable que permite buscar usuarios de manera dinámica mediante un input con dropdown. Ideal para formularios donde necesitas seleccionar usuarios específicos.

## Características

- **Búsqueda en tiempo real**: Realiza la búsqueda conforme el usuario escribe (con debounce de 300ms)
- **Filtrado por rol**: Permite filtrar usuarios por un rol específico
- **Exclusión de usuarios**: Puede excluir usuarios específicos de los resultados
- **Usuarios seleccionados**: Muestra visualmente los usuarios ya seleccionados
- **Estado de carga**: Indica cuando se está realizando la búsqueda
- **Accesibilidad**: Manejo de clicks fuera del componente para cerrar el dropdown

## Props

```typescript
interface UserSearchDropdownProps {
  onUserSelect: (user: Usuario) => void;        // Callback cuando se selecciona un usuario
  selectedUsers?: Usuario[];                    // Array de usuarios ya seleccionados
  placeholder?: string;                         // Placeholder del input
  disabled?: boolean;                          // Deshabilitar el componente
  className?: string;                          // Clases CSS adicionales
  clearOnSelect?: boolean;                     // Limpiar input al seleccionar (default: true)
  filterRole?: string;                         // Filtrar por rol específico
  excludeUserIds?: number[];                   // IDs de usuarios a excluir
}
```

## Ejemplos de Uso

### 1. Uso Básico

```tsx
import { UserSearchDropdown } from '../../../common/components/UserSearchDropdown';
import { useState } from 'react';

const MyComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState<Usuario[]>([]);

  const handleUserSelect = (user: Usuario) => {
    setSelectedUsers(prev => [...prev, user]);
  };

  return (
    <UserSearchDropdown
      onUserSelect={handleUserSelect}
      selectedUsers={selectedUsers}
      placeholder="Buscar usuarios..."
    />
  );
};
```

### 2. Filtrar por Rol (Capitanes)

```tsx
const CapitanesSelector = () => {
  const [capitanes, setCapitanes] = useState<Usuario[]>([]);

  const handleAddCapitan = (user: Usuario) => {
    setCapitanes(prev => [...prev, user]);
  };

  return (
    <UserSearchDropdown
      onUserSelect={handleAddCapitan}
      selectedUsers={capitanes}
      filterRole="capitan"
      placeholder="Buscar capitanes..."
    />
  );
};
```

### 3. Excluir Usuarios Específicos

```tsx
const TeamMemberSelector = () => {
  const [teamMembers, setTeamMembers] = useState<Usuario[]>([]);
  const existingMemberIds = [1, 2, 3]; // IDs de miembros ya en el equipo

  const handleAddMember = (user: Usuario) => {
    setTeamMembers(prev => [...prev, user]);
  };

  return (
    <UserSearchDropdown
      onUserSelect={handleAddMember}
      selectedUsers={teamMembers}
      excludeUserIds={existingMemberIds}
      placeholder="Buscar nuevos miembros..."
    />
  );
};
```

### 4. Uso Avanzado en Modal

```tsx
const AssignCaptainsModal = ({ ligaId, currentCaptains }) => {
  const [selectedCaptains, setSelectedCaptains] = useState<Usuario[]>([]);
  const currentCaptainIds = currentCaptains.map(cap => cap.id);

  const handleAddCaptain = (user: Usuario) => {
    if (!selectedCaptains.find(cap => cap.id === user.id)) {
      setSelectedCaptains(prev => [...prev, user]);
    }
  };

  const handleRemoveCaptain = (userId: number) => {
    setSelectedCaptains(prev => prev.filter(cap => cap.id !== userId));
  };

  const handleSave = async () => {
    // Lógica para guardar capitanes
    const response = await asignarCapitanes(ligaId, {
      capitanesIds: selectedCaptains.map(cap => cap.id)
    });
  };

  return (
    <Modal title="Asignar Capitanes">
      <div className="space-y-4">
        <UserSearchDropdown
          onUserSelect={handleAddCaptain}
          selectedUsers={selectedCaptains}
          filterRole="capitan"
          excludeUserIds={currentCaptainIds}
          placeholder="Buscar capitanes para asignar..."
        />
        
        {selectedCaptains.length > 0 && (
          <div>
            <h3>Capitanes a Asignar ({selectedCaptains.length})</h3>
            {selectedCaptains.map(captain => (
              <div key={captain.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{captain.nombre}</span>
                <button onClick={() => handleRemoveCaptain(captain.id)}>
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button onClick={handleSave} disabled={selectedCaptains.length === 0}>
          Asignar {selectedCaptains.length} Capitán{selectedCaptains.length > 1 ? 'es' : ''}
        </button>
      </div>
    </Modal>
  );
};
```

## Estados Visuales

### Usuario Seleccionado
Los usuarios ya seleccionados aparecen en el dropdown con:
- Fondo gris y cursor deshabilitado
- Icono de check verde
- Texto "Seleccionado"

### Carga
Durante la búsqueda se muestra un spinner en el lado derecho del input.

### Sin Resultados
Cuando no hay usuarios que coincidan con la búsqueda, se muestra el mensaje "No se encontraron usuarios".

### Error
Si ocurre un error durante la búsqueda, se muestra un mensaje de error en rojo.

## Integración con la API

El componente utiliza `UsuarioApiService.getUsuarios()` con los siguientes filtros:

```typescript
const filters = {
  search: searchTerm,    // Término de búsqueda
  limit: 10,             // Máximo 10 resultados
  page: 1,               // Primera página
  rol: filterRole        // Filtro por rol (opcional)
};
```

## Estilos

El componente está diseñado para funcionar con **Tailwind CSS** y soporta:
- Modo oscuro automático con `dark:` prefixes
- Estados hover, focus y disabled
- Responsive design
- Animaciones suaves

## Mejores Prácticas

1. **Debounce**: El componente incluye un debounce de 300ms para evitar muchas consultas
2. **Mínimo de caracteres**: Solo busca cuando se escriben 2+ caracteres
3. **Manejo de errores**: Incluye manejo básico de errores de red
4. **Accesibilidad**: Soporta navegación con teclado y focus management
5. **Performance**: Limita los resultados a 10 usuarios por búsqueda

## Dependencias

- React Hooks (useState, useEffect, useRef)
- Lucide React (íconos)
- UsuarioApiService (API de usuarios)
- Tipos de TypeScript (Usuario, ResponsePaginate)
