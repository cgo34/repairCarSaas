import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@application/useCases/interfaces/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { ISettingPriceBodyPartCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyPartCoefficientService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyPartCoefficientUseCase implements ISettingPriceBodyPartCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceBodyPartCoefficientService)
    private service: ISettingPriceBodyPartCoefficientService
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return await this.service.getByUserId(userId);
  }

  async create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return await this.service.create(dto);
  }

  async update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return await this.service.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.service.delete(id);
  }
}
