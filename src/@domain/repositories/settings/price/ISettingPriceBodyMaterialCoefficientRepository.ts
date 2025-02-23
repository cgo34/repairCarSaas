import { SettingPriceBodyMaterialCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';

export interface ISettingPriceBodyMaterialCoefficientRepository {
  getByUserId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]>;
  create(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  update(setting: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  delete(id: string): Promise<void>;
}
