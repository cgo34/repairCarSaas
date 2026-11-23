import { ISettingPriceBodyPartCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceBodyPartCoefficientService } from '@/features/priceSettings/application/ports/services/ISettingPriceBodyPartCoefficientService';
import { SettingPriceBodyPartCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyPartCoefficientDto';

export class SettingPriceBodyPartCoefficientService implements ISettingPriceBodyPartCoefficientService {
  constructor(
    private repository: ISettingPriceBodyPartCoefficientRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return await this.repository.getByOrganizationId(userId);
  }

  async create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
