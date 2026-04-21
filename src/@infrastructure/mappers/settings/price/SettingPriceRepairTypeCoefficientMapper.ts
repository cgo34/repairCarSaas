import { SettingPriceRepairTypeCoefficientApiModel } from '@/@infrastructure/database/api/settings/price/SettingPriceRepairTypeCoefficientApiModel';
import { SettingPriceRepairTypeCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceRepairTypeCoefficientDto';

export class SettingPriceRepairTypeCoefficientMapper {
  static apiToDto(apiModel: SettingPriceRepairTypeCoefficientApiModel): SettingPriceRepairTypeCoefficientDto {
    return {
      userId: apiModel.user_id,
      coefficient: apiModel.repair_type_coefficient,
      repairTypeId: apiModel.repair_type_id,
      repairTypes: {
        id: apiModel.repair_types?.id ?? '',
        name: apiModel.repair_types?.name ?? '',
        code: apiModel.repair_types?.code ?? '',
      },
    };
  }

  static dtoToApi(dto: SettingPriceRepairTypeCoefficientDto): SettingPriceRepairTypeCoefficientApiModel {
    return {
      user_id: dto.userId,
      repair_type_coefficient: dto.coefficient,
      repair_type_id: dto.repairTypeId,
      repair_types: {
        id: dto.repairTypes?.id ?? '',
        name: dto.repairTypes?.name ?? '',
        code: dto.repairTypes?.code ?? '',
      },
    };
  }
}
