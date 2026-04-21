import { SettingPriceImpactCountToUt } from '@/@domain/models/settings/price/SettingPriceImpactCountToUt';
import { SettingPriceImpactCountToUtDto } from '@/@application/dtos/settings/price/SettingPriceImpactCountToUtDto';

export class SettingPriceImpactCountToUtMapper {
  static dtoToDomain(dto: SettingPriceImpactCountToUtDto): SettingPriceImpactCountToUt {
    return new SettingPriceImpactCountToUt(
      dto.id ?? '',
      dto.impactCountMin,
      dto.impactCountMax,
      dto.unitTime,
      dto.userId
    );
  }

  static domainToDto(domain: SettingPriceImpactCountToUt): SettingPriceImpactCountToUtDto {
    return {
      id: domain.id,
      impactCountMin: domain.impactCountMin,
      impactCountMax: domain.impactCountMax,
      unitTime: domain.unitTime,
      userId: domain.userId
    };
  }
}
