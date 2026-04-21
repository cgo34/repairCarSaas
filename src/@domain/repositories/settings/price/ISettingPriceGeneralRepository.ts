import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';

export interface ISettingPriceGeneralRepository {
  getAdmin(): Promise<SettingPriceGeneralDto>;
  getByUserId(userId: string): Promise<SettingPriceGeneralDto>;
  save(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  create(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  update(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}
