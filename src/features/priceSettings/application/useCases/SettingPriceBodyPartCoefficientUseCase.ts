import { ISettingPriceBodyPartCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceBodyPartCoefficientRepository';
import { SettingPriceBodyPartCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceBodyPartCoefficientDto';

export interface ISettingPriceBodyPartCoefficientUseCase {
  getAdmin(): Promise<SettingPriceBodyPartCoefficientDto[]>;
  getByOrganizationId(organizationId: string): Promise<SettingPriceBodyPartCoefficientDto[]>;
  save(dtos: SettingPriceBodyPartCoefficientDto[]): Promise<SettingPriceBodyPartCoefficientDto[]>;
  create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto>;
  delete(id: string): Promise<void>;
}

export class SettingPriceBodyPartCoefficientUseCase implements ISettingPriceBodyPartCoefficientUseCase {
  constructor(
    private repository: ISettingPriceBodyPartCoefficientRepository
  ) {}



  async getAdmin(): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return this.repository.getDefault();
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return this.repository.getByOrganizationId(organizationId);
  }

  async save(settings: SettingPriceBodyPartCoefficientDto[]): Promise<SettingPriceBodyPartCoefficientDto[]> {
    return this.repository.save(settings);
  }

  async create(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return this.repository.create(dto);
  }

  async update(dto: SettingPriceBodyPartCoefficientDto): Promise<SettingPriceBodyPartCoefficientDto> {
    return this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
