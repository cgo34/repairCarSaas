import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceImpactCountToUtUseCase } from '@/@domain/useCases/settings/price/ISettingPriceImpactCountToUtUseCase';
import { SettingPriceImpactCountToUtDto } from '@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceImpactCountToUtUseCase implements ISettingPriceImpactCountToUtUseCase {
    constructor(
      @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository)
      private repository: ISettingPriceImpactCountToUtRepository
    ) {}

    async getAdmin(): Promise<SettingPriceImpactCountToUtDto[]> {
      return await this.repository.getAdmin();
    }
  
    async getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]> {
      return await this.repository.getByUserId(userId);
    }
  
    async save(dto: SettingPriceImpactCountToUtDto): Promise<SettingPriceImpactCountToUtDto> {
      return await this.repository.save(dto);
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
