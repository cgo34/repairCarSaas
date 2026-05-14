import { GarageApiModel } from '@/@infrastructure/database/api/GarageApiModel';
import { GarageDto } from '@/@application/dtos/GarageDto';

export class GarageMapper {
  static apiToDto(apiModel: GarageApiModel): GarageDto {
    return {
      id: apiModel.id,
      organization_id: apiModel.organization_id,
      name: apiModel.name,
      code: apiModel.code,
      address: apiModel.address,
      zip_code: apiModel.zip_code,
      city: apiModel.city,
      phone: apiModel.phone,
      email: apiModel.email,
      archived_at: apiModel.archived_at,
    };
  }

  static dtoToApi(dto: GarageDto): GarageApiModel {
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
      archived_at: dto.archived_at,
    };
  }
}
