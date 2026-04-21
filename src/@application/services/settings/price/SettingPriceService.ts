import { ISettingPriceRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepository';
import { ISettingPriceService } from '@/@domain/services/settings/price/ISettingPriceService';
import { SettingPriceDto } from '@/@application/dtos/settings/price/SettingPriceDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceService implements ISettingPriceService {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceRepository)
    private repository: ISettingPriceRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDto[]> {
    return await this.repository.getByUserId(userId);
  }

  async create(dto: SettingPriceDto): Promise<SettingPriceDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceDto): Promise<SettingPriceDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
