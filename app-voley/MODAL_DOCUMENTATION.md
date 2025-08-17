# Componente Modal

El componente `Modal` es un componente reutilizable que proporciona una ventana modal con fondo con blur y soporte completo para modo oscuro.

## Características

- ✅ Fondo negro con blur y transparencia (`backdrop-blur-sm` + `bg-black/60`)
- ✅ Soporte completo para modo oscuro
- ✅ Diferentes tamaños configurables
- ✅ Bloqueo del scroll del body cuando está abierto
- ✅ Cierre con tecla Escape
- ✅ Cierre al hacer clic en el fondo (opcional)
- ✅ Botón de cierre en el header (opcional)
- ✅ Animaciones suaves
- ✅ Responsive design
- ✅ Accesibilidad incluida

## Props

| Prop | Tipo | Valor por defecto | Descripción |
|------|------|-------------------|-------------|
| `isOpen` | `boolean` | - | **Requerido.** Controla si el modal está visible |
| `onClose` | `() => void` | - | **Requerido.** Función llamada al cerrar el modal |
| `title` | `string` | `undefined` | Título del modal mostrado en el header |
| `subtitle` | `string` | `undefined` | Subtítulo mostrado debajo del título |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Tamaño del modal |
| `showCloseButton` | `boolean` | `true` | Mostrar botón X en el header |
| `closeOnBackdropClick` | `boolean` | `true` | Permitir cerrar haciendo clic en el fondo |
| `children` | `React.ReactNode` | - | **Requerido.** Contenido del modal |

## Tamaños Disponibles

- `sm`: `max-w-sm` (384px)
- `md`: `max-w-md` (448px) - **Por defecto**
- `lg`: `max-w-lg` (512px)
- `xl`: `max-w-xl` (576px)
- `full`: `max-w-4xl` (896px)

## Uso Básico

```tsx
import { Modal } from '../common/components/Modal';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Mi Modal"
  subtitle="Descripción del modal"
>
  <p>Contenido del modal aquí</p>
</Modal>
```

## Ejemplos de Uso

### Modal de Confirmación

```tsx
<Modal
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="Confirmar Acción"
  size="sm"
  showCloseButton={false}
  closeOnBackdropClick={false}
>
  <div className="space-y-4">
    <p>¿Estás seguro de realizar esta acción?</p>
    <div className="flex justify-end space-x-3">
      <button onClick={() => setConfirmOpen(false)}>
        Cancelar
      </button>
      <button onClick={handleConfirm}>
        Confirmar
      </button>
    </div>
  </div>
</Modal>
```

### Modal de Formulario

```tsx
<Modal
  isOpen={formOpen}
  onClose={() => setFormOpen(false)}
  title="Crear Usuario"
  subtitle="Completa los campos requeridos"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    {/* Campos del formulario */}
    <div className="flex justify-end space-x-3 mt-6">
      <button type="button" onClick={() => setFormOpen(false)}>
        Cancelar
      </button>
      <button type="submit">
        Guardar
      </button>
    </div>
  </form>
</Modal>
```

### Modal de Solo Lectura

```tsx
<Modal
  isOpen={infoOpen}
  onClose={() => setInfoOpen(false)}
  title="Información del Usuario"
  size="xl"
>
  <div className="space-y-4">
    {/* Información detallada */}
  </div>
</Modal>
```

## Características de Accesibilidad

- ✅ Cierre con tecla `Escape`
- ✅ Focus trap (el foco queda dentro del modal)
- ✅ Bloqueo del scroll del body
- ✅ Aria labels apropiados
- ✅ Navegación por teclado

## Estilos Incluidos

El modal incluye automáticamente:
- Fondo con blur: `backdrop-blur-sm`
- Transparencia: `bg-black/60`
- Sombras: `shadow-2xl`
- Bordes redondeados: `rounded-xl`
- Transiciones suaves
- Soporte completo para dark mode

## Integración con Formularios

El modal se integra perfectamente con React Hook Form y otros sistemas de formularios:

```tsx
const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cambiar Contraseña"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campos del formulario con register y validaciones */}
      </form>
    </Modal>
  );
};
```

Este componente modal está diseñado para ser la base de todos los modales en la aplicación, proporcionando consistencia visual y funcional.
