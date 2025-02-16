import { BodyPartDto } from "@/@domain/dtos/BodyPartDto";
import { BodyPart } from "@/@domain/entities/carRepair/BodyPart";

export class DomainMapper {
  static domainToView(dto: BodyPartDto): BodyPart {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
      color: dto.color,
    };
  }

  static viewToDomain(entity: BodyPart): BodyPartDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      color: entity.color,
    };
  }
}