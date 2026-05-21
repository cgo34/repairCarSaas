import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceRepository {
  getByorganizationId(organizationId: string): Promise<SettingPriceDto>;
  getDefault(): Promise<SettingPriceDto>;
  createForUser(userId: string): Promise<void>;
}
