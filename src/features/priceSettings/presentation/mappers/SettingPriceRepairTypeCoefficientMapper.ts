import { SettingPriceRepairTypeCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceRepairTypeCoefficientDto';
import { SettingPriceRepairTypeCoefficientViewModel } from '@/features/priceSettings/presentation/models/SettingPriceRepairTypeCoefficientViewModel';

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
