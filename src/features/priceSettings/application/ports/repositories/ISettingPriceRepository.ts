import { SettingPriceDto } from '@/features/priceSettings/application/dtos/SettingPriceDto';

export interface ISettingPriceRepository {
  getByOrganizationId(organizationId: string): Promise<SettingPriceDto>;
  getDefault(): Promise<SettingPriceDto>;
  createForUser(userId: string): Promise<void>;
}
