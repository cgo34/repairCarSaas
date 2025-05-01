import { BodyMaterial } from '@/@domain/models/settings/carRepair/BodyMaterial';
import { BodyMaterialDto } from '@/@infrastructure/dtos/carRepair/BodyMaterialDto';

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
