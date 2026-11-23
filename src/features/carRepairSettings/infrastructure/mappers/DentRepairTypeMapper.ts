// src/@infrastructure/mappers/DentRepairTypeMapper.ts
import { DentRepairTypeApiModel } from '@/features/carRepairSettings/infrastructure/api/DentRepairTypeApiModel';
import { DentRepairTypeDto } from '@/features/carRepairSettings/application/dtos/DentRepairTypeDto';

export class DentRepairTypeMapper {
  static apiToDto(apiModel: DentRepairTypeApiModel): DentRepairTypeDto {
    return {
      id: apiModel.id || undefined,
      name: apiModel.name,
      code: apiModel.code,
    };
  }

  static dtoToApi(dto: DentRepairTypeDto): DentRepairTypeApiModel {
    return {
      id: dto.id || undefined,
      name: dto.name,
      code: dto.code,
    };
  }
}