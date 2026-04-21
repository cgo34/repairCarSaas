import { BodyMaterialMapper } from '@/@application/mappers/settings/carRepair/BodyMaterialMapper';
import { SettingPriceBodyMaterialCoefficient } from '@/@domain/models/settings/price/SettingPriceBodyMaterialCoefficient';
import { SettingPriceBodyMaterialCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';

export class SettingPriceBodyMaterialCoefficientMapper {
  static dtoToDomain(dto: SettingPriceBodyMaterialCoefficientDto): SettingPriceBodyMaterialCoefficient {
    return new SettingPriceBodyMaterialCoefficient(
      dto.userId,
      dto.coefficient,
      dto.bodyMaterialId ?? '',
      dto.bodyMaterials ? BodyMaterialMapper.dtoToDomain(dto.bodyMaterials) : undefined
    );
  }

  static domainToDto(domain: SettingPriceBodyMaterialCoefficient): SettingPriceBodyMaterialCoefficientDto {
    return {
      userId: domain.userId,
      bodyMaterialId: domain.bodyMaterialId,
      coefficient: domain.coefficient,
      bodyMaterials: domain.bodyMaterials ? BodyMaterialMapper.domainToDto(domain.bodyMaterials) : undefined
    };
  }
}
