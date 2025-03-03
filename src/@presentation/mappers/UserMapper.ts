import { UserDto } from "@/@application/dtos/UserDto";
import { UserViewModel } from "@/@presentation/types/models/UserViewModel";

export class UserMapper {
  static viewToDto(viewModel: UserViewModel): UserDto {
    return {
      id: viewModel.id,
      email: viewModel.email,
      password: viewModel.password,
      fullName: viewModel.fullName,
      createdAt: viewModel.createdAt,
    };
  }

  static dtoToView(dto: UserDto): UserViewModel {
    return {
      id: dto.id,
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      createdAt: dto.createdAt,
    };
  }
}
