import { DentRepairTypeDto } from '@/features/carRepairSettings/application/dtos/DentRepairTypeDto';

export class RepairTypeMapper {
  static dtoToDomain(dto: DentRepairTypeDto): DentRepairTypeDto {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
    }
  }

  static domainToDto(domain: DentRepairTypeDto): DentRepairTypeDto {
    return {
      id: domain.id,
      name: domain.name,
      code: domain.code,
    };
  }
}
