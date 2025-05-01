import { DentRepairTypeViewDto } from '@/@application/dtos/settings/carRepair/DentRepairViewDto';
import { DentRepairTypeDto } from '@/@infrastructure/dtos/carRepair/DentRepairTypeDto';

export class RepairTypeMapper {
  static viewDtoToDto(viewDto: DentRepairTypeViewDto): DentRepairTypeDto {
    return {
      id: viewDto.id,
      name: viewDto.name,
      code: viewDto.code,
    }
  }

  static dtoToViewDto(dto: DentRepairTypeDto): DentRepairTypeViewDto {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
    };
  }
}
