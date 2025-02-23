// src/@infrastructure/mappers/BodyPartMapper.ts
import { BodyPartDto } from '@/@application/dtos/carRepair/BodyPartDto';
import { BodyPartApiModel } from '@/@infrastructure/database/api/carRepair/BodyPartApiModel';

export class BodyPartMapper {
  static apiToDto(apiModel: BodyPartApiModel): BodyPartDto {
    return {
      id: apiModel.id,
      name: apiModel.name,
      code: apiModel.code,
      color: apiModel.color ?? undefined,
    };
  }

  static dtoToApi(dto: BodyPartDto): BodyPartApiModel {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
      color: dto.color ?? null,
    };
  }
}