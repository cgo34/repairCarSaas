import { GarageService } from '@/@application/services/GarageService';
import { Garage } from '@/@core/@domain/entities/Garage';

export class CreateGarageUseCase {
  private garageService: GarageService;

  constructor(garageService: GarageService) {
    this.garageService = garageService;
  }

  async execute(garage: Garage) {
    return await this.garageService.createGarage(garage);
  }
}
