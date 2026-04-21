import { ISettingPriceGeneralRepository } from '@/@domain/repositories/settings/price/ISettingPriceGeneralRepository';
import { ISettingPriceGeneralUseCase } from '@/@domain/useCases/settings/price/ISettingPriceGeneralUseCase';
import { SettingPriceGeneralDto } from '@/@application/dtos/settings/price/SettingPriceGeneralDto';
import { SettingPriceGeneralViewModel } from '@/@presentation/types/models/settings/price/SettingPriceGeneralViewModel';
import { SettingPriceGeneralMapper } from '@/@presentation/mappers/settings/price/SettingPriceGeneralMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class SettingPriceGeneralUseCase implements ISettingPriceGeneralUseCase {
  constructor(
    @inject(SYMBOLS.Repositories.Setting.Price.SettingPriceGeneralRepository)
    private repository: ISettingPriceGeneralRepository
  ) {}
  

  async getAdmin(): Promise<SettingPriceGeneralViewModel> {
    const dto = await this.repository.getAdmin();
    return SettingPriceGeneralMapper.dtoToView(dto);
  }

  async getByUserId(userId: string): Promise<SettingPriceGeneralViewModel> {
    const dto = await this.repository.getByUserId(userId);
    return SettingPriceGeneralMapper.dtoToView(dto);
  }

  async save(viewModel: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel> {
    const dto = SettingPriceGeneralMapper.viewToDto(viewModel);
    const saved = await this.repository.save(dto);
    return SettingPriceGeneralMapper.dtoToView(saved);
  }

  async create(viewModel: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel> {
    const dto = SettingPriceGeneralMapper.viewToDto(viewModel);
    const created = await this.repository.create(dto);
    return SettingPriceGeneralMapper.dtoToView(created);
  }

  async update(viewModel: SettingPriceGeneralViewModel): Promise<SettingPriceGeneralViewModel> {
    const dto = SettingPriceGeneralMapper.viewToDto(viewModel);
    const updated = await this.repository.update(dto);
    return SettingPriceGeneralMapper.dtoToView(updated);
  }

  async delete(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}
