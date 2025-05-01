import { SettingPriceGeneralDto } from '@/@infrastructure/dtos/settings/price/SettingPriceGeneralDto';

export interface ISettingPriceGeneralRepository {
  getByUserId(userId: string): Promise<SettingPriceGeneralDto[]>;
  create(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  update(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}
