import { SettingPrice } from '@/@domain/models/settings/price/SettingPrice';
import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';
import { SettingPriceBodyPartCoefficientMapper } from './SettingPriceBodyPartCoefficientMapper';
import { SettingPriceDiameterCoefficientMapper } from './SettingPriceDiameterCoefficientMapper';
import { SettingPriceGeneralMapper } from './SettingPriceGeneralMapper';
import { SettingPriceImpactCountToUtMapper } from './SettingPriceImpactCountToUtMapper';
import { SettingPriceRepairTypeCoefficientMapper } from './SettingPriceRepairTypeCoefficientMapper';

export class SettingPriceMapper {
  static dtoToDomain(dto: SettingPriceDto): SettingPrice {
    return {
      general: SettingPriceGeneralMapper.dtoToDomain(dto.general),
      bodyMaterials: dto.bodyMaterials.map(SettingPriceBodyPartCoefficientMapper.dtoToDomain),
      bodyParts: dto.bodyParts.map(SettingPriceBodyPartCoefficientMapper.dtoToDomain),
      diameters: dto.diameters.map(SettingPriceDiameterCoefficientMapper.dtoToDomain),
      impactsCount: dto.impactsCount.map(SettingPriceImpactCountToUtMapper.dtoToDomain),
      repairTypes: dto.repairTypes.map(SettingPriceRepairTypeCoefficientMapper.dtoToDomain)
    };
  }

  static domainToDto(domain: SettingPrice): SettingPriceDto {
    return {
      general: SettingPriceGeneralMapper.domainToDto(domain.general),
      bodyMaterials: domain.bodyMaterials.map(SettingPriceBodyPartCoefficientMapper.domainToDto),
      bodyParts: domain.bodyParts.map(SettingPriceBodyPartCoefficientMapper.domainToDto),
      diameters: domain.diameters.map(SettingPriceDiameterCoefficientMapper.domainToDto),
      impactsCount: domain.impactsCount.map(SettingPriceImpactCountToUtMapper.domainToDto),
      repairTypes: domain.repairTypes.map(SettingPriceRepairTypeCoefficientMapper.domainToDto)
    };
  }
}
