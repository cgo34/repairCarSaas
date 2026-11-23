import { BodyMaterialMapper } from '@/features/carRepairSettings/application/mappers/BodyMaterialMapper';
import { SettingPriceBodyMaterialCoefficient } from '@/features/priceSettings/domain/entities/SettingPriceBodyMaterialCoefficient';
import { SettingPriceBodyMaterialCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyMaterialCoefficientDto';

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
