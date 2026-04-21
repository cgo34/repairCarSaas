import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { SettingPriceBodyPartCoefficientDto } from '@/@application/dtos/settings/price/SettingPriceBodyPartCoefficientDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyPartCoefficientUseCase implements ISettingPriceBodyPartCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient)
    private repository: ISettingPriceBodyPartCoefficientRepository
  ) {}



  async getAdmin(): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return this.repository.getAdmin();
  }

  async getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return this.repository.getByUserId(userId);
  }

  async save(settings: SettingPriceBodyPartCoefficientDto[]): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return this.repository.save(settings);
  }

  async create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return this.repository.create(dto);
  }

  async update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
