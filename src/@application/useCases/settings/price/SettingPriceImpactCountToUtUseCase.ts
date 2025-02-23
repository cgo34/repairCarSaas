import { SettingPriceImpactCountToUtDto } from '@/@application/dtos/settings/price/SettingPriceImpactCountToUtDto';
import { ISettingPriceImpactCountToUtUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceImpactCountToUtUseCase';
import { ISettingPriceImpactCountToUtService } from '@/@domain/services/settings/price/ISettingPriceImpactCountToUtService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceImpactCountToUtUseCase implements ISettingPriceImpactCountToUtUseCase {
  constructor(
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceImpactCountToUtService)
    private service: ISettingPriceImpactCountToUtService
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]> {
    return await this.service.getByUserId(userId);
  }

  async create(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    return await this.service.create(dto);
  }

  async update(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    return await this.service.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.service.delete(id);
  }
}
