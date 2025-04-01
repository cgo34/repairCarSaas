import { SettingPriceViewDto } from '@/@application/dtos/settings/SettingPriceViewDto';

export interface ISettingPriceUseCase {
  getByUserId(userId: string): Promise<SettingPriceViewDto>;
}
