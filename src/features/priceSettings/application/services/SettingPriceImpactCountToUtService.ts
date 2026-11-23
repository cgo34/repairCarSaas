import { ISettingPriceImpactCountToUtRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceImpactCountToUtService } from '@/features/priceSettings/application/ports/services/ISettingPriceImpactCountToUtService';
import { SettingPriceImpactCountToUtDto } from '@/features/priceSettings/application/dtos/SettingPriceImpactCountToUtDto';

export class SettingPriceImpactCountToUtService implements ISettingPriceImpactCountToUtService {
  constructor(
    private repository: ISettingPriceImpactCountToUtRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]> {
    return await this.repository.getByOrganizationId(userId);
  }

  async create(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
