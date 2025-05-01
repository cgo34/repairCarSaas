import { ISettingPriceRepairTypeCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceRepairTypeCoefficientRepository';
import { ISettingPriceRepairTypeCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceRepairTypeCoefficientUseCase';
import { SettingPriceRepairTypeCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceRepairTypeCoefficientDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceRepairTypeCoefficientUseCase implements ISettingPriceRepairTypeCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.RepairTypeCoefficient)
    private repository: ISettingPriceRepairTypeCoefficientRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceRepairTypeCoefficientDto[]> {
    return await this.repository.getByUserId(userId);
  }

  async create(dto: SettingPriceRepairTypeCoefficientDto): Promise<SettingPriceRepairTypeCoefficientDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceRepairTypeCoefficientDto): Promise<SettingPriceRepairTypeCoefficientDto> {
    return await this.repository.update(dto);
  }

  async delete(bodyMaterialId: string, userId): Promise<void> {
    return await this.repository.delete(bodyMaterialId, userId);
  }
}
