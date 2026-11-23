import { SettingPriceImpactCountToUt } from '@/features/priceSettings/domain/entities/SettingPriceImpactCountToUt';
import { SettingPriceImpactCountToUtDto } from '@/features/priceSettings/application/dtos/SettingPriceImpactCountToUtDto';

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
