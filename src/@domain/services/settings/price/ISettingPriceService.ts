import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceService {
  getByUserId(userId: string): Promise<SettingPriceDto>;
}
