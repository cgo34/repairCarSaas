import { RepairTypeMapper } from '@/features/carRepairSettings/application/mappers/RepairTypeMapper';
import { SettingPriceRepairTypeCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceRepairTypeCoefficientDto';

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
