import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';

export interface ISettingPriceUseCase {
  getByOrganizationId(organizationId: string): Promise<SettingPriceDto>;
  getDefaultSettings(): Promise<SettingPriceDto>;
  createSettingsForUser(userId: string): Promise<void>;
}
