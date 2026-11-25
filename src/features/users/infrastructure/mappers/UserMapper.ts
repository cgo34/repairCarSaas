import { UserDto } from '@/features/users/application/dtos/UserDto';
import { UserApiModel } from '@/features/users/infrastructure/api/UserApiModel';

export class UserMapper {
  static apiToDto(api: UserApiModel): UserDto {
    if (!api) throw new Error('Invalid Api Model');

    return {
      id: api.id,
      email: api.email,
      fullName: api.full_name,
      phone: api.phone,
      firstName: api.first_name,
      lastName: api.last_name,
      subscription: api.subscription,
      percentageCommission: api.percentage_commission,
      isBlocked: api.is_blocked,
    };
  }

  static dtoToApiInsert(dto: UserDto): Partial<UserApiModel> & Pick<UserApiModel, 'id' | 'email'> {
    return {
      ...UserMapper.dtoToApi(dto),
      id: dto.id,
      email: dto.email,
    };
  }

  static dtoToApi(dto: Partial<UserDto>): Partial<UserApiModel> {
    return {
      ...(dto.id !== undefined && { id: dto.id }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.fullName !== undefined && { full_name: dto.fullName }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.firstName !== undefined && { first_name: dto.firstName }),
      ...(dto.lastName !== undefined && { last_name: dto.lastName }),
      ...(dto.percentageCommission !== undefined && { percentage_commission: dto.percentageCommission }),
      ...(dto.isBlocked !== undefined && { is_blocked: dto.isBlocked }),
    };
  }
}