import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceTechnicityCoefficientUseCase';
import { SettingPriceTechnicityCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceTechnicityCoefficientDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceTechnicityCoefficientUseCase implements ISettingPriceTechnicityCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient)
    private repository: ISettingPriceTechnicityCoefficientRepository
  ) {}


  async getAdmin(): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.getAdmin();
  }

  async getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.getByUserId(userId);
  }

  async save(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.save(dto);
  }

  async create(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.create(dto);
  }

  async update(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
