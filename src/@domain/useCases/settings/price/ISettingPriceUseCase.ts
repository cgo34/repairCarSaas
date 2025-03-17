import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceUseCase {
  getByUserId(userId: string): Promise<SettingPriceDto>;
}
