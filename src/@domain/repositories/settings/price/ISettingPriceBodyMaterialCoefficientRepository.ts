import { SettingPriceBodyMaterialCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';

export interface ISettingPriceBodyMaterialCoefficientRepository {
  getByOrganizationId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]>;
  create(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  update(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  delete(bodyMaterialId: string, userId: string): Promise<void>;
}
