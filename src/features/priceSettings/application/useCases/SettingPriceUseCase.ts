
import { ISettingPriceRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceRepository';
import { SettingPriceDto } from '@/features/priceSettings/application/dtos/SettingPriceDto';

export interface ISettingPriceUseCase {
  getByOrganizationId(organizationId: string): Promise<SettingPriceDto>;
  getDefaultSettings(): Promise<SettingPriceDto>;
  createSettingsForUser(userId: string): Promise<void>;
}

export class SettingPriceUseCase implements ISettingPriceUseCase {
  constructor(
    private settingPriceRepository: ISettingPriceRepository,
  ) {}

  async getByOrganizationId(organizationId: string): Promise<SettingPriceDto> {
    return this.settingPriceRepository.getByOrganizationId(organizationId);
  }

  async getDefaultSettings(): Promise<SettingPriceDto> {
    return this.settingPriceRepository.getDefault();
  }

  async createSettingsForUser(userId: string): Promise<void> {
    await this.settingPriceRepository.createForUser(userId);
  }
}
