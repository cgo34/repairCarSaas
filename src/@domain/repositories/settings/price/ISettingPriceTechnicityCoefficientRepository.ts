import { SettingPriceTechnicityCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceTechnicityCoefficientDto';

export interface ISettingPriceTechnicityCoefficientRepository {
  getAdmin(): Promise<SettingPriceTechnicityCoefficientDto>;
  getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto>;
  save(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  create(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  update(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  delete(id: string): Promise<void>;
}
