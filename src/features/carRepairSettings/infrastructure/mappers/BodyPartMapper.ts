// src/@infrastructure/mappers/BodyPartMapper.ts
import { BodyPartApiModel } from '@/features/carRepairSettings/infrastructure/api/BodyPartApiModel';
import { BodyPartDto } from '@/features/carRepairSettings/application/dtos/BodyPartDto';

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
      id: dto.id ?? undefined,
      name: dto.name,
      code: dto.code,
      color: dto.color ?? undefined,
    };
  }
}