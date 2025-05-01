import { BodyPart } from '@/@domain/models/settings/carRepair/BodyPart';
import { BodyPartDto } from '@/@infrastructure/dtos/carRepair/BodyPartDto';

export class BodyPartMapper {
  static dtoToDomain(dto: BodyPartDto): BodyPart {
    return new BodyPart(dto.id ?? '', dto.name, dto.code, dto.color);
  }

  static domainToDto(domain: BodyPart): BodyPartDto {
    return {
      id: domain.id,
      name: domain.name,
      code: domain.code,
      color: domain.color,
    };
  }
}
