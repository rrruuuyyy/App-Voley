// Tipos comunes para los componentes
export type ColorVariant = 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'orange' 
  | 'red' 
  | 'yellow' 
  | 'gray'
  | 'indigo'
  | 'pink';

export type SizeVariant = 'sm' | 'md' | 'lg';

export interface BaseComponentProps {
  className?: string;
}
