import { SettingPriceTechnicityCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto';

export interface ISettingPriceTechnicityCoefficientRepository {
  getDefault(): Promise<SettingPriceTechnicityCoefficientDto>;
  getByOrganizationId(userId: string): Promise<SettingPriceTechnicityCoefficientDto>;
  save(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  create(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  update(setting: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  delete(id: string): Promise<void>;
}
