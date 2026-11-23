import { SettingPriceDto } from '@/features/priceSettings/application/dtos/SettingPriceDto';

export interface ISettingPriceService {
  getByUserId(userId: string): Promise<SettingPriceDto>;
}
