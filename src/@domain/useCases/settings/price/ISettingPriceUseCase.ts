import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';

export interface ISettingPriceUseCase {
  getByUserId(userId: string): Promise<SettingPriceViewModel>;
  getDefaultSettings(): Promise<SettingPriceViewModel>;
  createSettingsForUser(userId: string): Promise<void>;
}
