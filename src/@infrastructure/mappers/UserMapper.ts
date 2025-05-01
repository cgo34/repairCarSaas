import { UserDto } from '@/@infrastructure/dtos/UserDto';
import { User } from '@domain/entities/User';
import { UserApiModel } from '../database/api/UserApiModel';
import { RoleMapper } from './RoleMapper';

export class UserMapper {
  static apiToDto(dto: UserApiModel): UserDto {
    if (!dto) throw new Error('Invalid DTO');
    
    return {
      id: dto.id,
      email: dto.email,
      fullName: dto.full_name,
      // firstName: dto.user_metadata?.firstName,
      // lastName: dto.user_metadata?.lastName,
      // role: RoleMapper.toDomain(dto.role),
      createdAt: new Date(dto.created_at)
    };
  }

  static dtoToApi(user: UserDto): UserApiModel {
    return {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      // user_metadata: {
      //   firstName: user.firstName,
      //   lastName: user.lastName
      // },
      // role: RoleMapper.toDto(user.role),
      created_at: user.createdAt.toISOString()
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