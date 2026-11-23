import { SettingPriceGeneralDto } from '@/features/priceSettings/application/dtos/SettingPriceGeneralDto';
import { SettingPriceGeneralViewModel } from '@/features/priceSettings/presentation/models/SettingPriceGeneralViewModel';

export class SettingPriceGeneralMapper {
  static viewToDto(viewModel: SettingPriceGeneralViewModel): SettingPriceGeneralDto {
    return {
      id: viewModel.id ?? '',
      userId: viewModel.userId,
      hourlyRate: viewModel.hourlyRate,
      unitTime: viewModel.unitTime
    };
  }

  static dtoToView(dto: SettingPriceGeneralDto): SettingPriceGeneralViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      hourlyRate: dto.hourlyRate,
      unitTime: dto.unitTime
    };
  }
}
