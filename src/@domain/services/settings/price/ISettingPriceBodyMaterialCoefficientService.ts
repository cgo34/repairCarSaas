import { SettingPriceBodyMaterialCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';

export interface ISettingPriceBodyMaterialCoefficientService {
  getByUserId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]>;
  create(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  update(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  delete(id: string): Promise<void>;
}
