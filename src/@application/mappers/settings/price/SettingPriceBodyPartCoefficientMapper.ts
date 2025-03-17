import { BodyPartMapper } from '@/@application/mappers/settings/carRepair/BodyPartMapper';
import { SettingPriceBodyPartCoefficient } from '@/@domain/models/settings/price/SettingPriceBodyPartCoefficient';
import { SettingPriceBodyPartCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyPartCoefficientDto';

export class SettingPriceBodyPartCoefficientMapper {
  static dtoToDomain(dto: SettingPriceBodyPartCoefficientDto): SettingPriceBodyPartCoefficient {
    return new SettingPriceBodyPartCoefficient(
      dto.userId,
      dto.coefficient,
      dto.bodyParts ? BodyPartMapper.dtoToDomain(dto.bodyParts) : undefined,
      dto.bodyPartId,
    );
  }

  static domainToDto(domain: SettingPriceBodyPartCoefficient): SettingPriceBodyPartCoefficientDto {
    return {
      userId: domain.userId,
      bodyPartId: domain.bodyPartId,
      coefficient: domain.coefficient,
      bodyParts: domain.bodyPart ? BodyPartMapper.domainToDto(domain.bodyPart) : undefined
    };
  }
}
