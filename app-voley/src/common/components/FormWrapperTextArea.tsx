import type { TextareaHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import type { FieldValues, Path } from 'react-hook-form';

type FormWrapperTextAreaProps<TFieldValues> = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: keyof TFieldValues;
  label: string;
  required?: boolean;
  placeholder?: string;
  textHelp?: string;
  rows?: number;
};

export function FormWrapperTextArea<TFieldValues extends FieldValues>({
  name,
  label,
  required,
  placeholder = '',
  textHelp,
  rows = 3,
  disabled,
}: FormWrapperTextAreaProps<TFieldValues>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const fieldName = name as Path<TFieldValues>;
  const fieldError = errors[fieldName];
  const showTextHelp = textHelp && !fieldError;

  const registerOptions: any = {};
  
  if (required) {
    registerOptions.required = `${label} es requerido`;
  }

  // Validaciones adicionales para textarea
  registerOptions.validate = (val: any) => {
    if (!val && required) return `${label} es requerido`;
    if (val && typeof val === 'string') {
      if (val.length > 1000) return `${label} no puede tener más de 1000 caracteres`;
    }
    return true;
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <textarea
        id={fieldName}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        {...register(fieldName, registerOptions)}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none ${
          fieldError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
