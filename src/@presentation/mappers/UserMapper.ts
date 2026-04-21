import { UserDto } from "@/@application/dtos/UserDto";
import { UserViewModel } from "@/@presentation/types/models/UserViewModel";

export class UserMapper {
  static viewToDto(viewModel: UserViewModel): UserDto {
    return {
      id: viewModel.id,
      email: viewModel.email,
      fullName: viewModel.fullName,
      role: viewModel.role as UserDto['role'],
      percentageCommission: viewModel.percentageCommission,
    };
  }

  static dtoToView(dto: UserDto): UserViewModel {
    return {
      id: dto.id ?? '',
      email: dto.email,
      fullName: dto.fullName,
      role: dto.role,
      percentageCommission: dto.percentageCommission,
    };
  }
}
