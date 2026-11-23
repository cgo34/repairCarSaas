import { ISettingPriceGeneralRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceGeneralRepository';
import { ISettingPriceGeneralService } from '@/features/priceSettings/application/ports/services/ISettingPriceGeneralService';
import { SettingPriceGeneralDto } from '@/features/priceSettings/application/dtos/SettingPriceGeneralDto';

export class SettingPriceGeneralService implements ISettingPriceGeneralService {
  constructor(
    private repository: ISettingPriceGeneralRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceGeneralDto | null> {
    return await this.repository.getByOrganizationId(userId);
  }

  async create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return await this.repository.create(dto);
  }

  async update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return await this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
