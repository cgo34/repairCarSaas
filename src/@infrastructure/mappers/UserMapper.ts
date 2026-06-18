import { UserDto } from '@/@application/dtos/UserDto';
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
      firstName: api.first_name,
      lastName: api.last_name,
      subscription: api.subscription,
      percentageCommission: api.percentage_commission,
      isBlocked: api.is_blocked,
    };
  }

  static dtoToApi(dto: Partial<UserDto>): Partial<UserApiModel> {
    return {
      ...(dto.id !== undefined && { id: dto.id }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.fullName !== undefined && { full_name: dto.fullName }),
      ...(dto.firstName !== undefined && { first_name: dto.firstName }),
      ...(dto.lastName !== undefined && { last_name: dto.lastName }),
      ...(dto.percentageCommission !== undefined && { percentage_commission: dto.percentageCommission }),
      ...(dto.isBlocked !== undefined && { is_blocked: dto.isBlocked }),
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
      created_at: user.createdAt.toISOString()
    };
  }
}