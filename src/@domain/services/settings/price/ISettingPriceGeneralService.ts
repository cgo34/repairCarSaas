import { SettingPriceGeneralDto } from '@/@infrastructure/dtos/settings/price/SettingPriceGeneralDto';

export interface ISettingPriceGeneralService {
  getByUserId(userId: string): Promise<SettingPriceGeneralDto>;
}
