import { SettingPriceBodyMaterialCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';

export interface ISettingPriceBodyMaterialCoefficientUseCase {
  getByUserId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]>;
  create(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  update(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto>;
  delete(id: string): Promise<void>;
}
