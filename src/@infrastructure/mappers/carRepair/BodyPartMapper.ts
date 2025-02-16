// src/@infrastructure/mappers/BodyPartMapper.ts
import { BodyPart } from '@domain/entities/carRepair/BodyPart';
import { BodyPartDto } from '@infrastructure/database/dtos/carRepair/BodyPartDto';

export class BodyPartMapper {
  static toDomain(dto: BodyPartDto): BodyPart {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
      color: dto.color,
    };
  }

  static toDto(entity: BodyPart): BodyPartDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      color: entity.color,
    };
  }
}