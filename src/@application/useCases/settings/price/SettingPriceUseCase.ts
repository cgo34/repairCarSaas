
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { SettingPriceDto } from '@/@infrastructure/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceUseCase implements ISettingPriceUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository)
    private settingPriceRepository: ISettingPriceRepository,
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDto> {
    return await this.settingPriceRepository.getByUserId(userId);
  }

  async getDefaultSettings(): Promise<SettingPriceDto> {
    return await this.settingPriceRepository.getDefault();
  }

  async createSettingsForUser(userId: string): Promise<void> {
    await this.settingPriceRepository.createForUser(userId);
  }
}
