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
      role: api.role,
      subscription: api.subscription,
      percentageCommission: api.percentage_commission,
    };
  }

  static dtoToApi(dto: Partial<UserDto>): Partial<UserApiModel> {
    return {
      ...(dto.id !== undefined && { id: dto.id }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.fullName !== undefined && { full_name: dto.fullName }),
      ...(dto.role !== undefined && { role: dto.role }),
      ...(dto.percentageCommission !== undefined && { percentage_commission: dto.percentageCommission }),
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