import { SettingPriceRepairTypeCoefficientViewDto } from '@/@application/dtos/settings/SettingPriceRepairTypeCoefficientViewDto';
import { RepairTypeMapper } from '@/@application/mappers/settings/carRepair/RepairTypeMapper';
import { SettingPriceRepairTypeCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceRepairTypeCoefficientDto';

export class SettingPriceRepairTypeCoefficientMapper {
  static dtoToViewDto(dto: SettingPriceRepairTypeCoefficientDto): SettingPriceRepairTypeCoefficientViewDto {
    return {
      userId: dto.userId,
      repairTypeId: dto.repairTypeId,
      coefficient: dto.coefficient,
      repairTypes: dto.repairTypes ? RepairTypeMapper.dtoToViewDto(dto.repairTypes) : undefined
    }
  }

  static viewDtoToDto(domain: SettingPriceRepairTypeCoefficientViewDto): SettingPriceRepairTypeCoefficientDto {
    return {
      userId: domain.userId,
      repairTypeId: domain.repairTypeId,
      coefficient: domain.coefficient,
      repairTypes: domain.repairTypes ? RepairTypeMapper.viewDtoToDto(domain.repairTypes) : undefined
    };
  }
}
