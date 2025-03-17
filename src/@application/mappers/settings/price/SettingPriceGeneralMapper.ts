import { SettingPriceGeneral } from '@/@domain/models/settings/price/SettingPriceGeneral';
import { SettingPriceGeneralDto } from '@/@infrastructure/dtos/settings/price/SettingPriceGeneralDto';

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
