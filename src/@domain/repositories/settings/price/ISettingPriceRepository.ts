import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceRepository {
  getByUserId(userId: string): Promise<SettingPriceDto[]>;
}
