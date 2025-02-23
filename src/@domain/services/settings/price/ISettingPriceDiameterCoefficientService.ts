import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';

export interface ISettingPriceDiameterCoefficientService {
  getByUserId(userId: string): Promise<SettingPriceDiameterCoefficientDto[]>;
  create(dto: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto>;
  update(dto: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto>;
  delete(id: string): Promise<void>;
}
