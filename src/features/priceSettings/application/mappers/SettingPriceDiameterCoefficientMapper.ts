import { SettingPriceDiameterCoefficient } from '@/features/priceSettings/domain/entities/SettingPriceDiameterCoefficient';
import { SettingPriceDiameterCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceDiameterCoefficientDto';

export class SettingPriceDiameterCoefficientMapper {
  static dtoToDomain(dto: SettingPriceDiameterCoefficientDto): SettingPriceDiameterCoefficient {
    return new SettingPriceDiameterCoefficient(
      dto.id ?? '',
      dto.organization_id,
      dto.diameter,
      dto.coefficient
    );
  }

  static domainToDto(domain: SettingPriceDiameterCoefficient): SettingPriceDiameterCoefficientDto {
    return {
      id: domain.id,
      organization_id: domain.userId,
      diameter: domain.diameter,
      coefficient: domain.coefficient
    };
  }
}
