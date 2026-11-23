import { SettingPriceGeneralDto } from '@/features/priceSettings/application/dtos/SettingPriceGeneralDto';

export interface ISettingPriceGeneralRepository {
  getDefault(): Promise<SettingPriceGeneralDto>;
  getByOrganizationId(userId: string): Promise<SettingPriceGeneralDto | null>;
  save(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  create(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  update(setting: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}
