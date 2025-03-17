import { GarageDto } from "@/@infrastructure/dtos/GarageDto";
import { GarageViewModel } from "../types/models/GarageViewModel";

export class GarageMapper {
  static viewToDto(viewModel: GarageViewModel): GarageDto {
    return {
      id: viewModel.id,
      userId: viewModel.userId,
      name: viewModel.name,
      code: viewModel.code,
      address: viewModel.address,
      zipCode: viewModel.zipCode,
      city: viewModel.city,
      phone: viewModel.phone,
      email: viewModel.email,
      percentageCommission: viewModel.percentageCommission
    };
  }

  static dtoToView(dto: GarageDto): GarageViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      name: dto.name,
      code: dto.code,
      address: dto.address,
      zipCode: dto.zipCode,
      city: dto.city,
      phone: dto.phone,
      email: dto.email,
      percentageCommission: dto.percentageCommission
    };
  }
}