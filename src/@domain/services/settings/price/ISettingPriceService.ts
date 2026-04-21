import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceService {
  getByUserId(userId: string): Promise<SettingPriceDto>;
}
