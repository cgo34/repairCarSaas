import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceGeneralService } from '@/@domain/services/settings/price/ISettingPriceGeneralService';
import { SettingPriceGeneralDto } from '@/@infrastructure/dtos/settings/price/SettingPriceGeneralDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceGeneralService implements ISettingPriceGeneralService {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository)
    private repository: ISettingPriceGeneralRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceGeneralDto[]> {
    return await this.repository.getByUserId(userId);
  }

  async create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
