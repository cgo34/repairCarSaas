import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceUseCase {
  getByUserId(userId: string): Promise<SettingPriceDto>;
}
