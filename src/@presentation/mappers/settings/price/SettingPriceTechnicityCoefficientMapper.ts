import { SettingPriceTechnicityCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto';
import { SettingPriceTechnicityCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceTechnicityCoefficientViewModel';

export class SettingPriceTechnicityCoefficientMapper {
  static viewToDto(viewModel: SettingPriceTechnicityCoefficientViewModel): SettingPriceTechnicityCoefficientDto {
    return {
      id: viewModel.id ?? '',
      userId: viewModel.userId,
      diameter25Coefficient: viewModel.diameter25Coefficient,
      diameter35Coefficient: viewModel.diameter35Coefficient,
      aluminiumCoefficient: viewModel.aluminiumCoefficient,
      dapCoefficient: viewModel.dapCoefficient,
      dspCoefficient: viewModel.dspCoefficient
    };
  }

  static dtoToView(dto: SettingPriceTechnicityCoefficientDto): SettingPriceTechnicityCoefficientViewModel {
    return {
      id: dto.id ?? '',
      userId: dto.userId,
      diameter25Coefficient: dto.diameter25Coefficient,
      diameter35Coefficient: dto.diameter35Coefficient,
      aluminiumCoefficient: dto.aluminiumCoefficient,
      dapCoefficient: dto.dapCoefficient,
      dspCoefficient: dto.dspCoefficient
    };
  }
}
