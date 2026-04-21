import { IGarageService } from '@/@domain/services/IGarageService';
import { IGarageUseCase } from '@/@domain/useCases/IGarageUseCase';
import { GarageDto } from '@/@application/dtos/GarageDto';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { inject, injectable } from 'inversify';

@injectable()
export class GarageUseCase implements IGarageUseCase {
  constructor(
    @inject(SYMBOLS.Services.GarageService)
    private readonly garageService: IGarageService
  ) {}


  async getGarages(): Promise<GarageDto[]> {
    return this.garageService.getGarages();
  }


  async getByUserId(userId: string): Promise<GarageDto[]> {
    return this.garageService.getByUserId(userId);
  }


  async getById(id: string): Promise<GarageDto | null> {
    return this.garageService.getById(id);
  }


  async create(garage: GarageDto): Promise<GarageDto> {
    return this.garageService.create(garage);
  }


  async update(garage: GarageDto): Promise<GarageDto> {
    return this.garageService.update(garage);
  }


  async delete(id: string): Promise<void> {
    return this.garageService.delete(id);
  }
}
