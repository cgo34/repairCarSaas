import { SettingPriceGeneralViewDto } from '@/@application/dtos/settings/SettingPriceGeneralViewDto';
import { SettingPriceGeneralViewModel } from '@/@presentation/types/models/settings/price/SettingPriceGeneralViewModel';

export class SettingPriceGeneralMapper {
  static viewToDto(viewModel: SettingPriceGeneralViewModel): SettingPriceGeneralViewDto {
    return {
      id: viewModel.id ?? '',
      userId: viewModel.userId,
      hourlyRate: viewModel.hourlyRate,
      unitTime: viewModel.unitTime
    };
  }

  static dtoToView(dto: SettingPriceGeneralViewDto): SettingPriceGeneralViewModel {
    return {
      id: dto.id,
      userId: dto.userId,
      hourlyRate: dto.hourlyRate,
      unitTime: dto.unitTime
    };
  }
}
