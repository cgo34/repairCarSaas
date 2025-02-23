import { USER_ROLES, UserRole } from '@domain/enums/UserRole';

export class RoleMapper {
  static toDomain(role?: string): UserRole {
    if (!role) return USER_ROLES.USER;
    
    // Validation que le rôle existe
    const mappedRole = role as UserRole;
    if (!Object.values(USER_ROLES).includes(mappedRole)) {
      return USER_ROLES.USER;
    }
    
    return mappedRole;
  }

  // Optionnel : si besoin de transformer vers DTO
  static toDto(role: UserRole): string {
    return role;
  }
}