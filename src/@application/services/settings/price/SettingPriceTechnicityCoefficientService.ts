import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceTechnicityCoefficientService } from '@/@domain/services/settings/price/ISettingPriceTechnicityCoefficientService';
import { SettingPriceTechnicityCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceTechnicityCoefficientDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceTechnicityCoefficientService implements ISettingPriceTechnicityCoefficientService {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient)
    private repository: ISettingPriceTechnicityCoefficientRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto> {
    return await this.repository.getByUserId(userId);
  }

  async create(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
