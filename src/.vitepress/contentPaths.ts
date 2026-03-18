/**
 * contentPaths.ts
 * 
 * Centralized content routing constants to decouple URL structure from hardcoded paths.
 * Makes it easy to rename sections globally by changing values here.
 */

export const CONTENT_PATHS = {
  contenidos: '/contenidos/',
  ejercicios: '/ejercicios/',
  enunciados: '/enunciados/'
} as const;

export type ContentPathKey = keyof typeof CONTENT_PATHS;
