import type { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FieldValues, Path } from 'react-hook-form';

type FormWrapperInputProps<TFieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  name: keyof TFieldValues;
  label: string;
  required?: boolean;
  placeholder?: string;
  textHelp?: string;
  step?: string | number;
  classNameInput?: string;
};

export function FormWrapperInput<TFieldValues extends FieldValues>({
  name,
  label,
  required,
  type = 'text',
  placeholder = '',
  textHelp,
  step,
  classNameInput = '',
  disabled,
}: FormWrapperInputProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const fieldName = name as Path<TFieldValues>;
  const fieldError = errors[fieldName];
  const showTextHelp = textHelp && !fieldError;

  // Configurar opciones de registro según el tipo
  const registerOptions: any = {};
  
  if (required) {
    registerOptions.required = `${label} es requerido`;
  }
  
  if (type === 'number') {
    registerOptions.setValueAs = (value: string | number) => {
      if (value === '' || value === null || value === undefined) return undefined;
      if (typeof value === 'number') return value;
      const cleanValue = value.toString().replace(/[^\d.-]/g, '');
      if (cleanValue === '' || cleanValue === '-') return undefined;
      
      const numValue = parseFloat(cleanValue);
      return isNaN(numValue) ? undefined : numValue;
    };
    registerOptions.validate = (val: any) => {
      if (val === undefined || val === null || val === '') {
        return required ? `${label} es requerido` : true;
      }
      const numVal = typeof val === 'number' ? val : parseFloat(val);
      if (isNaN(numVal)) return `${label} debe ser un número válido`;
      return true;
    };
  }

  if (type === 'email') {
    registerOptions.pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: `${label} debe ser un email válido`
    };
  }

  if (type === 'date') {
    registerOptions.validate = (val: any) => {
      if (!val && required) return `${label} es requerido`;
      if (val) {
        const date = new Date(val);
        if (isNaN(date.getTime())) return `${label} debe ser una fecha válida`;
      }
      return true;
    };
  }

  return (
    <div className="mb-4 relative">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={fieldName}
        type={type}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        {...register(fieldName, registerOptions)}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
          fieldError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${classNameInput}`}
      />
      
      {fieldError && (
        <span className="absolute left-0 top-full mt-1 text-xs text-red-500 leading-tight">
          {fieldError.message as string}
        </span>
      )}
      
      {showTextHelp && (
        <span className="absolute left-0 top-full mt-1 text-xs text-gray-500 dark:text-gray-400 leading-tight">
          {textHelp}
        </span>
      )}
    </div>
  );
}
