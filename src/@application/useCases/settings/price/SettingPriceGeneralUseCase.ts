import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceGeneralUseCase } from '@/@domain/useCases/settings/price/ISettingPriceGeneralUseCase';
import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceGeneralUseCase implements ISettingPriceGeneralUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository)
    private repository: ISettingPriceGeneralRepository
  ) {}
  

  async getAdmin(): Promise<SettingPriceGeneralDto> {
    return this.repository.getAdmin();
  }

  async getByOrganizationId(organizationId: string): Promise<SettingPriceGeneralDto> {
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
