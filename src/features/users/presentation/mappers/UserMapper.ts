import { UserDto } from "@/features/users/application/dtos/UserDto";
import { UserViewModel } from "@/features/users/presentation/models/UserViewModel";

export class UserMapper {
  static viewToDto(viewModel: UserViewModel): UserDto {
    return {
      id: viewModel.id,
      email: viewModel.email,
      full_name: viewModel.full_name,
      first_name: viewModel.first_name,
      last_name: viewModel.last_name,
      role: viewModel.role,
      isBlocked: viewModel.isBlocked,
      percentageCommission: viewModel.percentageCommission,
    };
  }

  static dtoToView(dto: UserDto): UserViewModel {
    return {
      id: dto.id ?? '',
      email: dto.email,
      full_name: dto.full_name ?? dto.fullName ?? '',
      first_name: dto.first_name ?? dto.firstName,
      last_name: dto.last_name ?? dto.lastName,
      role: dto.role,
      isBlocked: dto.isBlocked,
      percentageCommission: dto.percentageCommission,
    };
  }
}
