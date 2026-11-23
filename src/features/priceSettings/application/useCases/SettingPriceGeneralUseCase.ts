import { ISettingPriceGeneralRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceGeneralRepository';
import { SettingPriceGeneralDto } from '@/features/priceSettings/application/dtos/SettingPriceGeneralDto';

export interface ISettingPriceGeneralUseCase {
  getAdmin(): Promise<SettingPriceGeneralDto>;
  getByOrganizationId(organizationId: string): Promise<SettingPriceGeneralDto | null>;
  save(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto>;
  delete(id: string): Promise<void>;
}

export class SettingPriceGeneralUseCase implements ISettingPriceGeneralUseCase {
  constructor(
    private repository: ISettingPriceGeneralRepository
  ) {}
  

  async getAdmin(): Promise<SettingPriceGeneralDto> {
    return this.repository.getDefault();
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceGeneralDto | null> {
    return this.repository.getByOrganizationId(organizationId);
  }

  async save(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return this.repository.save(dto);
  }

  async create(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return this.repository.create(dto);
  }

  async update(dto: SettingPriceGeneralDto): Promise<SettingPriceGeneralDto> {
    return this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
