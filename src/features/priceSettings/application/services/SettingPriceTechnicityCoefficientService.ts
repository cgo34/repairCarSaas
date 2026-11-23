import { ISettingPriceTechnicityCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceTechnicityCoefficientService } from '@/features/priceSettings/application/ports/services/ISettingPriceTechnicityCoefficientService';
import { SettingPriceTechnicityCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceTechnicityCoefficientDto';

export class SettingPriceTechnicityCoefficientService implements ISettingPriceTechnicityCoefficientService {
  constructor(
    private repository: ISettingPriceTechnicityCoefficientRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientDto | null> {
    return await this.repository.getByOrganizationId(userId);
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
