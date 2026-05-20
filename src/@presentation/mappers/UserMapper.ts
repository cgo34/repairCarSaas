import { UserDto } from "@/@application/dtos/UserDto";
import { UserViewModel } from "@/@presentation/types/models/UserViewModel";

export class UserMapper {
  static viewToDto(viewModel: UserViewModel): UserDto {
    return {
      id: viewModel.id,
      email: viewModel.email,
      full_name: viewModel.full_name,
      first_name: viewModel.first_name,
      last_name: viewModel.last_name,
    };
  }

  static dtoToView(dto: UserDto): UserViewModel {
    return {
      id: dto.id ?? '',
      email: dto.email,
      full_name: dto.full_name,
      first_name: dto.first_name,
      last_name: dto.last_name,
    };
  }
}
