import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';

interface FormWrapperProps {
  onSubmit: SubmitHandler<any>;
  defaultValues?: any;
  children: (methods: UseFormReturn<any>) => React.ReactNode;
  className?: string;
  renderAsDiv?: boolean;
  // Opciones adicionales para validación
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export function FormWrapper({
  onSubmit,
  defaultValues,
  children,
  className,
  renderAsDiv = false,
  mode = 'onSubmit',
}: FormWrapperProps) {
  const methods = useForm({
    defaultValues,
    mode,
  });

  // Si es una sección anidada, renderizar como div
  if (renderAsDiv) {
    return (
      <FormProvider {...methods}>
        <div className={'space-y-4 ' + (className || '')}>
          {children(methods)}
        </div>
      </FormProvider>
    );
  }

  // Renderizado normal como form
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className={'space-y-4 ' + (className || '')}>
          {children(methods)}
        </div>
      </form>
    </FormProvider>
  );
}

// Componente para secciones de formulario
export function FormSection({
  defaultValues,
  children,
  className,
}: Omit<FormWrapperProps, 'onSubmit' | 'renderAsDiv' | 'mode'>) {
  return (
    <FormWrapper
      onSubmit={() => {}} // No-op para secciones
      defaultValues={defaultValues}
      className={className}
      renderAsDiv={true}
    >
      {children}
    </FormWrapper>
  );
}
