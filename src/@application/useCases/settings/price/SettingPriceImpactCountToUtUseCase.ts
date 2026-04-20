import { ISettingPriceImpactCountToUtRepository } from '@/@domain/repositories/settings/price/ISettingPriceImpactCountToUtRepository';
import { ISettingPriceImpactCountToUtUseCase } from '@/@domain/useCases/settings/price/ISettingPriceImpactCountToUtUseCase';
import { SettingPriceImpactCountToUtDto } from '@/@infrastructure/dtos/settings/price/SettingPriceImpactCountToUtDto';
import { SettingPriceImpactCountToUtViewModel } from '@/@presentation/types/models/settings/price/SettingPriceImpactCountToUtViewModel';
import { SettingPriceImpactCountToUtMapper } from '@/@presentation/mappers/settings/price/SettingPriceImpactCountToUtMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceImpactCountToUtUseCase implements ISettingPriceImpactCountToUtUseCase {
    constructor(
      @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceImpactCountToUtRepository)
      private repository: ISettingPriceImpactCountToUtRepository
    ) {}

    async getAdmin(): Promise<SettingPriceImpactCountToUtViewModel[]> {
      const dtos = await this.repository.getAdmin();
      return dtos.map(SettingPriceImpactCountToUtMapper.dtoToView);
    }

    async getByUserId(userId: string): Promise<SettingPriceImpactCountToUtViewModel[]> {
      const dtos = await this.repository.getByUserId(userId);
      return dtos.map(SettingPriceImpactCountToUtMapper.dtoToView);
    }

    async save(settings: SettingPriceImpactCountToUtViewModel[]): Promise<SettingPriceImpactCountToUtViewModel[]> {
      const dtos = settings.map(SettingPriceImpactCountToUtMapper.viewToDto);
      const saved = await this.repository.save(dtos);
      return saved.map(SettingPriceImpactCountToUtMapper.dtoToView);
    }

    async create(viewModel: SettingPriceImpactCountToUtViewModel): Promise<SettingPriceImpactCountToUtViewModel> {
      const dto = SettingPriceImpactCountToUtMapper.viewToDto(viewModel);
      const created = await this.repository.create(dto);
      return SettingPriceImpactCountToUtMapper.dtoToView(created);
    }

    async update(viewModel: SettingPriceImpactCountToUtViewModel): Promise<SettingPriceImpactCountToUtViewModel> {
      const dto = SettingPriceImpactCountToUtMapper.viewToDto(viewModel);
      const updated = await this.repository.update(dto);
      return SettingPriceImpactCountToUtMapper.dtoToView(updated);
    }

    async delete(id: string): Promise<void> {
      return await this.repository.delete(id);
    }
}
