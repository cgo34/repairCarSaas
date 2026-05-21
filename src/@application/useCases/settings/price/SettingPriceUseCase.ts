
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceUseCase implements ISettingPriceUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository)
    private settingPriceRepository: ISettingPriceRepository,
  ) {}

  async getByorganizationId(organizationId: string): Promise<SettingPriceDto> {
    return this.settingPriceRepository.getByorganizationId(organizationId);
  }

  async getDefaultSettings(): Promise<SettingPriceDto> {
    return this.settingPriceRepository.getDefault();
  }

  async createSettingsForUser(userId: string): Promise<void> {
    await this.settingPriceRepository.createForUser(userId);
  }
}
