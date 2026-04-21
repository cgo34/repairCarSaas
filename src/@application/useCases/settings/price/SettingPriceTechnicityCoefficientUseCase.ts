import { ISettingPriceTechnicityCoefficientRepository } from '@/@domain/repositories/settings/price/ISettingPriceTechnicityCoefficientRepository';
import { ISettingPriceTechnicityCoefficientUseCase } from '@/@domain/useCases/settings/price/ISettingPriceTechnicityCoefficientUseCase';
import { SettingPriceTechnicityCoefficientViewModel } from '@/@presentation/types/models/settings/price/SettingPriceTechnicityCoefficientViewModel';
import { SettingPriceTechnicityCoefficientMapper } from '@/@presentation/mappers/settings/price/SettingPriceTechnicityCoefficientMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceTechnicityCoefficientUseCase implements ISettingPriceTechnicityCoefficientUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceTechnicityCoefficient)
    private repository: ISettingPriceTechnicityCoefficientRepository
  ) {}


  async getAdmin(): Promise<SettingPriceTechnicityCoefficientViewModel> {
    const dto = await this.repository.getAdmin();
    return SettingPriceTechnicityCoefficientMapper.dtoToView(dto);
  }

  async getByUserId(userId: string): Promise<SettingPriceTechnicityCoefficientViewModel> {
    const dto = await this.repository.getByUserId(userId);
    return SettingPriceTechnicityCoefficientMapper.dtoToView(dto);
  }

  async save(viewModel: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel> {
    const dto = SettingPriceTechnicityCoefficientMapper.viewToDto(viewModel);
    const saved = await this.repository.save(dto);
    return SettingPriceTechnicityCoefficientMapper.dtoToView(saved);
  }

  async create(viewModel: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel> {
    const dto = SettingPriceTechnicityCoefficientMapper.viewToDto(viewModel);
    const created = await this.repository.create(dto);
    return SettingPriceTechnicityCoefficientMapper.dtoToView(created);
  }

  async update(viewModel: SettingPriceTechnicityCoefficientViewModel): Promise<SettingPriceTechnicityCoefficientViewModel> {
    const dto = SettingPriceTechnicityCoefficientMapper.viewToDto(viewModel);
    const updated = await this.repository.update(dto);
    return SettingPriceTechnicityCoefficientMapper.dtoToView(updated);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
