import { ISettingPriceRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceRepository';
import { ISettingPriceService } from '@/features/priceSettings/application/ports/services/ISettingPriceService';
import { SettingPriceDto } from '@/features/priceSettings/application/dtos/SettingPriceDto';

export class SettingPriceService implements ISettingPriceService {
  constructor(
    private repository: ISettingPriceRepository
  ) {}

  async getByUserId(userId: string): Promise<SettingPriceDto> {
    return await this.repository.getByOrganizationId(userId);
  }
}
