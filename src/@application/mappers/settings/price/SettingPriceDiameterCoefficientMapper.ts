import { SettingPriceDiameterCoefficient } from '@/@domain/models/settings/price/SettingPriceDiameterCoefficient';
import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto';

export class SettingPriceDiameterCoefficientMapper {
  static dtoToDomain(dto: SettingPriceDiameterCoefficientDto): SettingPriceDiameterCoefficient {
    return new SettingPriceDiameterCoefficient(
      dto.id ?? '',
      dto.userId,
      dto.diameter,
      dto.coefficient
    );
  }

  static domainToDto(domain: SettingPriceDiameterCoefficient): SettingPriceDiameterCoefficientDto {
    return {
      id: domain.id,
      userId: domain.userId,
      diameter: domain.diameter,
      coefficient: domain.coefficient
    };
  }
}
