import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';
import { ISettingPriceGeneralUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceGeneralUseCase';
import { ISettingPriceGeneralService } from '@/@domain/services/settings/price/ISettingPriceGeneralService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceGeneralUseCase implements ISettingPriceGeneralUseCase {
  constructor(
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceGeneralService)
    private service: ISettingPriceGeneralService
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceGeneralDto[]> {
    return await this.service.getByUserId(userId);
  }

  async create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return await this.service.create(dto);
  }

  async update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return await this.service.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.service.delete(id);
  }
}
