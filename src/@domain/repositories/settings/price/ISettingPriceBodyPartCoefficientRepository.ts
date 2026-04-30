import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';

export interface ISettingPriceBodyPartCoefficientRepository {
  getDefault(): Promise<SettingPriceBodyPartCoefficientDto[]>;
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]>;
  save(setting: SettingPriceBodyPartCoefficientDto[]): Promise<SettingPriceBodyPartCoefficientDto[]>;
  create(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  update(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  delete(id: string): Promise<void>;
}
