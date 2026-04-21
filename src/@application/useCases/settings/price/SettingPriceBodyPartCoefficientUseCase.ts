import { ISettingPriceBodyPartCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceBodyPartCoefficientRepository';
import { ISettingPriceBodyPartCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceBodyPartCoefficientUseCase';
import { SettingPriceBodyPartCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceBodyPartCoefficientViewModel';
import { SettingPriceBodyPartCoefficientMapper } from '@/@application/mappers/settings/price/SettingPriceBodyPartCoefficientMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceBodyPartCoefficientUseCase implements ISettingPriceBodyPartCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceBodyPartCoefficient)
    private repository: ISettingPriceBodyPartCoefficientRepository
  ) {}



  async getAdmin(): Promise<SettingPriceBodyPartCoefficientViewModel[]> {
    const dtos = await this.repository.getAdmin();
      return dtos.map(SettingPriceBodyPartCoefficientMapper.dtoToViewModel);
  }

  async getByUserId(userId: string): Promise<SettingPriceBodyPartCoefficientViewModel[]> {
    const dtos = await this.repository.getByUserId(userId);
      return dtos.map(SettingPriceBodyPartCoefficientMapper.dtoToViewModel);
  }

  async save(settings: SettingPriceBodyPartCoefficientViewModel[]): Promise<SettingPriceBodyPartCoefficientViewModel[]> {
    const dtos = settings.map(SettingPriceBodyPartCoefficientMapper.viewModelToDto);
    const saved = await this.repository.save(dtos);
    return saved.map(SettingPriceBodyPartCoefficientMapper.dtoToViewModel);
  }

  async create(viewModel: SettingPriceBodyPartCoefficientViewModel): Promise<SettingPriceBodyPartCoefficientViewModel> {
    const dto = SettingPriceBodyPartCoefficientMapper.viewModelToDto(viewModel);
    const created = await this.repository.create(dto);
    return SettingPriceBodyPartCoefficientMapper.dtoToViewModel(created);
  }

  async update(viewModel: SettingPriceBodyPartCoefficientViewModel): Promise<SettingPriceBodyPartCoefficientViewModel> {
    const dto = SettingPriceBodyPartCoefficientMapper.viewModelToDto(viewModel);
    const updated = await this.repository.update(dto);
    return SettingPriceBodyPartCoefficientMapper.dtoToViewModel(updated);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
