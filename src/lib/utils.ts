import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn (Class Names): Utilidad central para fusionar clases de Tailwind CSS.
 * Combina 'clsx' para lógica condicional y 'twMerge' para eliminar conflictos de clases redundantes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
