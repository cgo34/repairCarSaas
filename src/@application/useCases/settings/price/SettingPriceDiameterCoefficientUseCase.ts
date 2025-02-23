import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';
import { ISettingPriceDiameterCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceDiameterCoefficientUseCase';
import { ISettingPriceDiameterCoefficientService } from '@/@domain/services/settings/price/ISettingPriceDiameterCoefficientService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceDiameterCoefficientUseCase implements ISettingPriceDiameterCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceDiameterCoefficientService)
    private service: ISettingPriceDiameterCoefficientService
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDiameterCoefficientDto[]> {
    return await this.service.getByUserId(userId);
  }

  async create(dto: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    return await this.service.create(dto);
  }

  async update(dto: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    return await this.service.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.service.delete(id);
  }
}
