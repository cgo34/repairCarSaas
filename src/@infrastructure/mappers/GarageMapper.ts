import { GarageDto } from '@/@application/dtos/GarageDto';
import { GarageApiModel } from '@/@infrastructure/database/api/GarageApiModel';

export class GarageMapper {
  static apiToDto(apiModel: GarageApiModel): GarageDto {
    return {
      id: apiModel.id,
      userId: apiModel.user_id,
      name: apiModel.name,
      address: apiModel.address,
      zipCode: apiModel.zip_code,
      city: apiModel.city,
      phone: apiModel.phone,
      email: apiModel.email,
      percentageCommission: apiModel.percentage_commission
    };
  }

  static dtoToApi(dto: GarageDto): GarageApiModel {
    return {
      id: dto.id,
      user_id: dto.userId,
      name: dto.name,
      address: dto.address,
      zip_code: dto.zipCode,
      city: dto.city,
      phone: dto.phone,
      email: dto.email,
      percentage_commission: dto.percentageCommission
    };
  }
}
