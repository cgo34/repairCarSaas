import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';

export interface ISettingPriceDiameterCoefficientRepository {
  getByUserId(userId: string): Promise<SettingPriceDiameterCoefficientDto[]>;
  create(setting: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto>;
  update(setting: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto>;
  delete(id: string): Promise<void>;
}
