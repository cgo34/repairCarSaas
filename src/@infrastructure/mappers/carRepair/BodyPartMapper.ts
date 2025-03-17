// src/@infrastructure/mappers/BodyPartMapper.ts
import { BodyPartApiModel } from '@/@infrastructure/database/api/carRepair/BodyPartApiModel';
import { BodyPartDto } from '@/@infrastructure/dtos/carRepair/BodyPartDto';

export class BodyPartMapper {
  static apiToDto(apiModel: BodyPartApiModel): BodyPartDto {
    console.log('BodyPartMapper.apiToDto', apiModel);
    
    return {
      id: apiModel.id,
      name: apiModel.name,
      code: apiModel.code,
      color: apiModel.color ?? undefined,
    };
  }

  static dtoToApi(dto: BodyPartDto): BodyPartApiModel {
    return {
      id: dto.id ?? undefined,
      name: dto.name,
      code: dto.code,
      color: dto.color ?? undefined,
    };
  }
}