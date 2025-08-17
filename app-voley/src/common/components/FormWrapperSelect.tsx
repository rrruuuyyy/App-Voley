import { useFormContext } from 'react-hook-form';
import type { FieldValues, Path } from 'react-hook-form';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormWrapperSelectProps<TFieldValues> {
  name: keyof TFieldValues;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  textHelp?: string;
  isNumber?: boolean;
}

export function FormWrapperSelect<TFieldValues extends FieldValues>({
  name,
  label,
  options,
  placeholder = 'Seleccione una opción',
  required,
  disabled = false,
  textHelp,
  isNumber = false
}: FormWrapperSelectProps<TFieldValues>) {
  const {
    register,
    formState: { errors }
  } = useFormContext<TFieldValues>();

  const fieldName = name as Path<TFieldValues>;
  const fieldError = errors[fieldName];
  const showTextHelp = textHelp && !fieldError;

  const registerOptions: any = {};
  
  if (required) {
    registerOptions.required = `${label} es requerido`;
  }

  if (isNumber) {
    registerOptions.setValueAs = (value: string) => {
      if (value === "" || value === null || value === undefined) return undefined;
      const numValue = Number(value);
      return isNaN(numValue) ? undefined : numValue;
    };
    registerOptions.validate = (val: any) => {
      if (val === undefined || val === null || val === '') {
        return required ? `${label} es requerido` : true;
      }
      if (typeof val === 'string' && val !== '') {
        const numVal = Number(val);
        if (isNaN(numVal)) return `${label} debe ser un número válido`;
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
      
      <select
        id={fieldName}
        {...register(fieldName, registerOptions)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
          fieldError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
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
