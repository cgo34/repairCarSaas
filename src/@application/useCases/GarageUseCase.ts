import { IGarageService } from '@/@domain/services/IGarageService';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { GarageViewModel } from '@/@presentation/types/models/GarageViewModel';
import { GarageMapper } from '@/@presentation/mappers/GarageMapper';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GarageUseCase implements IGarageUseCase {
  constructor(
    @inject(SYMBOLS.Services.GarageService)
    private readonly garageService: IGarageService
  ) {}


  async getGarages(): Promise<GarageViewModel[]> {
    const dtos = await this.garageService.getGarages();
    return dtos.map(GarageMapper.dtoToView);
  }


  async getByUserId(userId: string): Promise<GarageViewModel[]> {
    const dtos = await this.garageService.getByUserId(userId);
    return dtos.map(GarageMapper.dtoToView);
  }


  async getById(id: string): Promise<GarageViewModel | null> {
    const dto = await this.garageService.getById(id);
    return dto ? GarageMapper.dtoToView(dto) : null;
  }


  async create(garage: GarageViewModel): Promise<GarageViewModel> {
    const dto = GarageMapper.viewToDto(garage);
    const created = await this.garageService.create(dto);
    return GarageMapper.dtoToView(created);
  }


  async update(garage: GarageViewModel): Promise<GarageViewModel> {
    const dto = GarageMapper.viewToDto(garage);
    const updated = await this.garageService.update(dto);
    return GarageMapper.dtoToView(updated);
  }


  async delete(id: string): Promise<void> {
    return await this.garageService.delete(id);
  }
}
