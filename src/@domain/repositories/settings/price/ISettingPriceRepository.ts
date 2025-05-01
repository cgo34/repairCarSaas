import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceRepository {
  getByUserId(userId: string): Promise<SettingPriceDto[]>;
}
