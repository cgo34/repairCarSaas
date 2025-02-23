import { SettingPriceDiameterCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceDiameterCoefficientDto';
import { ISettingPriceDiameterCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceDiameterCoefficientRepository';
import { ISettingPriceDiameterCoefficientService } from '@/@domain/services/settings/price/ISettingPriceDiameterCoefficientService';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceDiameterCoefficientService implements ISettingPriceDiameterCoefficientService {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceDiameterCoefficient)
    private repository: ISettingPriceDiameterCoefficientRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDiameterCoefficientDto[]> {
    return await this.repository.getByUserId(userId);
  }

  async create(dto: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceDiameterCoefficientDto): Promise<SettingPriceDiameterCoefficientDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
