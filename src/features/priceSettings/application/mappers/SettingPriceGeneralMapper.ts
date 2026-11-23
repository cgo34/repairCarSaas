import { SettingPriceGeneral } from '@/features/priceSettings/domain/entities/SettingPriceGeneral';
import { SettingPriceGeneralDto } from '@/features/priceSettings/application/dtos/SettingPriceGeneralDto';

export class SettingPriceGeneralMapper {
  static dtoToDomain(dto: SettingPriceGeneralDto): SettingPriceGeneral {
    return new SettingPriceGeneral(
      dto.id ?? '',
      dto.userId,
      dto.hourlyRate,
      dto.unitTime
    );
  }

  static domainToDto(domain: SettingPriceGeneral): SettingPriceGeneralDto {
    return {
      id: domain.id,
      userId: domain.userId,
      hourlyRate: domain.hourlyRate,
      unitTime: domain.unitTime
    };
  }
}
