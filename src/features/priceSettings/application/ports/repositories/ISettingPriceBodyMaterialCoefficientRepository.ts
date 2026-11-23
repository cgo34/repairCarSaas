import { SettingPriceBodyMaterialCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyMaterialCoefficientDto';

export interface ISettingPriceBodyMaterialCoefficientRepository {
  getByOrganizationId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]>;
  create(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  update(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  delete(bodyMaterialId: string, userId: string): Promise<void>;
}
