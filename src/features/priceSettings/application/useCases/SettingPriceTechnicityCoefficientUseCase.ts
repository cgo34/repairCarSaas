import { ISettingPriceTechnicityCoefficientRepository } from '@/features/priceSettings/application/ports/repositories/ISettingPriceTechnicityCoefficientRepository';
import { SettingPriceTechnicityCoefficientDto } from '@/features/priceSettings/application/dtos/SettingPriceTechnicityCoefficientDto';

export interface ISettingPriceTechnicityCoefficientUseCase {
  getAdmin(): Promise<SettingPriceTechnicityCoefficientDto>;
  getByOrganizationId(organizationId: string): Promise<SettingPriceTechnicityCoefficientDto | null>;
  save(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  create(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  update(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto>;
  delete(id: string): Promise<void>;
}

export class SettingPriceTechnicityCoefficientUseCase implements ISettingPriceTechnicityCoefficientUseCase {
  constructor(
    private repository: ISettingPriceTechnicityCoefficientRepository
  ) {}


  async getAdmin(): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.getDefault();
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceTechnicityCoefficientDto | null> {
    return this.repository.getByOrganizationId(organizationId);
  }

  async save(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.save(dto);
  }

  async create(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.create(dto);
  }

  async update(dto: SettingPriceTechnicityCoefficientDto): Promise<SettingPriceTechnicityCoefficientDto> {
    return this.repository.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
