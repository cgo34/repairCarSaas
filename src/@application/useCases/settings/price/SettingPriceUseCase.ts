
import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { ISettingPriceUseCase } from '@/@domain/useCases/settings/price/ISettingPriceUseCase';
import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';
import { SettingPriceViewModel } from '@/@presentation/types/models/settings/price/SettingPriceViewModel';
import { SettingPriceMapper } from '@/@presentation/mappers/settings/price/SettingPriceMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceUseCase implements ISettingPriceUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository)
    private settingPriceRepository: ISettingPriceRepository,
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceViewModel> {
    const dto = await this.settingPriceRepository.getByUserId(userId);
    return SettingPriceMapper.dtoToView(dto);
  }

  async getDefaultSettings(): Promise<SettingPriceViewModel> {
    const dto = await this.settingPriceRepository.getDefault();
    return SettingPriceMapper.dtoToView(dto);
  }

  async createSettingsForUser(userId: string): Promise<void> {
    await this.settingPriceRepository.createForUser(userId);
  }
}
