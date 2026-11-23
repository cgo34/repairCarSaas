import { SettingPriceRepairTypeCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceRepairTypeCoefficientDto';

export interface ISettingPriceRepairTypeCoefficientRepository {
  getByOrganizationId(userId: string): Promise<SettingPriceRepairTypeCoefficientDto[]>;
  create(setting: SettingPriceRepairTypeCoefficientDto): Promise<SettingPriceRepairTypeCoefficientDto>;
  update(setting: SettingPriceRepairTypeCoefficientDto): Promise<SettingPriceRepairTypeCoefficientDto>;
  delete(bodyMaterialId: string, userId: string): Promise<void>;
}
