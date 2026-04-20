import { UserDto } from "@/@infrastructure/dtos/UserDto";
import { UserViewModel } from "@/@presentation/types/models/UserViewModel";

export class UserMapper {
  static viewToDto(viewModel: UserViewModel): UserDto {
    return {
      id: viewModel.id,
      email: viewModel.email,
      password: viewModel.password,
      fullName: viewModel.fullName,
      createdAt: viewModel.createdAt,
      role: viewModel.role as any, // cast si besoin
      subscription: undefined // à adapter si besoin
    };
  }

  static dtoToView(dto: UserDto): UserViewModel {
    return {
      id: dto.id ?? '',
      email: dto.email,
      password: '', // jamais exposé côté UI
      fullName: dto.fullName,
      createdAt: '', // à adapter si besoin
      role: dto.role
    };
  }
}
