import type { ColorVariant } from './types';

// Paleta de colores para componentes
export const colorVariants: Record<ColorVariant, {
  bg: string;
  bgDark: string;
  text: string;
  textDark: string;
  border: string;
  borderDark: string;
  hover: string;
  hoverDark: string;
}> = {
  blue: {
    bg: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
    text: 'text-blue-700',
    textDark: 'dark:text-blue-300',
    border: 'border-blue-200',
    borderDark: 'dark:border-blue-700',
    hover: 'hover:bg-blue-100',
    hoverDark: 'dark:hover:bg-blue-800/30',
  },
  green: {
    bg: 'bg-green-50',
    bgDark: 'dark:bg-green-900/20',
    text: 'text-green-700',
    textDark: 'dark:text-green-300',
    border: 'border-green-200',
    borderDark: 'dark:border-green-700',
    hover: 'hover:bg-green-100',
    hoverDark: 'dark:hover:bg-green-800/30',
  },
  purple: {
    bg: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900/20',
    text: 'text-purple-700',
    textDark: 'dark:text-purple-300',
    border: 'border-purple-200',
    borderDark: 'dark:border-purple-700',
    hover: 'hover:bg-purple-100',
    hoverDark: 'dark:hover:bg-purple-800/30',
  },
  orange: {
    bg: 'bg-orange-50',
    bgDark: 'dark:bg-orange-900/20',
    text: 'text-orange-700',
    textDark: 'dark:text-orange-300',
    border: 'border-orange-200',
    borderDark: 'dark:border-orange-700',
    hover: 'hover:bg-orange-100',
    hoverDark: 'dark:hover:bg-orange-800/30',
  },
  red: {
    bg: 'bg-red-50',
    bgDark: 'dark:bg-red-900/20',
    text: 'text-red-700',
    textDark: 'dark:text-red-300',
    border: 'border-red-200',
    borderDark: 'dark:border-red-700',
    hover: 'hover:bg-red-100',
    hoverDark: 'dark:hover:bg-red-800/30',
  },
  yellow: {
    bg: 'bg-yellow-50',
    bgDark: 'dark:bg-yellow-900/20',
    text: 'text-yellow-700',
    textDark: 'dark:text-yellow-300',
    border: 'border-yellow-200',
    borderDark: 'dark:border-yellow-700',
    hover: 'hover:bg-yellow-100',
    hoverDark: 'dark:hover:bg-yellow-800/30',
  },
  gray: {
    bg: 'bg-gray-50',
    bgDark: 'dark:bg-gray-800',
    text: 'text-gray-700',
    textDark: 'dark:text-gray-300',
    border: 'border-gray-200',
    borderDark: 'dark:border-gray-600',
    hover: 'hover:bg-gray-100',
    hoverDark: 'dark:hover:bg-gray-700',
  },
  indigo: {
    bg: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-900/20',
    text: 'text-indigo-700',
    textDark: 'dark:text-indigo-300',
    border: 'border-indigo-200',
    borderDark: 'dark:border-indigo-700',
    hover: 'hover:bg-indigo-100',
    hoverDark: 'dark:hover:bg-indigo-800/30',
  },
  pink: {
    bg: 'bg-pink-50',
    bgDark: 'dark:bg-pink-900/20',
    text: 'text-pink-700',
    textDark: 'dark:text-pink-300',
    border: 'border-pink-200',
    borderDark: 'dark:border-pink-700',
    hover: 'hover:bg-pink-100',
    hoverDark: 'dark:hover:bg-pink-800/30',
  },
};

// Función helper para obtener clases de color
export const getColorClasses = (color: ColorVariant) => {
  const variant = colorVariants[color];
  return {
    background: `${variant.bg} ${variant.bgDark}`,
    text: `${variant.text} ${variant.textDark}`,
    border: `${variant.border} ${variant.borderDark}`,
    hover: `${variant.hover} ${variant.hoverDark}`,
  };
};
