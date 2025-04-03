import { ISettingPriceBodyMaterialCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyMaterialCoefficientRepository';
import { ISettingPriceBodyMaterialCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyMaterialCoefficientService';
import { SettingPriceBodyMaterialCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyMaterialCoefficientService implements ISettingPriceBodyMaterialCoefficientService {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyMaterialCoefficient)
    private repository: ISettingPriceBodyMaterialCoefficientRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]> {
    return await this.repository.getByUserId(userId);
  }

  async create(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto> {
    return await this.repository.update(dto);
  }

  async delete(bodyMaterialId: string, userId: string): Promise<void> {
    return await this.repository.delete(bodyMaterialId, userId);
  }
}
