// src/@infrastructure/mappers/BodyMaterialMapper.ts
import { BodyMaterialApiModel } from '@/features/carRepairSettings/infrastructure/api/BodyMaterialApiModel';
import { BodyMaterialDto } from '@/features/carRepairSettings/application/dtos/BodyMaterialDto';

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