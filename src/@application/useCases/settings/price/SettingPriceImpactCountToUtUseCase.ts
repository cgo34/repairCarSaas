import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceImpactCountToUtUseCase } from '@/@domain/useCases/settings/price/ISettingPriceImpactCountToUtUseCase';
import { SettingPriceImpactCountToUtDto } from '@/@application/dtos/settings/price/SettingPriceImpactCountToUtDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceImpactCountToUtUseCase implements ISettingPriceImpactCountToUtUseCase {
    constructor(
      @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository)
      private repository: ISettingPriceImpactCountToUtRepository
    ) {}

    async getAdmin(): Promise<SettingPriceImpactCountToUtDto[]> {
      return this.repository.getAdmin();
    }

    async getByUserId(userId: string): Promise<SettingPriceImpactCountToUtDto[]> {
      return this.repository.getByUserId(userId);
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
