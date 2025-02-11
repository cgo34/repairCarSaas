// Définition des valeurs possibles (en minuscules pour la DB)
export const userRoles = [
  'admin',
  'garage',
  'technician',
  'independant_technician',
  'user'
] as const;

// Type union
export type UserRole = typeof userRoles[number];

// Constantes pour l'utilisation dans le code (MAJUSCULES pour les clés)
export const USER_ROLES = {
  ADMIN: 'admin' as UserRole,
  GARAGE: 'garage' as UserRole,
  TECHNICIAN: 'technician' as UserRole,
  INDEPENDANT_TECHNICIAN: 'independant_technician' as UserRole,
  USER: 'user' as UserRole,
} as const;