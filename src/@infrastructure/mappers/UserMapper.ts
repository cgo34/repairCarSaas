import { UserDto } from '@/@infrastructure/database/dtos/supabase/SupabaseUserDto';
import { User } from '@domain/entities/User';
import { RoleMapper } from './RoleMapper';

export class UserMapper {
  static toDomain(dto: UserDto): User {
    if (!dto) throw new Error('Invalid DTO');
    
    return {
      id: dto.id,
      email: dto.email,
      // firstName: dto.user_metadata?.firstName,
      // lastName: dto.user_metadata?.lastName,
      role: RoleMapper.toDomain(dto.role),
      createdAt: new Date(dto.created_at)
    };
  }

  // Optionnel : si besoin de transformer vers DTO
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      user_metadata: {
        // firstName: user.firstName,
        // lastName: user.lastName
      },
      role: RoleMapper.toDto(user.role),
      created_at: user.createdAt.toISOString()
    };
  }
}