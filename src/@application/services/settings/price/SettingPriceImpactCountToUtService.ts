import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceImpactCountToUtService } from '@/@domain/services/settings/price/ISettingPriceImpactCountToUtService';
import { SettingPriceImpactCountToUtDto } from '@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceImpactCountToUtService implements ISettingPriceImpactCountToUtService {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository)
    private repository: ISettingPriceImpactCountToUtRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]> {
    return await this.repository.getByUserId(userId);
  }

  async create(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
