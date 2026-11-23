import { ISettingPriceImpactCountToUtRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceImpactCountToUtRepository';
import { SettingPriceImpactCountToUtDto } from '@/features/priceSettings/application/dtos/SettingPriceImpactCountToUtDto';

export interface ISettingPriceImpactCountToUtUseCase {
  getAdmin(): Promise<SettingPriceImpactCountToUtDto[]>;
  getByOrganizationId(organizationId: string): Promise<SettingPriceImpactCountToUtDto[]>;
  save(settings: SettingPriceImpactCountToUtDto[]): Promise<SettingPriceImpactCountToUtDto[]>;
  create(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  update(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto>;
  delete(id: string): Promise<void>;
}

export class SettingPriceImpactCountToUtUseCase implements ISettingPriceImpactCountToUtUseCase {
    constructor(
      private repository: ISettingPriceImpactCountToUtRepository
    ) {}

    async getAdmin(): Promise<SettingPriceImpactCountToUtDto[]> {
      return this.repository.getDefault();
    }

    async getByOrganizationId(organizationId: string): Promise<SettingPriceImpactCountToUtDto[]> {
      return this.repository.getByOrganizationId(organizationId);
    }

    async save(settings: SettingPriceImpactCountToUtDto[]): Promise<SettingPriceImpactCountToUtDto[]> {
      return this.repository.save(settings);
    }

    async create(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
      return this.repository.create(dto);
    }

    async update(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
      return this.repository.update(dto);
    }

    async delete(id: string): Promise<void> {
      return this.repository.delete(id);
    }
}
