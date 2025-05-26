import { UserDto } from '@/@infrastructure/dtos/UserDto';
import { User } from '@domain/entities/User';
import { UserApiModel } from '../database/api/UserApiModel';
import { RoleMapper } from './RoleMapper';

export class UserMapper {
  static apiToDto(api: UserApiModel): UserDto {
    if (!api) throw new Error('Invalid Api Model');
    
    return {
      id: api.id,
      email: api.email,
      fullName: api.full_name,
      // firstName: dto.user_metadata?.firstName,
      // lastName: dto.user_metadata?.lastName,
      role: api.role,
      subscription: api.subscription
    };
  }

  static dtoToApi(dto: UserDto): UserApiModel {
    return {
      id: dto.id,
      email: dto.email,
      full_name: dto.fullName,
      // user_metadata: {
      //   firstName: user.firstName,
      //   lastName: user.lastName
      // },
      role: dto.role,
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