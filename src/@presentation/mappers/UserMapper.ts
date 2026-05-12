import { UserDto } from "@/@application/dtos/UserDto";
import { UserViewModel } from "@/@presentation/types/models/UserViewModel";

export class UserMapper {
  static viewToDto(viewModel: UserViewModel): UserDto {
    return {
      id: viewModel.id,
      email: viewModel.email,
      fullName: viewModel.fullName,
      firstName: viewModel.firstName,
      lastName: viewModel.lastName,
      percentageCommission: viewModel.percentageCommission,
    };
  }

  static dtoToView(dto: UserDto): UserViewModel {
    console.log('Mapping UserDto to UserViewModel:', dto);
    return {
      id: dto.id ?? '',
      email: dto.email,
      fullName: dto.fullName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      percentageCommission: dto.percentageCommission,
    };
  }
}
