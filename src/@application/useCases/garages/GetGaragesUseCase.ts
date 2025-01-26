import { GarageService } from '@/@application/services/GarageService';

export class GetGaragesUseCase {
  private garageService: GarageService;

  constructor(garageService: GarageService) {
    this.garageService = garageService;
  }

  async execute() {
    return await this.garageService.getAllGarages();
  }
}
