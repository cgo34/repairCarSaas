import { ISettingPriceBodyMaterialCoefficientService } from '@/@domain/services/settings/price/ISettingPriceBodyMaterialCoefficientService';
import { ISettingPriceBodyMaterialCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyMaterialCoefficientUseCase';
import { SettingPriceBodyMaterialCoefficientDto } from '@/@infrastructure/dtos/settings/price/SettingPriceBodyMaterialCoefficientDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyMaterialCoefficientUseCase implements ISettingPriceBodyMaterialCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Services.Setting.Price.SettingPriceBodyMaterialCoefficientService)
    private service: ISettingPriceBodyMaterialCoefficientService
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceBodyMaterialCoefficientDto[]> {
    return await this.service.getByUserId(userId);
  }

  async create(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto> {
    return await this.service.create(dto);
  }

  async update(dto: SettingPriceBodyMaterialCoefficientDto): Promise<SettingPriceBodyMaterialCoefficientDto> {
    return await this.service.update(dto);
  }

  async delete(bodyMaterialId: string, userId): Promise<void> {
    return await this.service.delete(bodyMaterialId, userId);
  }
}
