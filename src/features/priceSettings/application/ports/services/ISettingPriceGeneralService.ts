import { SettingPriceGeneralDto } from '@/features/priceSettings/application/dtos/SettingPriceGeneralDto';

export interface ISettingPriceGeneralService {
  getByUserId(userId: string): Promise<SettingPriceGeneralDto | null>;
}
