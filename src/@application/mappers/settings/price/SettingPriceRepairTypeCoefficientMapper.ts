import { RepairTypeMapper } from '@/@application/mappers/settings/carRepair/RepairTypeMapper';
import { SettingPriceRepairTypeCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceRepairTypeCoefficientDto';

export class SettingPriceRepairTypeCoefficientMapper {
  static dtoToDomain(dto: SettingPriceRepairTypeCoefficientDto): SettingPriceRepairTypeCoefficientDto {
    return {
      userId: dto.userId,
      repairTypeId: dto.repairTypeId,
      coefficient: dto.coefficient,
      repairTypes: dto.repairTypes ? RepairTypeMapper.dtoToDomain(dto.repairTypes) : undefined
    }
  }

  static domainToDto(domain: SettingPriceRepairTypeCoefficientDto): SettingPriceRepairTypeCoefficientDto {
    return {
      userId: domain.userId,
      repairTypeId: domain.repairTypeId,
      coefficient: domain.coefficient,
      repairTypes: domain.repairTypes ? RepairTypeMapper.domainToDto(domain.repairTypes) : undefined
    };
  }
}
