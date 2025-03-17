import { SettingPrice } from '@/@domain/models/settings/price/SettingPrice';
import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';
import { SettingPriceBodyPartCoefficientMapper } from './SettingPriceBodyPartCoefficientMapper';
import { SettingPriceDiameterCoefficientMapper } from './SettingPriceDiameterCoefficientMapper';
import { SettingPriceGeneralMapper } from './SettingPriceGeneralMapper';
import { SettingPriceImpactCountToUtMapper } from './SettingPriceImpactCountToUtMapper';

export class SettingPriceMapper {
  static dtoToDomain(dto: SettingPriceDto): SettingPrice {
    return new SettingPrice(
      SettingPriceGeneralMapper.dtoToDomain(dto.general),
      dto.bodyMaterials.map(SettingPriceBodyPartCoefficientMapper.dtoToDomain),
      dto.bodyParts.map(SettingPriceBodyPartCoefficientMapper.dtoToDomain),
      dto.diameters.map(SettingPriceDiameterCoefficientMapper.dtoToDomain),
      dto.impactsCount.map(SettingPriceImpactCountToUtMapper.dtoToDomain)
    );
  }

  static domainToDto(domain: SettingPrice): SettingPriceDto {
    return {
      general: SettingPriceGeneralMapper.domainToDto(domain.general),
      bodyMaterials: domain.bodyMaterials.map(SettingPriceBodyPartCoefficientMapper.domainToDto),
      bodyParts: domain.bodyParts.map(SettingPriceBodyPartCoefficientMapper.domainToDto),
      diameters: domain.diameters.map(SettingPriceDiameterCoefficientMapper.domainToDto),
      impactsCount: domain.impactsCount.map(SettingPriceImpactCountToUtMapper.domainToDto)
    };
  }
}
