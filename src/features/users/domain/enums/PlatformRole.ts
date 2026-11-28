// Global platform authorization, independent of any organization.
// Never mix with OrganizationRole (admin | manager | technician).
export const platformRoles = ['user', 'super_admin'] as const;

export type PlatformRole = typeof platformRoles[number];

export const PLATFORM_ROLES = {
  USER: 'user' as PlatformRole,
  SUPER_ADMIN: 'super_admin' as PlatformRole,
} as const;
