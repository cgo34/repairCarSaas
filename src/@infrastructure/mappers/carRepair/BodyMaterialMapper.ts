// src/@infrastructure/mappers/BodyMaterialMapper.ts
import { BodyMaterialDto } from '@/@application/dtos/carRepair/BodyMaterialDto';
import { BodyMaterialApiModel } from '@/@infrastructure/database/api/carRepair/BodyMaterialApiModel';

export class BodyMaterialMapper {
  static apiToDto(apiModel: BodyMaterialApiModel): BodyMaterialDto {
    return {
      id: apiModel.id,
      name: apiModel.name,
      code: apiModel.code,
    };
  }

  static dtoToApi(dto: BodyMaterialDto): BodyMaterialApiModel {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
    };
  }
}