import { BodyMaterial } from '@/features/carRepairSettings/domain/entities/BodyMaterial';
import { BodyMaterialDto } from '@/features/carRepairSettings/application/dtos/BodyMaterialDto';

export class BodyMaterialMapper {
  static dtoToDomain(dto: BodyMaterialDto): BodyMaterial {
    return new BodyMaterial(dto.id ?? '', dto.name, dto.code);
  }

  static domainToDto(domain: BodyMaterial): BodyMaterialDto {
    return {
      id: domain.id,
      name: domain.name,
      code: domain.code,
    };
  }
}
