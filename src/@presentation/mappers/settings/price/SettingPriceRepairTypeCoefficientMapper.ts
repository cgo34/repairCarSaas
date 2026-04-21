import { SettingPriceRepairTypeCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceRepairTypeCoefficientDto';
import { SettingPriceRepairTypeCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceRepairTypeCoefficientViewModel';

export class SettingPriceRepairTypeCoefficientMapper {
  static viewToDto(viewModel: SettingPriceRepairTypeCoefficientViewModel): SettingPriceRepairTypeCoefficientDto {
    return {
      userId: viewModel.userId,
      repairTypeId: viewModel.repairTypeId,
      repairTypes: {
        id: viewModel.repairTypes.id,
        name: viewModel.repairTypes.name,
        code: viewModel.repairTypes.code,
      },
      coefficient: viewModel.coefficient
    };
  }

  static dtoToView(dto: SettingPriceRepairTypeCoefficientDto): SettingPriceRepairTypeCoefficientViewModel {
    return {
      userId: dto.userId,
      repairTypeId: dto.repairTypeId,
      coefficient: dto.coefficient,
      repairTypes: {
        id: dto.repairTypes?.id ?? '',
        name: dto.repairTypes?.name ?? '',
        code: dto.repairTypes?.code ?? '',
      }
    };
  }
}
