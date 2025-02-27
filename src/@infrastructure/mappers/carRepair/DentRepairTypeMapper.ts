// src/@infrastructure/mappers/DentRepairTypeMapper.ts
import { DentRepairTypeDto } from '@/@application/dtos/carRepair/DentRepairTypeDto';
import { DentRepairTypeApiModel } from '@/@infrastructure/database/api/carRepair/DentRepairTypeApiModel';

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