import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';

export interface ISettingPriceBodyPartCoefficientRepository {
  getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]>;
  create(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  update(setting: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  delete(id: string): Promise<void>;
}
