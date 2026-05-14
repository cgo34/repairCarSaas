import { GarageDto } from "@/@application/dtos/GarageDto";
import { GarageViewModel } from "../types/models/GarageViewModel";

export class GarageMapper {
  static viewToDto(viewModel: GarageViewModel): GarageDto {
    return {
      id: viewModel.id,
      organization_id: viewModel.organization_id,
      name: viewModel.name,
      code: viewModel.name.toLowerCase().replace(/\s+/g, '-'),
      address: viewModel.address,
      zip_code: viewModel.zip_code,
      city: viewModel.city,
      phone: viewModel.phone,
      email: viewModel.email,
      archived_at: viewModel.archived_at ?? null,
    };
  }

  static dtoToView(dto: GarageDto): GarageViewModel {
    return {
      id: dto.id,
      organization_id: dto.organization_id,
      name: dto.name,
      code: dto.code,
      address: dto.address,
      zip_code: dto.zip_code,
      city: dto.city,
      phone: dto.phone,
      email: dto.email,
      archived_at: dto.archived_at ?? null,
    };
  }
}