import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';

export interface ISettingPriceGeneralService {
  getByUserId(userId: string): Promise<SettingPriceGeneralDto>;
}
